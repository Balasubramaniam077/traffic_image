import React, {useEffect, useState} from 'react';
import Authstack from './Authstack';
import Homestack from './Homestack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';

export default function AppNavigation() {
  const [loggedIn, setloggedIn] = useState(AsyncStorage.getItem('token'));
  const [loding, setLoading] = useState(true);
  const isloggedin = useSelector(state => state.signup.isloggedin);

  useEffect(() => {
    checkAuthentication();
  }, [isloggedin]);

  const checkAuthentication = async () => {
    const token = await AsyncStorage.getItem('token');
    setloggedIn(token !== null);
    setLoading(false);
  };

  return <>{!loding ? loggedIn ? <Homestack /> : <Authstack /> : <></>}</>;
}
