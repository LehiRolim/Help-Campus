import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';

export default function TelaPerfil({ navigation }) {
  const [usuarioEmail, setUsuarioEmail] = useState('');

  useEffect(() => {
    const usuario = auth.currentUser;
    if (usuario) {
      setUsuarioEmail(usuario.email);
    }
  }, []);

  const deslogar = () => {
    signOut(auth)
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error) => {
        Alert.alert('Erro', 'Não foi possível sair da conta.');
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerCard}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60' }} 
          style={styles.avatar} 
        />
        <Text style={styles.nome}>Mário Junior</Text>
        <Text style={styles.email}>{usuarioEmail || 'mario@aluno.unifor.br'}</Text>
        <Text style={styles.curso}>Análise e Desenvolvimento de Sistemas</Text>
      </View>

      {/* Secção de Configurações */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Configurações</Text>
        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Aviso', 'Configurações em breve.')}>
          <Text style={styles.menuText}>⚙️ Preferências da Conta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Aviso', 'Notificações em breve.')}>
          <Text style={styles.menuText}>🔔 Notificações e Alertas</Text>
        </TouchableOpacity>
      </View>

      {/* Secção Central de Ajuda */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Suporte</Text>
        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Ajuda', 'Central de ajuda do Help Campus.')}>
          <Text style={styles.menuText}>❓ Central de Ajuda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Termos', 'Versão 1.0.0 - Help Campus.')}>
          <Text style={styles.menuText}>📄 Termos de Uso e Privacidade</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Conta</Text>
        <TouchableOpacity style={styles.botaoSair} onPress={deslogar}>
          <Text style={styles.botaoSairTexto}>Sair da Conta </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f5f5f5' },
  headerCard: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 20, 
    alignItems: 'center', 
    marginBottom: 20, 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 15, borderWidth: 2, borderColor: '#0056b3' },
  nome: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  email: { fontSize: 14, color: '#666', marginBottom: 5 },
  curso: { fontSize: 13, color: '#0056b3', fontWeight: '600', textAlign: 'center' },
  
  sectionContainer: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#444', marginBottom: 10, marginLeft: 5 },
  
  menuItem: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 8, 
    borderWidth: 1, 
    borderColor: '#e0e0e0' 
  },
  menuText: { fontSize: 15, color: '#333' },

  botaoSair: { backgroundColor: '#d9534f', padding: 15, borderRadius: 8, alignItems: 'center' },
  botaoSairTexto: { color: '#fff', fontWeight: 'bold', fontSize: 15 }
});