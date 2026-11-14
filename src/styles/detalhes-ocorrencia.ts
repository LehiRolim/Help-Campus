
import { StyleSheet } from 'react-native';

export const detalhesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },

  botaoVoltar: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    flexShrink: 1,
  },

  conteudo: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 18,
  },

  cartao: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 18,
    gap: 12,
  },

  tituloSecao: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },

  descricao: {
    fontSize: 15,
    lineHeight: 24,
    color: '#4B5563',
  },

  linhaInformacao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },

  iconeContainer: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  informacaoTexto: {
    flex: 1,
    gap: 4,
  },

  rotulo: {
    fontSize: 13,
    color: '#6B7280',
  },

  valor: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },

  separador: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },

  linhaIndicadores: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  indicador: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },

  textoIndicador: {
    fontSize: 13,
    fontWeight: '600',
  },

  prioridadeAlta: {
    backgroundColor: '#FEE2E2',
  },

  textoAlta: {
    color: '#B91C1C',
  },

  prioridadeMedia: {
    backgroundColor: '#FEF3C7',
  },

  textoMedia: {
    color: '#92400E',
  },

  prioridadeBaixa: {
    backgroundColor: '#DCFCE7',
  },

  textoBaixa: {
    color: '#166534',
  },

  painelAcompanhamento: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },

  tituloAcompanhamento: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E40AF',
  },

  textoAcompanhamento: {
    fontSize: 14,
    lineHeight: 21,
    color: '#374151',
  },

  estadoCentralizado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },

  textoEstado: {
    fontSize: 15,
    color: '#60646C',
    textAlign: 'center',
  },

  botaoTentar: {
    backgroundColor: '#0147F6',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 10,
  },

  textoBotaoTentar: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
