import React, {useEffect, useState, useContext} from 'react';
import Authstack from './Authstack';
import Homestack from './Homestack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserContext} from '../../App';

export default function AppNavigation() {
  const [loggedIn, setloggedIn] = useContext(UserContext);
  const [loding, setLoading] = useState(true);

  useEffect(() => {
    checkAuthentication();
  }, [loggedIn]);

  const checkAuthentication = async () => {
    const token = await AsyncStorage.getItem('token');
    setloggedIn(token !== null);
    setLoading(false);
  };

  return <>{!loding ? loggedIn ? <Homestack /> : <Authstack /> : <></>}</>;
}
