
import { StyleSheet } from 'react-native';

export const stylesResponsavel = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 30,
    paddingVertical: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  titulo: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000000',
    flexShrink: 1,
  },
  iconesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  botaoIcone: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  botaoIconeAtivo: {
    backgroundColor: '#eff6ff',
  },
  divisor: {
    borderBottomWidth: 1,
    borderBottomColor: '#a4a4a4',
    marginVertical: 20,
  },
  painelFiltros: {
    gap: 12,
    marginBottom: 16,
  },
  rotuloFiltro: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#60646c',
  },
  opcoesFiltro: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  opcaoFiltro: {
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#a4a4a4',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  opcaoFiltroSelecionada: {
    backgroundColor: '#0147f6',
    borderColor: '#0147f6',
  },
  textoFiltro: {
    fontSize: 15,
    color: '#374151',
  },
  textoFiltroSelecionado: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  resumoFiltro: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  textoResumo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#60646c',
  },
  limparFiltro: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  textoLimparFiltro: {
    color: '#0147f6',
    fontWeight: '600',
  },
  conteudoLista: {
    paddingBottom: 100,
  },
  cartao: {
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#a4a4a4',
    borderRadius: 12,
    gap: 8,
    backgroundColor: '#ffffff',
  },
  cabecalhoCartao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  tituloCartao: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111827',
    flexShrink: 1,
  },
  textoCartao: {
    fontSize: 15,
    color: '#374151',
  },
  textoDetalhes: {
    color: '#0147f6',
    fontWeight: '600',
    marginTop: 4,
  },
  estadoLista: {
    flex: 1,
    alignItems: 'center',
    gap: 16,
    paddingTop: 24,
  },
  textoEstadoLista: {
    color: '#60646c',
    fontSize: 16,
    textAlign: 'center',
  },
  botaoPrincipal: {
    minHeight: 48,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#0147f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotaoPrincipal: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  conteudoDetalhes: {
    paddingTop: 24,
    paddingBottom: 32,
    gap: 20,
  },
  campoDetalhe: {
    gap: 8,
  },
  rotuloDetalhe: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#60646c',
  },
  valorDetalhe: {
    fontSize: 17,
    lineHeight: 25,
    color: '#111827',
  },
  botaoVoltar: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
