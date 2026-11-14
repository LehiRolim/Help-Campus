import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'flex-start',
    paddingHorizontal: 30,
    paddingVertical: 24,
  },

  title: {
    textAlign: 'left',
    fontSize: 25,
    color: 'black',
    fontWeight: 'bold',
    flexShrink: 1,
    alignItems: 'center',
  },

  title_novaOcorrencia: {
    textAlign: 'left',
    fontSize: 25,
    color: 'black',
    fontWeight: 'bold',
    flexShrink: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },

  Icon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    flexShrink: 0,
  },

  linhas: {
    width: '100%',
    borderBottomColor: '#a4a4a4',
    borderBottomWidth: 1,
    marginVertical: 20,
  },

  cabecalhoNova: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },

  botaoVoltar: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  texto_novaOcorrencia: {
    backgroundColor: '#0147f6',
    padding: 10,
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
  },

  posicao_btn_novaOcorrencia: {
    position: 'absolute',
    bottom: 62,
    right: 38,
  },

  campoDescricao: {
    marginTop: 24,
    gap: 8,
  },

  texto_input: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },

  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#a4a4a4',
    borderRadius: 8,
    padding: 12,
    color: '#1f2023',
    textAlignVertical: 'center',
  },

  seletorPrioridade: {
  backgroundColor: '#31343b',
  borderWidth: 1,
  borderColor: '#cccccc',
  borderRadius: 12,
  overflow: 'hidden',
},

  seletorCategoria: {
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#a4a4a4',
    borderRadius: 8,
  },
  textoCategoria: { fontSize: 16, color: '#111827', flexShrink: 1 },
  listaCategorias: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, overflow: 'hidden' },
  opcaoCategoria: {
    minHeight: 48, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12,
  },
  opcaoCategoriaAtiva: { backgroundColor: '#eff6ff' },

  estadoLista: { flex: 1, alignItems: 'center', gap: 16, paddingTop: 24 },
  textoEstadoLista: { color: '#60646c', fontSize: 16, textAlign: 'center' },
  botaoTentarNovamente: {
    minHeight: 48, padding: 14, borderRadius: 8, backgroundColor: '#0147f6',
    justifyContent: 'center', alignItems: 'center',
  },
  conteudoListaOcorrencias: { paddingBottom: 140 },
  cartaoOcorrencia: {
    padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#a4a4a4',
    borderRadius: 12, gap: 8, backgroundColor: '#ffffff',
  },
  tituloCartaoOcorrencia: { fontSize: 17, fontWeight: 'bold', color: '#111827' },
  textoCartaoOcorrencia: { fontSize: 15, color: '#374151' },
  linkDetalhes: { color: '#0147f6', fontWeight: '600', marginTop: 4, alignSelf: 'flex-start' },
  conteudoDetalhes: { paddingTop: 24, paddingBottom: 32, gap: 20 },
  campoDetalhe: { gap: 8 },
  rotuloDetalhe: { fontSize: 14, fontWeight: 'bold', color: '#60646c' },
  valorDetalhe: { fontSize: 17, lineHeight: 25, color: '#111827' },
  botaoFiltro: {
    minWidth: 44, minHeight: 44, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  botaoFiltroAtivo: { backgroundColor: '#eff6ff' },
  painelFiltros: { gap: 12, marginBottom: 16 },
  opcoesFiltro: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  opcaoFiltro: {
    minHeight: 44, paddingHorizontal: 16, paddingVertical: 10,
    borderWidth: 1, borderColor: '#a4a4a4', borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  opcaoFiltroSelecionada: { backgroundColor: '#0147f6', borderColor: '#0147f6' },
  textoOpcaoFiltro: { fontSize: 15, color: '#374151' },
  textoOpcaoFiltroSelecionada: { color: '#ffffff', fontWeight: 'bold' },
  resumoFiltro: {
    flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center',
    justifyContent: 'space-between', gap: 8, marginBottom: 12,
  },
  botaoLimparFiltro: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 },
  textoLimparFiltro: { color: '#0147f6', fontWeight: '600' },

});
