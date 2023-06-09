import React, {useState} from 'react';
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
import {signupUser} from './signupSlice';

//Validation
import {Formik} from 'formik';
import * as yup from 'yup';

function Signup({navigation}) {
  const [isshowpass, setisshowpass] = useState(false);

  const error = useSelector(state => state.signup.error);
  const loading = useSelector(state => state.signup.loading);
  const token = useSelector(state => state.signup.token);

  const dispatch = useDispatch();

  const Signupfun = async val => {
    const data = {
      email: val.email,
      password: val.password,
    };

    dispatch(signupUser(data));
  };

  if(token){
    navigation.navigate('Verifyotp');
  }

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1}} contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.container}>
          <Text style={styles.headingtext}>Get started</Text>
          <Text style={styles.subtext}>Create a new account</Text>
          <Formik
            initialValues={{email: '', password: ''}}
            onSubmit={values => {
              Signupfun(values);
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
                  <Text style={styles.labletext}>Password</Text>
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
                      Signup
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
                    style={{color: '#949392', textDecorationLine: 'underline'}}
                    onPress={() => navigation.navigate('Login')}>
                    Sign In Now
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

export default Signup;
