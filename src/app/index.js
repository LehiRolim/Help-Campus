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