
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { categorias } from '@/constants/categorias';
import { nomesStatus } from '@/constants/status-ocorrencias';
import { stylesResponsavel as styles } from '@/styles/responsavel-ocorrencias';

const prioridades = {
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
};

/**
 * @param {{ titulo: string, valor: string }} props
 */
function Informacao({ titulo, valor }) {
  return (
    <View style={styles.campoDetalhe}>
      <Text style={styles.rotuloDetalhe}>{titulo}</Text>
      <Text selectable style={styles.valorDetalhe}>{valor}</Text>
    </View>
  );
}

/**
 * @typedef {import('@/services/ocorrencias').Ocorrencia} Ocorrencia
 *
 * @typedef {Object} PropsDetalhesResponsavel
 * @property {Ocorrencia | null} ocorrencia
 * @property {boolean} [carregando]
 * @property {string} [erro]
 * @property {() => void} aoVoltar
 * @property {(id: string, novoStatus: import('@/constants/status-ocorrencias').StatusOcorrencia) => Promise<void>} aoAlterarStatus
 */

/** @param {PropsDetalhesResponsavel} props */
export default function DetalhesResponsavel({
  ocorrencia,
  carregando = false,
  erro = '',
  aoVoltar,
  aoAlterarStatus,
}) {
  const [salvando, setSalvando] = useState(false);

  const novoStatus = ocorrencia?.status === 'aberta' ? 'fechada' : 'aberta';
  const acao = novoStatus === 'fechada' ? 'Fechar ocorrência' : 'Reabrir ocorrência';

  function confirmarAlteracao() {
    if (!ocorrencia || salvando) return;

    Alert.alert(
      'Confirmar alteração',
      `Deseja realmente ${novoStatus === 'fechada' ? 'fechar' : 'reabrir'} esta ocorrência?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            setSalvando(true);

            try {
              await aoAlterarStatus(ocorrencia.id, novoStatus);
              Alert.alert('Sucesso', 'Status atualizado com sucesso.');
            } catch (falha) {
              console.error('Erro ao atualizar ocorrência:', falha);
              Alert.alert('Erro', 'Não foi possível atualizar o status. Tente novamente.');
            } finally {
              setSalvando(false);
            }
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingHorizontal: 16 }]}>
      <View style={styles.header}>
        <Pressable
          onPress={aoVoltar}
          style={styles.botaoVoltar}
          accessibilityRole="button"
          accessibilityLabel="Voltar para todas as ocorrências"
        >
          <Ionicons name="arrow-back" size={28} color="#111827" />
        </Pressable>

        <Text accessibilityRole="header" style={styles.titulo}>
          Detalhes da ocorrência
        </Text>
      </View>

      {carregando ? (
        <View style={styles.estadoLista}>
          <ActivityIndicator size="large" color="#0147f6" />
          <Text style={styles.textoEstadoLista}>Carregando detalhes...</Text>
        </View>
      ) : erro ? (
        <View style={styles.estadoLista}>
          <Text accessibilityRole="alert" style={styles.textoEstadoLista}>{erro}</Text>
        </View>
      ) : !ocorrencia ? (
        <View style={styles.estadoLista}>
          <Text style={styles.textoEstadoLista}>
            Ocorrência não encontrada ou indisponível.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.conteudoDetalhes}>
          <Informacao titulo="Descrição" valor={ocorrencia.descricao} />
          <Informacao titulo="Local" valor={ocorrencia.local} />
          <Informacao
            titulo="Categoria"
            valor={categorias.find((item) => item.value === ocorrencia.categoria)?.label ?? ocorrencia.categoria}
          />
          <Informacao
            titulo="Prioridade"
            valor={prioridades[ocorrencia.prioridade] ?? ocorrencia.prioridade}
          />
          <Informacao
            titulo="Status"
            valor={nomesStatus[ocorrencia.status] ?? ocorrencia.status}
          />
          <Informacao
            titulo="Data de criação"
            valor={ocorrencia.criadaEm
              ? ocorrencia.criadaEm.toDate().toLocaleString('pt-BR')
              : 'Aguardando confirmação'}
          />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={acao}
            accessibilityState={{ disabled: salvando }}
            disabled={salvando}
            onPress={confirmarAlteracao}
            style={[styles.botaoPrincipal, salvando && { opacity: 0.6 }]}
          >
            {salvando ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.textoBotaoPrincipal}>{acao}</Text>
            )}
          </Pressable>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
