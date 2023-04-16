import React, {useState, useContext} from 'react';
import {Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Image,
  Modal,
  Text,
  Pressable,
  View,
  TouchableWithoutFeedback,
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserContext} from '../../../App';
import {styles} from './styles';
import config from '../../utils/api';

export default function Home({navigation}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [file, setFile] = useState({});
  const {width, height} = Dimensions.get('screen');
  const [loggedIn, setloggedIn] = useContext(UserContext);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  // Open camera to capture Image
  const captureImage = async type => {
    let options = {
      mediaType: type,
      quality: 10,
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, response => {
        if (response.didCancel) {
          alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }
        setFile(response);
      });
    }
    setModalVisible(!modalVisible);
  };

  //Open Galery to chose Image
  const chooseFile = type => {
    let options = {
      mediaType: type,
      quality: 10,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
      setFile(response);
    });
    setModalVisible(!modalVisible);
  };

  const uploadImage = () => {
    const data = new FormData();
    data.append('image', {
      uri: file.assets[0].uri,
      type: 'image/jpeg',
      name: 'image.jpg',
    });

    fetch(config.apiUrl + 'api/upload-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: data,
    })
      .then(response => response.json())
      .then(data => {
        // console.log(data.message)
        navigation.navigate('PlayVideo', {Id: `${data.message}`});
      });
  };

  const Logout = async () => {
    await AsyncStorage.removeItem('token');
    setloggedIn('fasle');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.LogoutBtn} onPress={Logout}>
        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 17}}>
          Logout
        </Text>
      </TouchableOpacity>
      <View>
        <TouchableWithoutFeedback
          onPress={() => {
            setModalVisible(!modalVisible);
          }}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <TouchableWithoutFeedback
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              <View style={{flex: 1}}>
                <TouchableWithoutFeedback onPress={() => {}}>
                  <View>
                    <View style={styles.modalView}>
                      <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => captureImage('photo')}>
                        <Text style={styles.textStyle}>Open Camera</Text>
                      </Pressable>
                      <View style={{paddingTop: 20}}>
                        <Pressable
                          style={[styles.button, styles.buttonClose]}
                          onPress={() => chooseFile('photo')}>
                          <Text style={styles.textStyle}>
                            Select from Galery
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPress={() => {
            setModalVisible(true);
          }}>
          {Object.keys(file).length === 0 ? (
            <View style={styles.selectArea}>
              <Text style={{textAlign: 'center'}}>
                <Icon name="file-image-plus-outline" size={30} />
              </Text>
              <Text style={{textAlign: 'center'}}>Select Image</Text>
            </View>
          ) : (
            <View style={styles.imgcontainer}>
              <View style={styles.imageWrapper}>
                <Image
                  style={{
                    width: width / 1.2,
                    height: height / 5,
                    borderRadius: 10,
                  }}
                  source={{
                    uri: file.assets[0].uri,
                  }}
                />
              </View>
              <View style={{paddingTop: 30}}>
                <TouchableOpacity
                  style={styles.PredictBtn}
                  onPress={uploadImage}>
                  <Text
                    style={{color: 'white', fontWeight: 'bold', fontSize: 17}}>
                    Predict
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}
