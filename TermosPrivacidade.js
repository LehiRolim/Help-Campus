import React from 'react';
import { StyleSheet, Text, ScrollView, View, TouchableOpacity } from 'react-native';

export default function TermosPrivacidade({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.tituloPrincipal}>TERMOS DE USO E POLÍTICA DE PRIVACIDADE</Text>
        <Text style={styles.subtitulo}>HELPCAMPUS • Última atualização: 01 de novembro de 2026</Text>

        <Text style={styles.paragrafo}>
          Seja bem-vindo ao HelpCampus! Este documento estabelece as regras de utilização da plataforma e a forma como coletamos, usamos e protegemos os seus dados pessoais. Ao se cadastrar ou utilizar nossos serviços, você concorda expressamente com os termos aqui descritos.
        </Text>

        <Text style={styles.secaoTitulo}>PARTE 1: TERMOS DE USO</Text>
        
        <Text style={styles.itemTitulo}>1. Objeto e Descrição do Serviço</Text>
        <Text style={styles.paragrafo}>
          O HelpCampus é uma plataforma educacional desenvolvida para apoiar o ambiente escolar e universitário, oferecendo recursos como:
        </Text>
        <Text style={styles.bullet}>• Acompanhamento do progresso acadêmico e relatórios de estudante;</Text>
        <Text style={styles.bullet}>• Comunicação via chat multiusuário e mensagens;</Text>
        <Text style={styles.bullet}>• Gestão e visualização de conteúdos educativos e vídeos (com suporte a acesso offline);</Text>
        <Text style={styles.bullet}>• Registro de frequência e gestão de turmas.</Text>

        <Text style={styles.itemTitulo}>2. Cadastro e Contas de Usuário</Text>
        <Text style={styles.bullet}>• **Elegibilidade:** O acesso ao HelpCampus é destinado a estudantes, professores e gestores educacionais. Menores de idade devem ter o consentimento dos pais ou responsáveis legais.</Text>
        <Text style={styles.bullet}>• **Veracidade das Informações:** O usuário compromete-se a fornecer dados exatos e verdadeiros.</Text>
        <Text style={styles.bullet}>• **Segurança da Conta:** A senha é pessoal e intransferível, sendo de responsabilidade exclusiva do usuário.</Text>

        <Text style={styles.itemTitulo}>3. Regras de Conduta e Uso Aceitável</Text>
        <Text style={styles.paragrafo}>É expressamente proibido transmitir conteúdos ofensivos, enviar spam, burlar mecanismos de segurança ou realizar engenharia reversa na plataforma.</Text>

        <Text style={styles.itemTitulo}>4. Propriedade Intelectual</Text>
        <Text style={styles.paragrafo}>Todo o código, design, interfaces e marcas do HelpCampus são protegidos por direitos autorais. Materiais didáticos permanecem sob propriedade de seus respectivos autores.</Text>

        <Text style={styles.itemTitulo}>5. Limitação de Responsabilidade</Text>
        <Text style={styles.paragrafo}>O HelpCampus empenha-se em manter o sistema contínuo, mas não garante ausência de interrupções temporárias por manutenções ou falhas de rede.</Text>

        <Text style={styles.secaoTitulo}>PARTE 2: POLÍTICA DE PRIVACIDADE (LGPD)</Text>

        <Text style={styles.itemTitulo}>1. Informações que Coletamos</Text>
        <Text style={styles.bullet}>• **Dados de Cadastro:** Nome, e-mail, foto, tipo de perfil e vínculo institucional.</Text>
        <Text style={styles.bullet}>• **Dados Acadêmicos e Uso:** Presença, notas, progresso, mensagens e interações.</Text>
        <Text style={styles.bullet}>• **Dados Técnicos:** IP, tipo de navegador, modelo do dispositivo e dados offline.</Text>

        <Text style={styles.itemTitulo}>2. Finalidade do Tratamento dos Dados</Text>
        <Text style={styles.paragrafo}>Utilizamos os dados para prestação dos serviços, personalização de relatórios, comunicação de avisos escolares e segurança da plataforma.</Text>

        <Text style={styles.itemTitulo}>3. Compartilhamento de Dados</Text>
        <Text style={styles.paragrafo}>Não vendemos dados. O compartilhamento ocorre apenas com a instituição de ensino para fins pedagógicos, provedores de infraestrutura em nuvem essenciais ou exigência judicial.</Text>

        <Text style={styles.itemTitulo}>4. Direitos do Titular (LGPD)</Text>
        <Text style={styles.paragrafo}>Você tiene direito de confirmar o tratamento, acessar, corrigir ou excluir seus dados, além de revogar o consentimento a qualquer momento.</Text>

        <Text style={styles.secaoTitulo}>PARTE 3: CONTATO</Text>
        <Text style={styles.paragrafo}>
          Para exercer seus direitos ou tirar dúvidas com o Encarregado de Proteção de Dados (DPO), entre em contato através do e-mail de suporte da plataforma.
        </Text>

        <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
          <Text style={styles.botaoVoltarTexto}>Fechar Termos</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f5f5f5' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, elevation: 3 },
  tituloPrincipal: { fontSize: 18, fontWeight: 'bold', color: '#0056b3', textAlign: 'center', marginBottom: 5 },
  subtitulo: { fontSize: 12, color: '#666', textAlign: 'center', marginBottom: 20 },
  secaoTitulo: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 20, marginBottom: 10 },
  itemTitulo: { fontSize: 14, fontWeight: 'bold', color: '#444', marginTop: 10, marginBottom: 5 },
  paragrafo: { fontSize: 13, color: '#555', lineHeight: 18, marginBottom: 8 },
  bullet: { fontSize: 13, color: '#555', lineHeight: 18, marginLeft: 10, marginBottom: 4 },
  botaoVoltar: { backgroundColor: '#0056b3', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 25 },
  botaoVoltarTexto: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});