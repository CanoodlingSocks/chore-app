import React from 'react';
import StackNavigator from './StackNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { UserProvider } from './utils/UserContext';
import 'react-native-gesture-handler';

export default function App() {
  return (
    <NavigationContainer>
      <UserProvider>
        <StackNavigator />
      </UserProvider>
    </NavigationContainer>
  )
}