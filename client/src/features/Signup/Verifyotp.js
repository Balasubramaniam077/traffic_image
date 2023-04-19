import React, {useEffect, useState} from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {ActivityIndicator, MD2Colors} from 'react-native-paper';
import {VerifyUser} from './signupSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Validation
import {Formik} from 'formik';
import * as yup from 'yup';

function Verifyotp({navigation}) {
  const error = useSelector(state => state.signup.verify_error);
  const loading = useSelector(state => state.signup.verify_loading);
  const [token, setToken] = useState(useSelector(state => state.signup.token)||useSelector(state => state.login.resend_token));

  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem('verify_token');
      if (value !== null) {
        setToken(value);
      }
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };

  const dispatch = useDispatch();

  const verify_otp = async val => {
    const data = {
      token: token,
      otp: val.otp,
    };
    console.log(data);

    dispatch(VerifyUser(data));
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1}} contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.container}>
          <Text style={styles.headingtext}>Verify OTP</Text>
          <Text style={styles.subtext}>Verify your account</Text>
          <Formik
            initialValues={{otp: ''}}
            onSubmit={values => {
              verify_otp(values);
            }}
            validationSchema={yup.object().shape({
              otp: yup
                .string()
                .length(4, 'OTP must be exactly 4 digits')
                .required('OTP is required'),
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
                  <Text style={styles.labletext}>OTP</Text>
                  <TextInput
                    onChangeText={handleChange('otp')}
                    onBlur={() => setFieldTouched('otp')}
                    value={values.otp}
                    style={styles.input}
                    placeholder="0 0 0 0"
                    placeholderTextColor="#949392"
                  />
                  {touched.otp && errors.otp && (
                    <Text style={{fontSize: 12, color: '#FF0D10'}}>
                      {errors.otp}
                    </Text>
                  )}
                </View>
                {error && (
                  <Text
                    style={{
                      fontSize: 15,
                      color: '#FF0D10',
                      textAlign: 'center',
                      top: 10,
                    }}>
                    {error}
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
                      Verify OTP
                    </Text>
                  </TouchableOpacity>
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

export default Verifyotp;
