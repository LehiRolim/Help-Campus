
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { categorias } from '@/constants/categorias';
import { filtrosStatus, nomesStatus } from '@/constants/status-ocorrencias';
import { stylesResponsavel as styles } from '@/styles/responsavel-ocorrencias';

const filtrosPrioridade = [
  { value: 'todas', label: 'Todas' },
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Média' },
  { value: 'baixa', label: 'Baixa' },
];

const nomesPrioridade = {
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
};

/**
 * @typedef {import('@/services/ocorrencias').Ocorrencia} Ocorrencia
 *
 * @typedef {Object} PropsResponsavel
 * @property {Ocorrencia[]} ocorrencias
 * @property {boolean} [carregando]
 * @property {string} [erro]
 * @property {(id: string) => void} aoAbrirDetalhes
 * @property {() => void} [aoAbrirPerfil]
 * @property {() => void} [aoTentarNovamente]
 */

/** @param {PropsResponsavel} props */

export default function TelaResponsavelOcorrencias({
  ocorrencias = [],
  carregando = false,
  erro = '',
  aoAbrirDetalhes,
  aoAbrirPerfil,
  aoTentarNovamente,
}) {
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState('todas');
  const [filtroPrioridade, setFiltroPrioridade] = useState('todas');

  const ocorrenciasFiltradas = ocorrencias.filter((item) => {
    const statusCorreto = filtroStatus === 'todas' || item.status === filtroStatus;
    const prioridadeCorreta = filtroPrioridade === 'todas' || item.prioridade === filtroPrioridade;
    return statusCorreto && prioridadeCorreta;
  });

  const filtrosAtivos = filtroStatus !== 'todas' || filtroPrioridade !== 'todas';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Todas as ocorrências</Text>

        <View style={styles.iconesHeader}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Filtrar ocorrências"
            accessibilityState={{ expanded: filtrosAbertos }}
            onPress={() => setFiltrosAbertos((valor) => !valor)}
            style={[styles.botaoIcone, filtrosAtivos && styles.botaoIconeAtivo]}
          >
            <Ionicons
              name={filtrosAtivos ? 'funnel' : 'funnel-outline'}
              size={25}
              color="#0147f6"
            />
          </Pressable>

          {aoAbrirPerfil && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Abrir perfil"
              onPress={aoAbrirPerfil}
              style={styles.botaoIcone}
            >
              <Ionicons name="person-circle" size={29} color="#0147f6" />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.divisor} />

      {filtrosAbertos && (
        <View style={styles.painelFiltros}>
          <Text style={styles.rotuloFiltro}>Filtrar por status</Text>

          <View style={styles.opcoesFiltro}>
            {filtrosStatus.map((opcao) => (
              <Pressable
                key={opcao.value}
                accessibilityRole="radio"
                accessibilityState={{ checked: filtroStatus === opcao.value }}
                onPress={() => setFiltroStatus(opcao.value)}
                style={[
                  styles.opcaoFiltro,
                  filtroStatus === opcao.value && styles.opcaoFiltroSelecionada,
                ]}
              >
                <Text style={[
                  styles.textoFiltro,
                  filtroStatus === opcao.value && styles.textoFiltroSelecionado,
                ]}>
                  {opcao.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.rotuloFiltro}>Filtrar por prioridade</Text>

          <View style={styles.opcoesFiltro}>
            {filtrosPrioridade.map((opcao) => (
              <Pressable
                key={opcao.value}
                accessibilityRole="radio"
                accessibilityState={{ checked: filtroPrioridade === opcao.value }}
                onPress={() => setFiltroPrioridade(opcao.value)}
                style={[
                  styles.opcaoFiltro,
                  filtroPrioridade === opcao.value && styles.opcaoFiltroSelecionada,
                ]}
              >
                <Text style={[
                  styles.textoFiltro,
                  filtroPrioridade === opcao.value && styles.textoFiltroSelecionado,
                ]}>
                  {opcao.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {!carregando && !erro && (
        <View style={styles.resumoFiltro}>
          <Text style={styles.textoResumo}>
            Ocorrências encontradas: {ocorrenciasFiltradas.length}
          </Text>

          {filtrosAtivos && (
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setFiltroStatus('todas');
                setFiltroPrioridade('todas');
              }}
              style={styles.limparFiltro}
            >
              <Text style={styles.textoLimparFiltro}>Limpar filtros</Text>
            </Pressable>
          )}
        </View>
      )}

      {carregando ? (
        <View style={styles.estadoLista}>
          <ActivityIndicator color="#0147f6" size="large" />
          <Text style={styles.textoEstadoLista}>Carregando ocorrências...</Text>
        </View>
      ) : erro ? (
        <View style={styles.estadoLista}>
          <Text accessibilityRole="alert" style={styles.textoEstadoLista}>
            {erro}
          </Text>

          {aoTentarNovamente && (
            <Pressable
              accessibilityRole="button"
              style={styles.botaoPrincipal}
              onPress={aoTentarNovamente}
            >
              <Text style={styles.textoBotaoPrincipal}>Tentar novamente</Text>
            </Pressable>
          )}
        </View>
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={ocorrenciasFiltradas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.conteudoLista}
          ListEmptyComponent={
            <Text style={styles.textoEstadoLista}>
              Nenhuma ocorrência encontrada.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.cartao}>
              <View style={styles.cabecalhoCartao}>
                <Text style={styles.tituloCartao}>
                  {categorias.find((categoria) => categoria.value === item.categoria)?.label ?? item.categoria}
                </Text>

                <Ionicons
                  name={item.status === 'fechada' ? 'checkmark-circle' : 'ellipse-outline'}
                  size={22}
                  color={item.status === 'fechada' ? '#15803d' : '#6b7280'}
                />
              </View>

              <Text style={styles.textoCartao}>{item.descricao}</Text>
              <Text style={styles.textoCartao}>Local: {item.local}</Text>
              <Text style={styles.textoCartao}>
                Prioridade: {nomesPrioridade[item.prioridade] ?? item.prioridade}
              </Text>
              <Text style={styles.textoCartao}>
                Status: {nomesStatus[item.status] ?? item.status}
              </Text>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Ver detalhes da ocorrência: ${item.descricao}`}
                onPress={() => aoAbrirDetalhes?.(item.id)}
              >
                <Text style={styles.textoDetalhes}>Ver detalhes →</Text>
              </Pressable>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
