// @ts-nocheck
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

export default function TermosPrivacidade() {
  const { modoEscuro } = useTheme();
  const temaAtual = modoEscuro ? estilosEscuros : estilosClaros;

  return (
    <ScrollView contentContainerStyle={[styles.container, temaAtual.container]}>
      {/* Cabeçalho */}
      <View style={[styles.headerCard, temaAtual.card]}>
        <Text style={[styles.tituloPrincipal, temaAtual.tituloColor]}>
          TERMOS DE USO E POLÍTICA DE PRIVACIDADE
        </Text>
        <Text style={[styles.subtitulo, temaAtual.subtituloColor]}>
          HELPCAMPUS • Última atualização: 15 de novembro de 2026
        </Text>
        <Text style={[styles.introducao, temaAtual.texto]}>
          Seja bem-vindo ao HelpCampus! Este documento estabelece as regras de utilização da plataforma e a forma como coletamos, usamos e protegemos os seus dados pessoais.
        </Text>
      </View>

      {/* Secção 1 */}
      <View style={[styles.sectionCard, temaAtual.card]}>
        <Text style={[styles.sectionTitle, temaAtual.tituloColor]}>1. Aceitação dos Termos</Text>
        <Text style={[styles.sectionText, temaAtual.texto]}>
          Ao aceder ou utilizar o aplicativo HelpCampus, concorda expressamente com estes Termos de Uso e com a nossa Política de Privacidade. Caso não concorde com alguma das disposições, recomendamos que interrompa imediatamente o uso da plataforma.
        </Text>
      </View>

      {/* Secção 2 */}
      <View style={[styles.sectionCard, temaAtual.card]}>
        <Text style={[styles.sectionTitle, temaAtual.tituloColor]}>2. Sobre a Plataforma</Text>
        <Text style={[styles.sectionText, temaAtual.texto]}>
          O HelpCampus é uma ferramenta digital desenvolvida para facilitar o registo, acompanhamento e gestão de ocorrências e chamados no âmbito académico. A plataforma serve como canal direto entre a comunidade académica e os serviços de suporte.
        </Text>
      </View>

      {/* Secção 3 */}
      <View style={[styles.sectionCard, temaAtual.card]}>
        <Text style={[styles.sectionTitle, temaAtual.tituloColor]}>3. Conduta e Regras de Utilização</Text>
        <Text style={[styles.sectionText, temaAtual.texto]}>
          O utilizador compromete-se a utilizar o aplicativo de forma ética e responsável. É expressamente proibido:
        </Text>
        <Text style={[styles.bulletText, temaAtual.texto]}>• Registar ocorrências falsas, fraudulentas ou com teor ofensivo.</Text>
        <Text style={[styles.bulletText, temaAtual.texto]}>• Utilizar a plataforma para assédio, discriminação ou propagação de conteúdo ilícito.</Text>
        <Text style={[styles.bulletText, temaAtual.texto]}>• Tentar comprometer a segurança, os sistemas ou a base de dados do aplicativo.</Text>
      </View>

      {/* Secção 4 */}
      <View style={[styles.sectionCard, temaAtual.card]}>
        <Text style={[styles.sectionTitle, temaAtual.tituloColor]}>4. Privacidade e Proteção de Dados</Text>
        <Text style={[styles.sectionText, temaAtual.texto]}>
          Os seus dados de autenticação e as ocorrências registadas são armazenados de forma segura através dos serviços do Firebase. Recolhemos apenas as informações estritamente necessárias para o funcionamento do sistema (como nome, e-mail institucional e dados do chamado). Os seus dados nunca serão vendidos a terceiros.
        </Text>
      </View>

      {/* Secção 5 */}
      <View style={[styles.sectionCard, temaAtual.card]}>
        <Text style={[styles.sectionTitle, temaAtual.tituloColor]}>5. Alterações nos Termos</Text>
        <Text style={[styles.sectionText, temaAtual.texto]}>
          Reservamo-nos o direito de atualizar ou modificar estes Termos de Uso a qualquer momento. As alterações entram em vigor imediatamente após a sua publicação na plataforma.
        </Text>
      </View>

      {/* Botão para Fechar / Voltar */}
      <TouchableOpacity 
        style={styles.botaoFechar} 
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Fechar termos de uso e voltar"
      >
        <Ionicons name="arrow-back" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.botaoFecharTexto}>Fechar Termos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const estilosClaros = StyleSheet.create({
  container: { backgroundColor: '#f5f5f5' },
  card: { backgroundColor: '#fff', borderColor: '#e0e0e0' },
  tituloColor: { color: '#0147f6' },
  subtituloColor: { color: '#666' },
  texto: { color: '#333' }
});

const estilosEscuros = StyleSheet.create({
  container: { backgroundColor: '#121212' },
  card: { backgroundColor: '#1e1e1e', borderColor: '#333' },
  tituloColor: { color: '#4b83f6' },
  subtituloColor: { color: '#aaa' },
  texto: { color: '#f1f1f1' }
});

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20 },
  headerCard: { 
    borderRadius: 12, 
    padding: 20, 
    alignItems: 'center', 
    marginBottom: 15, 
    borderWidth: 1,
    elevation: 2 
  },
  tituloPrincipal: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 6 },
  subtitulo: { fontSize: 11, marginBottom: 12, textAlign: 'center' },
  introducao: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
  sectionCard: { 
    borderRadius: 10, 
    padding: 16, 
    marginBottom: 15, 
    borderWidth: 1,
    elevation: 1 
  },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 8 },
  sectionText: { fontSize: 13, lineHeight: 18 },
  bulletText: { fontSize: 13, lineHeight: 18, marginTop: 4, marginLeft: 6 },
  botaoFechar: { 
    backgroundColor: '#0147f6', 
    paddingVertical: 14, 
    borderRadius: 10, 
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 30,
    elevation: 3 
  },
  botaoFecharTexto: { color: '#fff', fontWeight: 'bold', fontSize: 15 }
});
