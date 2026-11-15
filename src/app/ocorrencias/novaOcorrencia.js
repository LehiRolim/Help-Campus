import { Picker } from '@expo/ui/community/picker';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CampoCategoria } from '@/components/campo-categoria';
import { CampoFoto } from '@/components/campo-foto';
import { SugestaoCategoria } from '@/components/sugestao-categoria';
import { categorias, tamanhoMaximoDescricao } from '@/constants/categorias';
import { styles } from '@/styles/ocorrencias';
import { criarIdOcorrencia, salvarOcorrencia } from '@/services/ocorrencias';

export default function NovaOcorrencia() {

  const [prioridade, setPrioridade] = useState('');
  const [descricao, setDescricao] = useState('');
  const [versaoDescricao, setVersaoDescricao] = useState(0);
  const [categoria, setCategoria] = useState('');
  const [local, setLocal] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [foto, setFoto] = useState(/** @type {import('@/services/fotos').FotoLocal | null} */ (null));
  const [preparandoFoto, setPreparandoFoto] = useState(false);
  const idOcorrencia = useRef('');
  const envioEmAndamento = useRef(false);

  async function enviarOcorrencia() {
    if (envioEmAndamento.current || preparandoFoto) return;

    setErro('');

    const categoriaSelecionada = categorias.find(
      (item) => item.value === categoria,
    );

    if (!descricao.trim() || !local.trim() || !categoriaSelecionada) {
      setErro('Preencha a descrição, o local e a categoria.');
      return;
    }

    if (
      prioridade !== 'alta' &&
      prioridade !== 'media' &&
      prioridade !== 'baixa'
    ) {
      setErro('Selecione uma prioridade.');
      return;
    }

    envioEmAndamento.current = true;
    setSalvando(true);
    if (!idOcorrencia.current) idOcorrencia.current = criarIdOcorrencia();

    try {
      await salvarOcorrencia({
        descricao,
        local,
        categoria: categoriaSelecionada.value,
        prioridade,
      }, { id: idOcorrencia.current, foto });

      router.replace('/');
    } catch (falha) {
      console.error('Erro ao salvar ocorrência:', falha);
      setErro(falha instanceof Error ? falha.message : 'Não foi possível salvar. Verifique sua conexão e tente novamente.');
    } finally {
      envioEmAndamento.current = false;
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={[styles.container, { paddingHorizontal: 16 }]}>
      <View style={styles.cabecalhoNova}>
        <TouchableOpacity
          style={styles.botaoVoltar}
          disabled={salvando || preparandoFoto}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/');
            }
          }}
          accessibilityRole="button"
          accessibilityLabel="Voltar para ocorrências"
        >
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>

        <Text style={styles.title_novaOcorrencia}>Nova ocorrência</Text>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
        <View style={styles.campoDescricao}>
          <Text style={styles.texto_input}>Descrição</Text>

          <TextInput
            style={styles.input}
            value={descricao}
            editable={!salvando}
            onChangeText={(texto) => {
              setDescricao(texto);
              setVersaoDescricao((versao) => versao + 1);
            }}
            maxLength={tamanhoMaximoDescricao}
            placeholder="Descreva o problema"
            placeholderTextColor="#60646c"
            accessibilityLabel="Descrição da ocorrência"
            multiline
          />
        </View>

        <CampoFoto value={foto} disabled={salvando} onChange={setFoto} onPreparandoChange={setPreparandoFoto} />

        <View style={styles.campoDescricao}>
          <Text style={styles.texto_input}>Local</Text>

          <TextInput
            style={styles.input}
            value={local}
            editable={!salvando}
            onChangeText={setLocal}
            maxLength={200}
            placeholder="Ex: Bloco C, sala 32"
            placeholderTextColor="#60646c"
            accessibilityLabel="Local da ocorrência"
          />
        </View>

        <CampoCategoria value={categoria} onChange={setCategoria} />
        <SugestaoCategoria key={`${versaoDescricao}-${salvando}`} descricao={descricao} desabilitado={salvando} onAceitar={setCategoria} />

        <View style={styles.campoDescricao}>
          <Text style={styles.texto_input} >Prioridade</Text>

          <View style={styles.seletorPrioridade}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Picker
                style={{ flex: 1 }}
                selectedValue={prioridade}
                onValueChange={(valor) => setPrioridade(valor)}
              >
                <Picker.Item label="Selecione uma prioridade" value="" />
                <Picker.Item label="Alta" value="alta" />
                <Picker.Item label="Média" value="media" />
                <Picker.Item label="Baixa" value="baixa" />
              </Picker>

              <View pointerEvents="none" style={{ paddingHorizontal: 12 }}>
                <Ionicons name="chevron-down" size={20} color="#ffffff" />
              </View>
            </View>
          </View>
        </View>
        {!!erro && (
          <Text
            accessibilityRole="alert"
            style={{ color: '#b91c1c', marginTop: 16 }}
          >
            {erro}
          </Text>
        )}

        <TouchableOpacity
          onPress={enviarOcorrencia}
          disabled={salvando || preparandoFoto}
          accessibilityRole="button"
          accessibilityState={{ disabled: salvando || preparandoFoto, busy: salvando }}
          style={{
            backgroundColor: '#0147f6',
            padding: 16,
            borderRadius: 8,
            marginTop: 24,
            marginBottom: 32,
            alignItems: 'center',
            opacity: salvando || preparandoFoto ? 0.6 : 1,
          }}
        >
          <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>
            {salvando ? (foto ? 'Enviando foto e salvando...' : 'Salvando...') : 'Salvar ocorrência'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
