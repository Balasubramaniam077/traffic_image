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
import {reset_password} from './forgotpwdSlice';

//Validation
import {Formik} from 'formik';
import * as yup from 'yup';

function ChangePassword({navigation}) {
  const [isshowpass, setisshowpass] = useState(false);
  const [isshowpass_2, setisshowpass_2] = useState(false);

  const token = useSelector(state => state.forgotpwd.token);

  const reset_error = useSelector(state => state.forgotpwd.reset_error);
  const reset_success = useSelector(state => state.forgotpwd.reset_success);
  const reset_loading = useSelector(state => state.forgotpwd.reset_loading);

  const dispatch = useDispatch();

  const Loginfun = async val => {
    const data = {
      token: token,
      password: val.password,
    };
    dispatch(reset_password(data));
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1}} contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.container}>
          <Text style={styles.headingtext}>Change Password</Text>
          <Text style={styles.subtext}>
            You can able to change your password here
          </Text>
          <Formik
            initialValues={{password: '', confirmpassword: ''}}
            onSubmit={values => {
              Loginfun(values);
            }}
            validationSchema={yup.object().shape({
              password: yup.string().required('Password is required'),
              confirmpassword: yup
                .string()
                .oneOf([yup.ref('password'), null], 'Passwords must match')
                .required('Password is required'),
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
                  <View>
                    <Text style={styles.labletext}>Password</Text>
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

                <View>
                  <View>
                    <Text style={styles.labletext}>Confirm Password</Text>
                  </View>
                  <View>
                    <TextInput
                      onChangeText={handleChange('confirmpassword')}
                      onBlur={() => setFieldTouched('confirmpassword')}
                      value={values.confirmpassword}
                      placeholderTextColor="#949392"
                      style={styles.input}
                      placeholder="••••••••"
                      secureTextEntry={!isshowpass_2}
                    />
                    <Text
                      style={{position: 'absolute', left: 260, top: 9}}
                      onPress={e => {
                        setisshowpass_2(!isshowpass_2);
                      }}>
                      <Icon
                        name={isshowpass_2 ? 'eye-slash' : 'eye'}
                        size={20}
                        color="black"
                      />
                    </Text>
                    {touched.confirmpassword && errors.confirmpassword && (
                      <Text style={{fontSize: 12, color: '#FF0D10'}}>
                        {errors.confirmpassword}
                      </Text>
                    )}
                  </View>
                </View>
                {reset_error && (
                  <Text
                    style={{
                      fontSize: 15,
                      color: '#FF0D10',
                      textAlign: 'center',
                      top: 10,
                    }}>
                    {reset_error}
                  </Text>
                )}
                {reset_success && (
                  <Text
                    style={{
                      fontSize: 15,
                      color: '#FF0D10',
                      textAlign: 'center',
                      top: 10,
                    }}>
                    Goto login page click{' '}
                    <Text
                      style={{
                        color: '#000000',
                        textDecorationLine: 'underline',
                      }}
                      onPress={() => navigation.navigate('Login')}>
                      here!
                    </Text>
                  </Text>
                )}
                <View style={{paddingTop: 30}}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}
                    disabled={!isValid && !reset_loading}>
                    <Text
                      style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 17,
                      }}>
                      {reset_loading && (
                        <ActivityIndicator
                          animating={true}
                          color={MD2Colors.white}
                        />
                      )}
                      Change Password
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

export default ChangePassword;
