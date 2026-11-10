import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TelaPerfil from './TelaPerfil';
import RecuperarSenha from './RecuperarSenha';
import TermosPrivacidade from './TermosPrivacidade';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Perfil">
        <Stack.Screen 
          name="Perfil" 
          component={TelaPerfil} 
          options={{ title: 'Perfil do Utilizador' }} 
        />
        <Stack.Screen 
          name="EsqueceuSenha" 
          component={RecuperarSenha} 
          options={{ title: 'Recuperação de Senha' }} 
        />
        <Stack.Screen 
          name="TermosPrivacidade" 
          component={TermosPrivacidade} 
          options={{ 
            title: 'Termos de Uso e Privacidade',
            presentation: 'modal',
            headerShown: true
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}