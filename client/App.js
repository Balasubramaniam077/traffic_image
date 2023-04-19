import {NavigationContainer} from '@react-navigation/native';
import AppNavigation from './src/routes/AppNavigation';
import React from 'react';
import {Provider} from 'react-redux';
import store from './src/store';

export default function App() {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <AppNavigation />
      </Provider>
    </NavigationContainer>
  );
}
