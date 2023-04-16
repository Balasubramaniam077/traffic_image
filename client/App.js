import {NavigationContainer} from '@react-navigation/native';
import AppNavigation from './src/routes/AppNavigation';
import React, {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext(false);

export default function App() {
  const [loggedIn, setloggedIn] = useState();

  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    setloggedIn(token !== null);
  };

  return (
    <UserContext.Provider value={[loggedIn, setloggedIn]}>
      <NavigationContainer>
        <AppNavigation />
      </NavigationContainer>
    </UserContext.Provider>
  );
}
