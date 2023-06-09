import React, {useState, useEffect} from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';
import {ActivityIndicator, MD2Colors} from 'react-native-paper';
import {loginuser, resendverifyotp} from './loginSlice';

//Validation
import {Formik} from 'formik';
import * as yup from 'yup';

function Login({navigation}) {
  const loading = useSelector(state => state.login.loading);

  const [isshowpass, setisshowpass] = useState(false);

  const [email, setEmail] = useState('');

  const error = useSelector(state => state.login.error);
  const resend_error = useSelector(state => state.login.resend_error);
  const resend_token = useSelector(state => state.login.resend_token);

  const dispatch = useDispatch();

  const Loginfun = async val => {
    const data = {
      email: val.email,
      password: val.password,
    };
    setEmail(val.email);
    dispatch(loginuser(data));
  };

  useEffect(() => {
    console.log(resend_token);
    if (resend_token) {
      console.log('log');
      navigation.navigate('Verifyotp');
    }
  }, [resend_token]);

  const resetverifiction = () => {
    const data = {
      email: email,
    };
    dispatch(resendverifyotp(data));
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1}} contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.container}>
          <Text style={styles.headingtext}>Welcome back</Text>
          <Text style={styles.subtext}>Sign in to your account</Text>
          <Formik
            initialValues={{email: '', password: ''}}
            onSubmit={values => {
              Loginfun(values);
            }}
            validationSchema={yup.object().shape({
              email: yup.string().email().required('Email id is required'),
              password: yup.string().required('Password is required'),
            })}>
            {({
              values,
              handleChange,
              errors,
              setFieldTouched,
              touched,
              isValid,
              handleSubmit,
            }) => (
              <View>
                <View>
                  <Text style={styles.labletext}>Email</Text>
                  <TextInput
                    onChangeText={handleChange('email')}
                    onBlur={() => setFieldTouched('email')}
                    value={values.email}
                    style={styles.input}
                    placeholder="you@example.com"
                    placeholderTextColor="#949392"
                  />
                  {touched.email && errors.email && (
                    <Text style={{fontSize: 12, color: '#FF0D10'}}>
                      {errors.email}
                    </Text>
                  )}
                </View>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems:"center"
                    }}>
                    <Text style={styles.labletext}>Password</Text>
                    <Text style={{right:20}}>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('forgotpwd');
                        }}>
                        <Text style={{color:"#000000"}}>Forgot Password ?</Text>
                      </TouchableOpacity>
                    </Text>
                  </View>
                  <View>
                    <TextInput
                      onChangeText={handleChange('password')}
                      onBlur={() => setFieldTouched('password')}
                      value={values.password}
                      placeholderTextColor="#949392"
                      style={styles.input}
                      placeholder="••••••••"
                      secureTextEntry={!isshowpass}
                    />
                    <Text
                      style={{position: 'absolute', left: 260, top: 9}}
                      onPress={e => {
                        setisshowpass(!isshowpass);
                      }}>
                      <Icon
                        name={isshowpass ? 'eye-slash' : 'eye'}
                        size={20}
                        color="black"
                      />
                    </Text>
                    {touched.password && errors.password && (
                      <Text style={{fontSize: 12, color: '#FF0D10'}}>
                        {errors.password}
                      </Text>
                    )}
                  </View>
                </View>
                {!resend_error ? (
                  error && (
                    <Text
                      style={{
                        fontSize: 15,
                        color: '#FF0D10',
                        textAlign: 'center',
                        top: 10,
                      }}>
                      {error}
                    </Text>
                  )
                ) : (
                  <Text
                    style={{
                      fontSize: 15,
                      color: '#FF0D10',
                      textAlign: 'center',
                      top: 10,
                    }}>
                    {resend_error}
                  </Text>
                )}
                <View style={{paddingTop: 30}}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}
                    disabled={!isValid && !loading}>
                    <Text
                      style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 17,
                      }}>
                      {loading && (
                        <ActivityIndicator
                          animating={true}
                          color={MD2Colors.white}
                        />
                      )}
                      Signin
                    </Text>
                  </TouchableOpacity>
                </View>
                {error === 'Please verify your email to login' && (
                  <Text
                    style={{
                      fontSize: 15,
                      textAlign: 'center',
                      top: 10,
                    }}>
                    Haven't received a verification OTP ?{'\n'}
                    <TouchableOpacity onPress={resetverifiction}>
                      <Text>Resend it here.</Text>
                    </TouchableOpacity>
                  </Text>
                )}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    paddingTop: 25,
                  }}>
                  <Text style={{color: '#7E7E7E'}}>
                    Don't have an account ?{' '}
                  </Text>
                  <Text
                    style={{color: '#949392', textDecorationLine: 'underline'}}
                    onPress={() => navigation.navigate('Signup')}>
                    Sign Up Now
                  </Text>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: 300,
    height: 40,
    backgroundColor: '#FFFFFF07',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: '#707070',
    color: 'black',
    borderWidth: 1,
    borderRadius: 15,
    fontSize: 16,
  },
  button: {
    borderRadius: 10,
    width: 300,
    height: 40,
    backgroundColor: '#34B27B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingtext: {
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
  },
  subtext: {
    color: '#696868',
    fontSize: 15,
    paddingTop: 3,
  },
  labletext: {
    color: '#696868',
    fontSize: 15,
    paddingTop: 25,
    paddingBottom: 5,
  },
  container: {
    paddingLeft: '12%',
    top: '25%',
  },
});

export default Login;
