import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { categorias, type Categoria } from '@/constants/categorias';
import { sugerirCategoria } from '@/services/sugerir-categoria';
import { styles } from '@/styles/ocorrencias';

type Props = { descricao: string; desabilitado: boolean; onAceitar: (categoria: Categoria) => void };

export function SugestaoCategoria({ descricao, desabilitado, onAceitar }: Props) {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sugestao, setSugestao] = useState<Categoria | null>(null);
  const solicitacao = useRef<AbortController | null>(null);

  useEffect(() => () => {
    solicitacao.current?.abort();
    solicitacao.current = null;
  }, []);
  async function analisar() {
    if (solicitacao.current || desabilitado) return;
    const controle = new AbortController();
    solicitacao.current = controle;
    setCarregando(true);
    setErro('');
    setSugestao(null);
    const timeout = setTimeout(() => controle.abort(), 120_000);
    try {
      const categoria = await sugerirCategoria(descricao, controle.signal);
      if (!controle.signal.aborted) setSugestao(categoria);
    } catch (falha) {
      if (solicitacao.current === controle) {
        setErro(controle.signal.aborted ? 'A análise demorou demais. Tente novamente ou escolha manualmente.'
          : falha instanceof Error ? falha.message : 'Não foi possível sugerir uma categoria.');
      }
    } finally {
      clearTimeout(timeout);
      if (solicitacao.current === controle) {
        solicitacao.current = null;
        setCarregando(false);
      }
    }
  }

  const bloqueado = desabilitado || carregando || descricao.trim().length < 10;
  return (
    <View style={styles.painelSugestao}>
      <Text style={styles.avisoSugestao}>
        Ao solicitar uma sugestão, a descrição será enviada à IA do Google. Evite incluir dados pessoais.
      </Text>
      <Pressable onPress={analisar} disabled={bloqueado} accessibilityRole="button"
        accessibilityState={{ disabled: bloqueado, busy: carregando }}
        style={[styles.botaoSugestao, bloqueado && styles.botaoSugestaoDesabilitado]}>
        {carregando && <ActivityIndicator color="#0147f6" />}
        <Text style={styles.textoBotaoSugestao}>{carregando ? 'Analisando descrição...' : 'Sugerir categoria com IA'}</Text>
      </Pressable>
      {carregando && <Text style={styles.avisoSugestao}>
        A primeira consulta pode levar até dois minutos. Você pode escolher a categoria manualmente enquanto aguarda.
      </Text>}
      {!!erro && <Text accessibilityRole="alert" style={styles.erroSugestao}>{erro}</Text>}
      {sugestao && <View style={styles.painelSugestao}>
        <Text accessibilityLiveRegion="polite" style={styles.textoCartaoOcorrencia}>
          Sugestão: {categorias.find((item) => item.value === sugestao)?.label}. Confira antes de aceitar.
        </Text>
        <Pressable disabled={desabilitado} accessibilityRole="button"
          accessibilityState={{ disabled: desabilitado }} style={styles.botaoSugestao}
          onPress={() => { onAceitar(sugestao); setSugestao(null); }}>
          <Text style={styles.textoBotaoSugestao}>Usar categoria sugerida</Text>
        </Pressable>
      </View>}
    </View>
  );
}
