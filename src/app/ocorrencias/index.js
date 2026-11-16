import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { styles, estilosEscurosOcorrencias } from '@/styles/ocorrencias';
import { useTheme } from '@/context/ThemeContext';
import { categorias } from '@/constants/categorias';
import { filtrosStatus, nomesStatus } from '@/constants/status-ocorrencias';
import { acompanharOcorrencias, garantirUsuario } from '@/services/ocorrencias';

const estilosClaros = /** @type {typeof estilosEscurosOcorrencias} */ ({});

const prioridades = { alta: 'Alta', media: 'Média', baixa: 'Baixa' };

export default function TelaOcorrencias() {
  const { modoEscuro } = useTheme();
  const tema = modoEscuro ? estilosEscurosOcorrencias : estilosClaros;
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
    <SafeAreaView style={[styles.container, tema.container]}>
      <View style={styles.header}>
        <Text style={[styles.title, tema.title]}>Ocorrências</Text>

        <View style={styles.Icon}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Filtrar ocorrências por status. Filtro atual: ${nomeFiltro}`}
            accessibilityState={{ expanded: filtrosAbertos }}
            onPress={() => setFiltrosAbertos((valor) => !valor)}
            style={[styles.botaoFiltro, filtroStatus !== 'todas' && styles.botaoFiltroAtivo, filtroStatus !== 'todas' && tema.botaoFiltroAtivo]}
          >
            <Ionicons name={filtroStatus === 'todas' ? 'funnel-outline' : 'funnel'} size={25} color="#0147f6" />
          </Pressable>
          <Link href="/perfil" asChild>
            <Pressable style={styles.botaoFiltro} accessibilityRole="button" accessibilityLabel="Abrir perfil">
              <Ionicons name="person-circle" size={29} color="#0147f6" />
            </Pressable>
          </Link>
        </View>
      </View>

      <View style={[styles.linhas, tema.linhas]} />

      {filtrosAbertos && (
        <View style={[styles.painelFiltros, tema.painelFiltros]}>
          <Text style={[styles.rotuloDetalhe, tema.rotuloDetalhe]}>Filtrar por status</Text>
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
                  tema.opcaoFiltro,
                  filtroStatus === opcao.value && styles.opcaoFiltroSelecionada,
                ]}
              >
                <Text style={[
                  styles.textoOpcaoFiltro,
                  tema.textoOpcaoFiltro,
                  filtroStatus === opcao.value && styles.textoOpcaoFiltroSelecionada,
                  filtroStatus === opcao.value && { color: '#FFFFFF' },
                ]}>{opcao.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {!carregando && !erro && (
        <View style={styles.resumoFiltro}>
          <Text accessibilityLiveRegion="polite" style={[styles.rotuloDetalhe, tema.rotuloDetalhe]}>
            {nomeFiltro}: {ocorrenciasFiltradas.length}
          </Text>
          {filtroStatus !== 'todas' && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Limpar filtro de status"
              onPress={() => setFiltroStatus('todas')}
              style={styles.botaoLimparFiltro}
            >
              <Text style={[styles.textoLimparFiltro, tema.textoLimparFiltro]}>Limpar filtro</Text>
            </Pressable>
          )}
        </View>
      )}

      {carregando ? (
        <View style={styles.estadoLista}>
          <ActivityIndicator color="#0147f6" size="large" />
          <Text style={[styles.textoEstadoLista, tema.textoEstadoLista]}>Carregando ocorrências...</Text>
        </View>
      ) : erro ? (
        <View style={styles.estadoLista}>
          <Text accessibilityRole="alert" style={[styles.textoEstadoLista, tema.textoEstadoLista]}>{erro}</Text>
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
            <Text style={[styles.textoEstadoLista, tema.textoEstadoLista]}>
              {filtroStatus === 'todas'
                ? 'Nenhuma ocorrência cadastrada. Toque em + para adicionar.'
                : `Nenhuma ocorrência ${filtroStatus === 'aberta' ? 'aberta' : 'fechada'} encontrada.`}
            </Text>
          }
          renderItem={({ item }) => (
            <View style={[styles.cartaoOcorrencia, tema.cartaoOcorrencia]}>
              <View style={styles.cabecalhoCartaoOcorrencia}>
                <Ionicons
                  name="checkmark"
                  size={22}
                  color={item.status === 'fechada' ? '#15803d' : '#6b7280'}
                  accessible={false}
                />
                <Text style={[styles.tituloCartaoOcorrencia, tema.tituloCartaoOcorrencia]}>
                  {categorias.find((categoria) => categoria.value === item.categoria)?.label ?? item.categoria}
                </Text>
              </View>
              <Text style={[styles.textoCartaoOcorrencia, tema.textoCartaoOcorrencia]}>{item.descricao}</Text>
              <Text style={[styles.textoCartaoOcorrencia, tema.textoCartaoOcorrencia]}>Local: {item.local}</Text>
              <Text style={[styles.textoCartaoOcorrencia, tema.textoCartaoOcorrencia]}>
                Prioridade: {prioridades[item.prioridade] ?? item.prioridade}
              </Text>
              <Text style={[styles.textoCartaoOcorrencia, tema.textoCartaoOcorrencia]}>
                Status: {nomesStatus[item.status] ?? item.status}
              </Text>
              <Link
                href={{ pathname: '/ocorrencias/[id]', params: { id: item.id } }}
                accessibilityLabel={`Ver detalhes da ocorrência: ${item.descricao}`}
                style={[styles.linkDetalhes, tema.linkDetalhes]}
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
