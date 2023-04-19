from flask import Flask, request, jsonify
from datetime import datetime, timedelta
from flask_cors import CORS
from pymongo import MongoClient
from flask_bcrypt import Bcrypt
import jwt
import io
import cv2
import numpy as np
import torch
from torchvision import models, transforms
from PIL import Image
import random
import mail


app = Flask(__name__)
CORS(app,resources={r'/*': {'origins': '*'}})

app.config['MONGO_URI'] = 'mongodb://localhost:27017/'
bcrypt = Bcrypt(app)
app.config['SECRET_KEY'] = 'thisisthesecretkey'

client = MongoClient(app.config['MONGO_URI'])
db = client.ImageApp

# User Collection
user_collection = db.users


# Create Token
def create_token(email):
    payload = {'user_email': str(email),'exp': datetime.utcnow() + timedelta(days=365)}
    token = jwt.encode(payload, app.config['SECRET_KEY'])
    return token


# login
@app.route('/login', methods=['POST'])
def login():
    email = request.json['email']
    password = request.json['password']
    
    try:
        user = user_collection.find_one({'email': email})
        if user and bcrypt.check_password_hash(user['password'], password):
            if user['isVerified']:
                token = create_token(email)

                return jsonify({'token': token,'message':'User Loggedin Successfully'}), 200
            else:

                return jsonify({'message':'Please verify your email to login'}), 400
        else:

            return jsonify({'message': 'Invalid credentials'}), 400
    except:

        return jsonify({'message': 'server_error'}), 400


# Register
@app.route('/register', methods=['POST'])
def register():
    try:
        email = request.json['email']
        user = user_collection.find_one({'email': email})
        if user:
            return jsonify({'message': 'User already exists'}), 400
        else:
            password = bcrypt.generate_password_hash(request.json['password']).decode('utf-8')
            user_collection.insert_one({
                'email': email, 
                'password': password,
                'isVerified': False,
                'createdAt': datetime.utcnow(),
                '_id':email.split('@')[0],
                'otp':''
            })

            token = create_token(email)

            try:
                send_otp(email,"verification")

                return jsonify({'message': 'OTP send Successfully!','token':token}), 201
            
            except Exception as e:

                return jsonify({'message': 'OTP while sending email','token':token}), 401
        
    except Exception as e:

        return jsonify({'message': 'Error while adding data to database'}), 401


#Forgotpassword   
@app.route('/forgot-password',methods=['POST'])
def forgotpassword():
    email = request.json['email']
    try:
        user = user_collection.find_one({'email': email})
        if user:
            send_otp(email,"changepassword")
            token = create_token(email)
            return jsonify({'message':'OTP send to your email id.','token':token}), 200
        else:

            return jsonify({'message':'No User Found!'}), 404
    except:

        return jsonify({'message':'Error while sending the OTP'}), 400
    

# Reset Password
@app.route('/reset-password', methods=['POST'])
def reset_password():
    try:
        token = request.json['token']
        password = request.json['password']
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        email = payload['user_email']
        password = bcrypt.generate_password_hash(password).decode('utf-8')
        user_collection.update_one({'email': email}, {'$set': {'password': password,'otp':''}})

        return jsonify({'message': 'password reset successfull'}), 200
    
    except Exception as e:

        return jsonify({'message': 'Error while resetting password'}), 401


#Send Reset verification OTP
@app.route('/reset-otp', methods=['POST'])
def reset_otp():
    try:
        email = request.json['email']
        send_otp(email,"verification")

        token = create_token(email)
        return jsonify({'message': 'OTP send successfully','token':token}), 200
    
    except Exception as e:
        return jsonify({'message': 'Error while sending the OTP'}), 401


# send OTP
def send_otp(email,type):

    otp = random.randint(1000, 9999)
    user_collection.update_one({'email': email}, {'$set': {'otp': otp}})
    
    send_mail(email, str(otp), type)


# Verify OTP
@app.route('/verify-otp', methods=['POST'])
def verify_otp():
    otp = request.json['otp']
    token = request.json['token']

    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
    
    except jwt.ExpiredSignatureError:
        return jsonify({'message':'Token expired.'}), 400
    
    except (jwt.DecodeError, jwt.InvalidTokenError):
        return jsonify({'message':'Invalid Token.'}), 400

    try:
        email = payload['user_email']
        user_otp = user_collection.find_one({'email': email})['otp']
        print(otp)

        if str(user_otp) == str(otp):

            user_collection.update_one({'email': email}, {'$set': {'otp':'','isVerified': True}})
            return jsonify({'message':'OTP verified successfully.','token':token}), 200
        else:

            return jsonify({'message':'Invalid OTP.'}), 400

    except Exception as e:

        return jsonify({'message':'Error while verifying'}), 400



# Send Mail
def send_mail(email,otp,type):

    if(type=="verification"):
        subject=""" Verify your email address for Alpha Img"""
        body = """Hello User,

        Thank you for signing up for Alpha Img. To complete the registration process, please use the following OTP to verify your account :

        """+otp+"""

        If you did not register for Alpha Img, please ignore this email.
        
        Thanks,
        Alpha Img Team"""

        mail.sendMail(email,subject,body)

    elif(type=="changepassword"):
        subject=""" Password Change Request """
        body = """Dear User,

        We have received a request to change the password for your account. If you did not make this request, please disregard this email.

        If you did request a password change, please use the following OTP to complete the process:

        """+otp+"""

        If you have any questions or concerns, please do not hesitate to contact us.
        
        Thanks,
        Alpha Img Team"""

        mail.sendMail(email,subject,body)

MODEL_PATH = "C:/Users/rk916/OneDrive/Desktop/traffic_image/server/model/Mobilenet.pt"
device = torch.device("cpu")
class_names = [
    "Attention",
    "No_Horn",
    "3",
    "Up_down",
    "Stop"
]


# Defining Model Architecture
def CNN_model(pretrained):
    inf_model = models.densenet121(pretrained=pretrained)
    inf_model.classifier.in_features = len(class_names)
    inf_model.to(torch.device("cpu"))
    return inf_model


inf_model = CNN_model(pretrained=False)

# Loading the Model Trained Weights
inf_model.to(torch.device("cpu"))
inf_model.load_state_dict(torch.load(MODEL_PATH, map_location="cpu"))
inf_model.eval()
print("Inference model Loaded on CPU")

# Image Transform
def transform_image(image_bytes):
    test_transforms = transforms.Compose(
        [
            transforms.ToPILImage(),
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225)),
        ]
    )
    image = Image.open(io.BytesIO(image_bytes))
    image = np.array(image)
    if image.shape[-1] == 4:
        image_cv = cv2.cvtColor(image, cv2.COLOR_RGBA2RGB)
    if image.shape[-1] == 3:
        image_cv = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    if len(image.shape) == 2:
        image_cv = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
    return test_transforms(image_cv).unsqueeze(0)


def get_prediction(image_bytes):
    tensor = transform_image(image_bytes=image_bytes)
    outputs = inf_model.forward(tensor)
    _, prediction = torch.max(outputs, 1)
    print(prediction)
    return class_names[prediction]


# Predicting the Image
@app.route("/api/upload-image", methods=["POST"])
def upload_image():
    image = request.files.get('image')
    try:
        if not image:
            return jsonify({'message': 'No image found'}), 400
        img_bytes = image.read()
        prediction_name = get_prediction(img_bytes)
        return jsonify({'message':prediction_name.lower()})
    except Exception as e:
        return jsonify({'message': 'Error while predicting the image'}), 400


if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0')