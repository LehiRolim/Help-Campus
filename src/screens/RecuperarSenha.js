// @ts-nocheck
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function RecuperarSenha() {
  const { modoEscuro } = useTheme();
  const temaAtual = modoEscuro ? estilosEscuros : estilosClaros;

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
        setMensagem('E-mail de redefinição enviado com sucesso! Verifique a sua caixa de entrada.');
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
    <ScrollView contentContainerStyle={[styles.container, temaAtual.container]}>
      <View style={[styles.card, temaAtual.card]}>
        <Text style={[styles.titulo, temaAtual.textoTitulo]}>Redefinir Senha</Text>
        <Text style={[styles.subtitulo, temaAtual.textoSecundario]}>
          Insira o seu e-mail para receber as instruções de redefinição de senha com segurança.
        </Text>

        <TextInput
          style={[styles.input, temaAtual.input]}
          placeholder="Digite seu e-mail cadastrado"
          placeholderTextColor={modoEscuro ? "#888" : "#888"}
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

        <TouchableOpacity style={styles.link} onPress={() => router.back()}>
          <Text style={[styles.linkTexto, { color: modoEscuro ? '#4b83f6' : '#0056b3' }]}>← Voltar ao Perfil</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const estilosClaros = StyleSheet.create({
  container: { backgroundColor: '#f5f5f5' },
  card: { backgroundColor: '#fff', borderColor: '#ddd' },
  textoTitulo: { color: '#333' },
  textoSecundario: { color: '#666' },
  input: { backgroundColor: '#fafafa', color: '#333', borderColor: '#ddd' }
});

const estilosEscuros = StyleSheet.create({
  container: { backgroundColor: '#121212' },
  card: { backgroundColor: '#1e1e1e', borderColor: '#333' },
  textoTitulo: { color: '#f1f1f1' },
  textoSecundario: { color: '#aaa' },
  input: { backgroundColor: '#2a2a2a', color: '#fff', borderColor: '#444' }
});

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { 
    padding: 25, 
    borderRadius: 12, 
    width: '100%',
    maxWidth: 450,
    elevation: 3,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitulo: { fontSize: 14, textAlign: 'center', marginBottom: 25, lineHeight: 20 },
  input: { 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 15, 
    borderWidth: 1, 
    fontSize: 15,
  },
  sucessoTexto: { color: '#28a745', fontSize: 14, textAlign: 'center', marginBottom: 15, fontWeight: '600' },
  erroTexto: { color: '#d9534f', fontSize: 14, textAlign: 'center', marginBottom: 15, fontWeight: '600' },
  botao: { backgroundColor: '#0056b3', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 5 },
  botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: { marginTop: 20, alignItems: 'center' },
  linkTexto: { fontSize: 14, fontWeight: '600' }
});