import { StyleSheet } from 'react-native';

const estilo = StyleSheet.create({
  // --- Container Principal & Scroll ---
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // --- Logótipo e Título ---
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 12,
    resizeMode: 'contain',
  },
  tituloLogo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitulo: {
    fontSize: 14,
    color: '#000000',
    marginTop: 4,
    fontWeight: '500',
  },

  // --- Formulário e Inputs ---
  formContainer: {
    width: '100%',
  },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: '#333333',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
  },
  inputPassword: {
    paddingRight: 48,
  },
  eyeIcon: {
    position: 'absolute',
    right: 14,
    top: 13,
  },

  // --- Esqueceu a Senha ---
  esqueceuSenhaText: {
    color: '#3B82F6', 
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'right',
    marginBottom: 24,
  },

  // --- Botão Principal ---
  botaoAcessar: {
    height: 50,
    backgroundColor: '#93C5FD', 
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  textoBotaoAcessar: {
    color: '#1E3A8A', 
    fontSize: 18,
    fontWeight: '600',
  },

  // --- Divisor e Ligações ---
  divisorTexto: {
    textAlign: 'center',
    color: '#666666',
    fontSize: 14,
    marginBottom: 0,
  },
  linkCadastrar: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  textoCadastrar: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // --- Rodapé da Tela de Cadastro ---
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
});

export default estilo;