<<<<<<< HEAD
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { styles } from '@/styles/ocorrencias';
import { categorias } from '@/constants/categorias';
import { filtrosStatus, nomesStatus } from '@/constants/status-ocorrencias';
import { acompanharOcorrencias, garantirUsuario } from '@/services/ocorrencias';

const prioridades = { alta: 'Alta', media: 'Média', baixa: 'Baixa' };

export default function TelaOcorrencias() {
  const [ocorrencias, setOcorrencias] = useState(
    /** @type {import('@/services/ocorrencias').Ocorrencia[]} */ ([]),
  );
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0);
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState(
    /** @type {import('@/constants/status-ocorrencias').FiltroStatus} */ ('todas'),
  );

  const ocorrenciasFiltradas = filtroStatus === 'todas'
    ? ocorrencias
    : ocorrencias.filter((item) => item.status === filtroStatus);
  const nomeFiltro = filtrosStatus.find((item) => item.value === filtroStatus)?.label;

  useEffect(() => {
    let ativo = true;
    /** @type {(() => void) | undefined} */
    let cancelar;

    /** @param {unknown} falha */
    function falhar(falha) {
      if (!ativo) return;
      console.error('Erro ao carregar ocorrências:', falha);
      setErro('Não foi possível carregar suas ocorrências. Tente novamente.');
      setCarregando(false);
    }

    garantirUsuario().then((usuario) => {
      if (!ativo) return;

      cancelar = acompanharOcorrencias(usuario.uid, (dados) => {
        if (!ativo) return;
        setOcorrencias(dados);
        setCarregando(false);
      }, falhar);
    }).catch(falhar);

    return () => {
      ativo = false;
      cancelar?.();
    };
  }, [tentativa]);

  return (
    <SafeAreaView style={styles.container}>
=======
// @ts-nocheck
import { useTheme } from '@/context/ThemeContext';
import { acompanharOcorrencias, garantirUsuario } from '@/services/ocorrencias';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TelaOcorrencias() {
  const { modoEscuro } = useTheme();
  const temaAtual = modoEscuro ? estilosEscuros : estilosClaros;

  const [ocorrencias, setOcorrencias] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    let unsubscribe = null;

    garantirUsuario()
      .then((usuario) => {
        if (!ativo) return;

        unsubscribe = acompanharOcorrencias(
          usuario.uid,
          (lista) => {
            if (ativo) {
              setOcorrencias(lista);
              setCarregando(false);
            }
          },
          (erro) => {
            console.error('Erro ao escutar ocorrências:', erro);
            if (ativo) setCarregando(false);
          }
        );
      })
      .catch((erro) => {
        console.error('Erro ao garantir utilizador:', erro);
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  return (
    <SafeAreaView style={[styles.container, temaAtual.container]}>
      {/* Cabeçalho */}
>>>>>>> origin/main
      <View style={styles.header}>
        <Text style={styles.title}>Ocorrências</Text>

        <View style={styles.Icon}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Filtrar ocorrências por status. Filtro atual: ${nomeFiltro}`}
            accessibilityState={{ expanded: filtrosAbertos }}
            onPress={() => setFiltrosAbertos((valor) => !valor)}
            style={[styles.botaoFiltro, filtroStatus !== 'todas' && styles.botaoFiltroAtivo]}
          >
            <Ionicons name={filtroStatus === 'todas' ? 'funnel-outline' : 'funnel'} size={25} color="#0147f6" />
          </Pressable>
<<<<<<< HEAD
          <Link href="/perfil" asChild>
            <Pressable style={styles.botaoFiltro} accessibilityRole="button" accessibilityLabel="Abrir perfil">
              <Ionicons name="person-circle" size={29} color="#0147f6" />
            </Pressable>
          </Link>
        </View>
      </View>

      <View style={styles.linhas} />

      {filtrosAbertos && (
        <View style={styles.painelFiltros}>
          <Text style={styles.rotuloDetalhe}>Filtrar por status</Text>
          <View style={styles.opcoesFiltro}>
            {filtrosStatus.map((opcao) => (
              <Pressable
                key={opcao.value}
                accessibilityRole="radio"
                accessibilityLabel={`Mostrar ocorrências ${opcao.label.toLowerCase()}`}
                accessibilityState={{ checked: filtroStatus === opcao.value }}
                onPress={() => setFiltroStatus(opcao.value)}
                style={[
                  styles.opcaoFiltro,
                  filtroStatus === opcao.value && styles.opcaoFiltroSelecionada,
                ]}
              >
                <Text style={[
                  styles.textoOpcaoFiltro,
                  filtroStatus === opcao.value && styles.textoOpcaoFiltroSelecionada,
                ]}>{opcao.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {!carregando && !erro && (
        <View style={styles.resumoFiltro}>
          <Text accessibilityLiveRegion="polite" style={styles.rotuloDetalhe}>
            {nomeFiltro}: {ocorrenciasFiltradas.length}
          </Text>
          {filtroStatus !== 'todas' && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Limpar filtro de status"
              onPress={() => setFiltroStatus('todas')}
              style={styles.botaoLimparFiltro}
            >
              <Text style={styles.textoLimparFiltro}>Limpar filtro</Text>
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
          <Text accessibilityRole="alert" style={styles.textoEstadoLista}>{erro}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setCarregando(true);
              setErro('');
              setTentativa((valor) => valor + 1);
            }}
            style={styles.botaoTentarNovamente}
          >
            <Text style={{ color: '#ffffff' }}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={ocorrenciasFiltradas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.conteudoListaOcorrencias}
          ListEmptyComponent={
            <Text style={styles.textoEstadoLista}>
              {filtroStatus === 'todas'
                ? 'Nenhuma ocorrência cadastrada. Toque em + para adicionar.'
                : `Nenhuma ocorrência ${filtroStatus === 'aberta' ? 'aberta' : 'fechada'} encontrada.`}
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.cartaoOcorrencia}>
              <View style={styles.cabecalhoCartaoOcorrencia}>
                <Ionicons
                  name="checkmark"
                  size={22}
                  color={item.status === 'fechada' ? '#15803d' : '#6b7280'}
                  accessible={false}
                />
                <Text style={styles.tituloCartaoOcorrencia}>
                  {categorias.find((categoria) => categoria.value === item.categoria)?.label ?? item.categoria}
                </Text>
              </View>
              <Text style={styles.textoCartaoOcorrencia}>{item.descricao}</Text>
              <Text style={styles.textoCartaoOcorrencia}>Local: {item.local}</Text>
              <Text style={styles.textoCartaoOcorrencia}>
                Prioridade: {prioridades[item.prioridade] ?? item.prioridade}
              </Text>
              <Text style={styles.textoCartaoOcorrencia}>
                Status: {nomesStatus[item.status] ?? item.status}
              </Text>
              <Link
                href={{ pathname: '/ocorrencias/[id]', params: { id: item.id } }}
                accessibilityLabel={`Ver detalhes da ocorrência: ${item.descricao}`}
                style={styles.linkDetalhes}
              >
                Ver detalhes →
              </Link>
            </View>
          )}
        />
      )}

      <View style={styles.posicao_btn_novaOcorrencia}>
        <Link href="/ocorrencias/novaOcorrencia" asChild>
          <Pressable style={styles.texto_novaOcorrencia} accessibilityRole="button" accessibilityLabel="Cadastrar nova ocorrência">
            <Text style={{ color: '#ffffff', fontSize: 28 }}>
              +
            </Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}
=======
          <Ionicons name="person-circle" size={29} color="#0147f6" />
        </View>
      </View>

      <Text style={[styles.subcontador, temaAtual.textoSecundario]}>
        Total: {ocorrencias.length}
      </Text>

      {carregando ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color="#0147f6" />
          <Text style={[styles.textoCarregando, temaAtual.textoSecundario]}>A carregar ocorrências...</Text>
        </View>
      ) : ocorrencias.length === 0 ? (
        <View style={styles.centro}>
          <Text style={[styles.textoVazio, temaAtual.textoSecundario]}>Nenhuma ocorrência registada.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.lista}>
          {ocorrencias.map((item) => (
            <View key={item.id} style={[styles.card, temaAtual.card]}>
              <Text style={[styles.cardTag, temaAtual.textoDestaque]}>✓ {item.categoria}</Text>
              <Text style={[styles.cardDescricao, temaAtual.texto]}>{item.descricao}</Text>
              <Text style={[styles.cardDetalhe, temaAtual.textoSecundario]}>Local: {item.local}</Text>
              <Text style={[styles.cardDetalhe, temaAtual.textoSecundario]}>Prioridade: {item.prioridade}</Text>
              <Text style={[styles.cardDetalhe, temaAtual.textoSecundario]}>Status: {item.status}</Text>

              <TouchableOpacity onPress={() => router.push(`/ocorrencias/${item.id}`)}>
                <Text style={styles.linkDetalhes}>Ver detalhes →</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Botão Flutuante para Nova Ocorrência */}
      <TouchableOpacity
        style={styles.botaoAdicionar}
        onPress={() => router.push('/ocorrencias/novaOcorrencia')}
        accessibilityRole="button"
        accessibilityLabel="Criar nova ocorrência"
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const estilosClaros = StyleSheet.create({
  container: { backgroundColor: '#f5f5f5' },
  card: { backgroundColor: '#fff', borderColor: '#e0e0e0' },
  textoTitulo: { color: '#111' },
  textoSecundario: { color: '#666' },
  texto: { color: '#333' },
  textoDestaque: { color: '#28a745' }
});

const estilosEscuros = StyleSheet.create({
  container: { backgroundColor: '#121212' },
  card: { backgroundColor: '#1e1e1e', borderColor: '#333' },
  textoTitulo: { color: '#f1f1f1' },
  textoSecundario: { color: '#aaa' },
  texto: { color: '#ddd' },
  textoDestaque: { color: '#4cd964' }
});

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  titulo: { fontSize: 24, fontWeight: 'bold' },
  headerAcoes: { flexDirection: 'row', alignItems: 'center' },
  iconePerfil: { padding: 4 },
  subcontador: { fontSize: 13, marginBottom: 15 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  textoCarregando: { marginTop: 10, fontSize: 14 },
  textoVazio: { fontSize: 14 },
  lista: { paddingBottom: 80 },
  card: { borderRadius: 10, padding: 16, marginBottom: 15, borderWidth: 1, elevation: 2 },
  cardTag: { fontWeight: 'bold', marginBottom: 6, fontSize: 15 },
  cardDescricao: { fontSize: 14, marginBottom: 6 },
  cardDetalhe: { fontSize: 12, marginBottom: 3 },
  linkDetalhes: { color: '#0056b3', fontWeight: '600', marginTop: 10 },
  botaoAdicionar: {
    position: 'absolute',
    bottom: 25,
    right: 20,
    backgroundColor: '#0056b3',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3
  }
});
>>>>>>> origin/main
