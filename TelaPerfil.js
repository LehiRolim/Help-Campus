import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  Switch, 
  Modal, 
  TextInput 
} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';

export default function TelaPerfil({ navigation }) {

  const [nome, setNome] = useState('Mário Junior');
  const [usuarioEmail, setUsuarioEmail] = useState('');
  const [curso, setCurso] = useState('Análise e Desenvolvimento de Sistemas');
  const [matricula, setMatricula] = useState('2310948');

  const [modoEscuro, setModoEscuro] = useState(false);
  const [receberNotificacoes, setReceberNotificacoes] = useState(false);

  const [modalVisivel, setModalVisivel] = useState(false);
  const [editNome, setEditNome] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editCurso, setEditCurso] = useState('');
  const [editMatricula, setEditMatricula] = useState('');

  useEffect(() => {
    const usuario = auth.currentUser;
    if (usuario && usuario.email) {
      setUsuarioEmail(usuario.email);
    } else {
      setUsuarioEmail('mario@aluno.unifor.br');
    }
  }, []);

  const abrirModalEdicao = () => {
    setEditNome(nome);
    setEditEmail(usuarioEmail);
    setEditCurso(curso);
    setEditMatricula(matricula);
    setModalVisivel(true);
  };

  const salvarPerfil = () => {
    if (!editNome.trim()) {
      Alert.alert('Campo Obrigatório', 'Por favor, insira o seu nome.');
      return;
    }
    
    const matriculaLimpa = editMatricula.trim();
    if (!/^\d{7}$/.test(matriculaLimpa)) {
      Alert.alert('Matrícula Inválida', 'A matrícula deve conter exatamente 7 dígitos numéricos.');
      return;
    }

    setNome(editNome);
    setUsuarioEmail(editEmail);
    setCurso(editCurso);
    setMatricula(matriculaLimpa);
    setModalVisivel(false);

    Alert.alert('Sucesso', 'Dados do perfil atualizados com sucesso!');
  };

  const deslogar = () => {
    signOut(auth)
      .then(() => {
        Alert.alert('Sessão Encerrada', 'Você saiu da sua conta.');
      })
      .catch(() => {
        Alert.alert('Erro', 'Não foi possível sair da conta.');
      });
  };

  const temaAtual = modoEscuro ? estilosEscuros : estilosClaros;

  return (
    <ScrollView contentContainerStyle={[styles.container, temaAtual.container]}>

      <View style={[styles.headerCard, temaAtual.card]}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60' }} 
          style={styles.avatar} 
        />
        <Text style={[styles.nome, temaAtual.texto]}>{nome}</Text>
        <Text style={[styles.email, temaAtual.textoSecundario]}>{usuarioEmail}</Text>
        <Text style={styles.curso}>{curso}</Text>
        <Text style={[styles.matricula, temaAtual.textoSecundario]}>Matrícula: {matricula}</Text>

        <TouchableOpacity style={styles.botaoEditar} onPress={abrirModalEdicao}>
          <Text style={styles.botaoEditarTexto}>✏️ Editar Perfil</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, temaAtual.textoTitulo]}>Aparência</Text>
        <View style={[styles.menuItemFlex, temaAtual.card]}>
          <Text style={[styles.menuText, temaAtual.texto]}>🌙 Modo Escuro</Text>
          <Switch 
            value={modoEscuro} 
            onValueChange={setModoEscuro}
            trackColor={{ false: '#767577', true: '#0056b3' }}
            thumbColor={modoEscuro ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, temaAtual.textoTitulo]}>Notificações e Alertas</Text>
        
        <View style={[styles.menuItemFlex, temaAtual.card]}>
          <Text style={[styles.menuText, temaAtual.texto]}>🔔 Receber Notificações</Text>
          <Switch 
            value={receberNotificacoes} 
            onValueChange={setReceberNotificacoes}
            trackColor={{ false: '#767577', true: '#0056b3' }}
            thumbColor={receberNotificacoes ? '#fff' : '#f4f3f4'}
          />
        </View>
        <Text style={[styles.subAviso, temaAtual.textoSecundario]}>
          Você receberá alertas quando seu chamado for solucionado, estiver sendo resolvido, for aceito, recusado ou aguardando resposta.
        </Text>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, temaAtual.textoTitulo]}>Termos de Uso e Privacidade</Text>
        <TouchableOpacity style={[styles.menuItem, temaAtual.card]} onPress={() => navigation.navigate('TermosPrivacidade')}>
          <Text style={[styles.menuText, temaAtual.texto]}>📄 Termos de Uso e Política de Privacidade</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, temaAtual.card]} onPress={() => navigation.navigate('EsqueceuSenha')}>
          <Text style={[styles.menuText, temaAtual.texto]}>🔑 Redefinir Senha</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, temaAtual.textoTitulo]}>Conta</Text>
        <TouchableOpacity style={styles.botaoSair} onPress={deslogar}>
          <Text style={styles.botaoSairTexto}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisivel} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, temaAtual.card]}>
            <Text style={[styles.modalTitulo, temaAtual.texto]}>Editar Perfil</Text>

            <Text style={styles.label}>Nome Completo</Text>
            <TextInput 
              style={[styles.input, temaAtual.input]} 
              value={editNome} 
              onChangeText={setEditNome} 
              placeholder="Nome"
              placeholderTextColor="#888"
            />

            <Text style={styles.label}>E-mail</Text>
            <TextInput 
              style={[styles.input, temaAtual.input]} 
              value={editEmail} 
              onChangeText={setEditEmail} 
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="E-mail"
              placeholderTextColor="#888"
            />

            <Text style={styles.label}>Curso</Text>
            <TextInput 
              style={[styles.input, temaAtual.input]} 
              value={editCurso} 
              onChangeText={setEditCurso} 
              placeholder="Curso"
              placeholderTextColor="#888"
            />

            <Text style={styles.label}>Matrícula (7 dígitos)</Text>
            <TextInput 
              style={[styles.input, temaAtual.input]} 
              value={editMatricula} 
              onChangeText={setEditMatricula} 
              keyboardType="numeric"
              maxLength={7}
              placeholder="Ex: 1234567"
              placeholderTextColor="#888"
            />

            <View style={styles.modalBotoes}>
              <TouchableOpacity style={[styles.modalBotao, styles.botaoCancelar]} onPress={() => setModalVisivel(false)}>
                <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBotao, styles.botaoSalvar]} onPress={salvarPerfil}>
                <Text style={styles.botaoSalvarTexto}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const estilosClaros = StyleSheet.create({
  container: { backgroundColor: '#f5f5f5' },
  card: { backgroundColor: '#fff', borderColor: '#e0e0e0' },
  texto: { color: '#333' },
  textoSecundario: { color: '#666' },
  textoTitulo: { color: '#444' },
  input: { backgroundColor: '#fafafa', color: '#333', borderColor: '#ccc' }
});

const estilosEscuros = StyleSheet.create({
  container: { backgroundColor: '#121212' },
  card: { backgroundColor: '#1e1e1e', borderColor: '#333' },
  texto: { color: '#f1f1f1' },
  textoSecundario: { color: '#aaa' },
  textoTitulo: { color: '#ccc' },
  input: { backgroundColor: '#2a2a2a', color: '#fff', borderColor: '#444' }
});

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20 },
  headerCard: { 
    borderRadius: 12, 
    padding: 20, 
    alignItems: 'center', 
    marginBottom: 20, 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1
  },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 15, borderWidth: 2, borderColor: '#0056b3' },
  nome: { fontSize: 20, fontWeight: 'bold', marginBottom: 3 },
  email: { fontSize: 14, marginBottom: 3 },
  curso: { fontSize: 13, color: '#0056b3', fontWeight: '600', textAlign: 'center', marginBottom: 4 },
  matricula: { fontSize: 13, fontWeight: '500', marginBottom: 12 },
  
  botaoEditar: { 
    backgroundColor: '#e9ecef', 
    paddingVertical: 8, 
    paddingHorizontal: 16, 
    borderRadius: 20,
    marginTop: 5
  },
  botaoEditarTexto: { color: '#0056b3', fontWeight: '600', fontSize: 13 },

  sectionContainer: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, marginLeft: 5 },
  
  menuItem: { 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 8, 
    borderWidth: 1 
  },
  menuItemFlex: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 8, 
    borderWidth: 1 
  },
  menuText: { fontSize: 15 },
  subAviso: { fontSize: 12, marginTop: 4, marginLeft: 5, fontStyle: 'italic', lineHeight: 16 },

  botaoSair: { backgroundColor: '#d9534f', padding: 15, borderRadius: 8, alignItems: 'center' },
  botaoSairTexto: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20 
  },
  modalCard: { 
    width: '100%', 
    maxWidth: 400, 
    borderRadius: 12, 
    padding: 20, 
    borderWidth: 1,
    elevation: 5 
  },
  modalTitulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  label: { fontSize: 12, color: '#888', marginBottom: 4, fontWeight: '600' },
  input: { 
    padding: 12, 
    borderRadius: 8, 
    borderWidth: 1, 
    marginBottom: 12, 
    fontSize: 14 
  },
  modalBotoes: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  modalBotao: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 6, marginLeft: 10 },
  botaoCancelar: { backgroundColor: '#6c757d' },
  botaoCancelarTexto: { color: '#fff', fontWeight: 'bold' },
  botaoSalvar: { backgroundColor: '#0056b3' },
  botaoSalvarTexto: { color: '#fff', fontWeight: 'bold' }
});