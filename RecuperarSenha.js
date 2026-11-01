import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebaseConfig';

export default function RecuperarSenha({ navigation }) {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const lidarComRecuperacao = () => {
    setMensagem('');
    setErro('');

    if (!email) {
      setErro('Por favor, digite o seu e-mail cadastrado.');
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        setMensagem('E-mail de recuperação enviado com sucesso! Verifique a sua caixa de entrada.');
      })
      .catch((error) => {
        console.log("Erro Firebase:", error.code, error.message);
        if (error.code === 'auth/user-not-found') {
          setErro('Não existe nenhuma conta associada a este e-mail.');
        } else if (error.code === 'auth/invalid-email') {
          setErro('O formato do e-mail é inválido.');
        } else {
          setErro('Erro ao enviar e-mail: ' + error.message);
        }
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Recuperar Senha</Text>
        <Text style={styles.subtitulo}>
          Insira o seu e-mail para receber as instruções de redefinição de senha com segurança.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail cadastrado"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {mensagem ? <Text style={styles.sucessoTexto}>{mensagem}</Text> : null}
        {erro ? <Text style={styles.erroTexto}>{erro}</Text> : null}

        <TouchableOpacity style={styles.botao} onPress={lidarComRecuperacao}>
          <Text style={styles.botaoTexto}>Enviar Instruções</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.link} onPress={() => navigation.goBack()}>
          <Text style={styles.linkTexto}>← Voltar ao Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  card: { 
    backgroundColor: '#fff', 
    padding: 25, 
    borderRadius: 12, 
    width: '100%',
    maxWidth: 450,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#333' },
  subtitulo: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 25, lineHeight: 20 },
  input: { 
    backgroundColor: '#fafafa', 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: '#ddd',
    fontSize: 15,
    color: '#333'
  },
  sucessoTexto: { color: '#28a745', fontSize: 14, textAlign: 'center', marginBottom: 15, fontWeight: '600' },
  erroTexto: { color: '#d9534f', fontSize: 14, textAlign: 'center', marginBottom: 15, fontWeight: '600' },
  botao: { backgroundColor: '#0056b3', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 5 },
  botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: { marginTop: 20, alignItems: 'center' },
  linkTexto: { color: '#0056b3', fontSize: 14, fontWeight: '600' }
});