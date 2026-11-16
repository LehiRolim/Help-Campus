import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, Text, View } from 'react-native';

import { obterUrlFoto } from '@/services/fotos';
import { garantirUsuario } from '@/services/ocorrencias';
import { styles } from '@/styles/ocorrencias';

export function FotoOcorrencia({ id }: { id: string }) {
  const [estado, setEstado] = useState<{ url?: string; erro?: string }>({});
  const [tentativa, setTentativa] = useState(0);
  useEffect(() => {
    let ativo = true;
    const controle = new AbortController();
    const timeout = setTimeout(() => controle.abort(), 120_000);
    async function carregar() {
      try {
        const usuario = await garantirUsuario();
        const url = await obterUrlFoto(id, await usuario.getIdToken(), controle.signal);
        if (ativo) setEstado({ url });
      } catch {
        if (ativo) setEstado({ erro: 'Não foi possível carregar a foto. Tente novamente.' });
      } finally { clearTimeout(timeout); }
    }
    carregar();
    return () => { ativo = false; clearTimeout(timeout); controle.abort(); };
  }, [id, tentativa]);

  return (
    <View style={styles.campoDetalhe}>
      <Text style={styles.rotuloDetalhe}>Foto do problema</Text>
      {estado.url ? <Image source={{ uri: estado.url }} style={styles.fotoOcorrencia} resizeMode="contain"
        accessibilityLabel="Foto anexada à ocorrência" onError={() => setEstado({ erro: 'Não foi possível abrir a foto. Tente novamente.' })} />
        : estado.erro ? <View style={styles.painelSugestao}>
          <Text accessibilityRole="alert" style={styles.erroSugestao}>{estado.erro}</Text>
          <Pressable accessibilityRole="button" style={styles.botaoSugestao}
            onPress={() => { setEstado({}); setTentativa((valor) => valor + 1); }}>
            <Text style={styles.textoBotaoSugestao}>Carregar foto novamente</Text>
          </Pressable>
        </View> : <ActivityIndicator color="#0147f6" accessibilityLabel="Carregando foto" />}
    </View>
  );
}
