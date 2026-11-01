import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TelaPerfil from './TelaPerfil';
import RecuperarSenha from './RecuperarSenha';

const Stack = createNativeStackNavigator();

// Tela de login enquanto o ismael faz a dele
function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Help Campus - Login</Text>
      
      <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('Perfil')}>
        <Text style={styles.botaoTexto}>Entrar (Ir para Perfil)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('EsqueceuSenha')}>
        <Text style={styles.linkTexto}>Esqueci minha senha</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Entrar' }} />
        <Stack.Screen name="Perfil" component={TelaPerfil} options={{ title: 'Perfil do Utilizador' }} />
        <Stack.Screen name="EsqueceuSenha" component={RecuperarSenha} options={{ title: 'Recuperação de Senha' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#333' },
  botao: { backgroundColor: '#0056b3', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: { marginTop: 15, alignItems: 'center' },
  linkTexto: { color: '#0056b3', fontSize: 14 }
});