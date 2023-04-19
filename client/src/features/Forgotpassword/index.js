import React, {useState, useEffect} from 'react';
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
import {forgotpasswordfun, verify_forgot} from './forgotpwdSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Validation
import {Formik} from 'formik';
import * as yup from 'yup';

function ForgotPassword({navigation}) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const error = useSelector(state => state.forgotpwd.error);
  const loading = useSelector(state => state.forgotpwd.loading);
  const token = useSelector(state => state.forgotpwd.token);

  const verify_loading = useSelector(state => state.forgotpwd.verify_loading);
  const verify_error = useSelector(state => state.forgotpwd.verify_error);
  const verify_success = useSelector(state => state.forgotpwd.verify_success);

  const dispatch = useDispatch();

  const forgotpass = async val => {
    const data = {
      email: val.email,
    };
    setEmail(val.email);
    dispatch(forgotpasswordfun(data));
  };

  const verify_otp = () => {
    const data = {
      otp: otp,
      token: token,
    };
    dispatch(verify_forgot(data));
  };

  if (verify_success) {
    navigation.navigate('changepwd');
  }

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1}} contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.container}>
          {token ? (
            <View>
              <Text style={styles.headingtext}>Verify OTP</Text>
              <Text style={styles.subtext}>Verify your account</Text>
              <View>
                <Text style={styles.labletext}>OTP</Text>
                <TextInput
                  onChangeText={val => {
                    setOtp(val);
                  }}
                  value={otp}
                  maxLength={4}
                  style={styles.input}
                  placeholder="0 0 0 0"
                  placeholderTextColor="#949392"
                />
              </View>
              {verify_error && (
                <Text
                  style={{
                    fontSize: 15,
                    color: '#FF0D10',
                    textAlign: 'center',
                    top: 10,
                  }}>
                  {verify_error}
                </Text>
              )}
              <View style={{paddingTop: 30}}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={verify_otp}
                  disabled={verify_loading}>
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: 17,
                    }}>
                    {verify_loading && (
                      <ActivityIndicator
                        animating={true}
                        color={MD2Colors.white}
                      />
                    )}
                    Verify
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <Text style={styles.headingtext}>Forgot Password</Text>
              <Text style={styles.subtext}>
                Type in your email and we'll send you a OTP to reset your
                password
              </Text>
              <Formik
                initialValues={{email: ''}}
                onSubmit={values => {
                  forgotpass(values);
                }}
                validationSchema={yup.object().shape({
                  email: yup.string().email().required('Email id is required'),
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
                          Send OTP
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        paddingTop: 25,
                      }}>
                      <Text style={{color: '#7E7E7E'}}>Have an account ? </Text>
                      <Text
                        style={{
                          color: '#949392',
                          textDecorationLine: 'underline',
                        }}
                        onPress={() => navigation.navigate('Login')}>
                        Sign In Now
                      </Text>
                    </View>
                  </View>
                )}
              </Formik>
            </View>
          )}
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

export default ForgotPassword;
