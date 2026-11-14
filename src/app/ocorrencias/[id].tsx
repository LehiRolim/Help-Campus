import { Ionicons } from '@react-native-vector-icons/ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { categorias } from '@/constants/categorias';
import { nomesStatus } from '@/constants/status-ocorrencias';
import { acompanharOcorrencia, garantirUsuario, type Ocorrencia } from '@/services/ocorrencias';
import { styles } from '@/styles/ocorrencias';

const prioridades = { alta: 'Alta', media: 'Média', baixa: 'Baixa' };

type Estado =
  | { tipo: 'carregando' }
  | { tipo: 'erro' }
  | { tipo: 'indisponivel' }
  | { tipo: 'pronto'; ocorrencia: Ocorrencia };

function voltar() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

function Informacao({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <View style={styles.campoDetalhe}>
      <Text style={styles.rotuloDetalhe}>{titulo}</Text>
      <Text selectable style={styles.valorDetalhe}>{valor}</Text>
    </View>
  );
}

function ConteudoDetalhes({ id }: { id: string | undefined }) {
  const [estado, setEstado] = useState<Estado>({ tipo: 'carregando' });
  const [tentativa, setTentativa] = useState(0);
  const idValido = !!id && !id.includes('/');

  useEffect(() => {
    if (!id || !idValido) return;

    let ativo = true;
    let cancelar: (() => void) | undefined;

    function falhar(erro: unknown) {
      if (!ativo) return;
      console.error('Erro ao carregar detalhes da ocorrência:', erro);
      setEstado({ tipo: 'erro' });
    }

    garantirUsuario().then((usuario) => {
      if (!ativo) return;

      cancelar = acompanharOcorrencia(id, usuario.uid, (ocorrencia) => {
        if (!ativo) return;
        setEstado(ocorrencia
          ? { tipo: 'pronto', ocorrencia }
          : { tipo: 'indisponivel' });
      }, falhar);
    }).catch(falhar);

    return () => {
      ativo = false;
      cancelar?.();
    };
  }, [id, idValido, tentativa]);

  const ocorrencia = estado.tipo === 'pronto' ? estado.ocorrencia : null;

  return (
    <SafeAreaView style={[styles.container, { paddingHorizontal: 16 }]}>
      <View style={styles.cabecalhoNova}>
        <Pressable
          onPress={voltar}
          style={styles.botaoVoltar}
          accessibilityRole="button"
          accessibilityLabel="Voltar para ocorrências"
        >
          <Ionicons name="arrow-back" size={28} color="#111827" />
        </Pressable>
        <Text accessibilityRole="header" style={styles.title_novaOcorrencia}>
          Detalhes da ocorrência
        </Text>
      </View>

      {!idValido || estado.tipo === 'indisponivel' ? (
        <View style={styles.estadoLista}>
          <Text style={styles.textoEstadoLista}>Ocorrência não encontrada ou indisponível.</Text>
        </View>
      ) : estado.tipo === 'carregando' ? (
        <View style={styles.estadoLista}>
          <ActivityIndicator size="large" color="#0147f6" />
          <Text style={styles.textoEstadoLista}>Carregando detalhes...</Text>
        </View>
      ) : estado.tipo === 'erro' ? (
        <View style={styles.estadoLista}>
          <Text accessibilityRole="alert" style={styles.textoEstadoLista}>
            Não foi possível abrir esta ocorrência. Verifique sua conexão e se você tem acesso ao registro.
          </Text>
          <Pressable
            accessibilityRole="button"
            style={styles.botaoTentarNovamente}
            onPress={() => {
              setEstado({ tipo: 'carregando' });
              setTentativa((valor) => valor + 1);
            }}
          >
            <Text style={{ color: '#ffffff' }}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : ocorrencia && (
        <ScrollView contentContainerStyle={styles.conteudoDetalhes}>
          <Informacao titulo="Descrição" valor={ocorrencia.descricao} />
          <Informacao titulo="Local" valor={ocorrencia.local} />
          <Informacao titulo="Categoria" valor={
            categorias.find((item) => item.value === ocorrencia.categoria)?.label ?? ocorrencia.categoria
          } />
          <Informacao titulo="Prioridade" valor={prioridades[ocorrencia.prioridade] ?? ocorrencia.prioridade} />
          <Informacao titulo="Status" valor={nomesStatus[ocorrencia.status] ?? ocorrencia.status} />
          <Informacao titulo="Data de criação" valor={
            ocorrencia.criadaEm
              ? ocorrencia.criadaEm.toDate().toLocaleString('pt-BR')
              : 'Aguardando confirmação'
          } />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

export default function DetalhesOcorrencia() {
  const parametros = useLocalSearchParams<{ id?: string | string[] }>();
  const id = typeof parametros.id === 'string' ? parametros.id : undefined;

  return <ConteudoDetalhes key={id ?? 'invalido'} id={id} />;
}
