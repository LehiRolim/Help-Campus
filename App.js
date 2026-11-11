import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './login';
import Cadastro from './cadastro';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <Stack.Navigator 
        initialRouteName="login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="cadastro" component={Cadastro} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}