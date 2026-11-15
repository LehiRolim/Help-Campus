import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Pressable, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

import type { FotoLocal } from '@/services/fotos';
import { styles } from '@/styles/ocorrencias';

type Props = {
  value: FotoLocal | null;
  disabled: boolean;
  onChange: (foto: FotoLocal | null) => void;
  onPreparandoChange: (preparando: boolean) => void;
};

export function CampoFoto({ value, disabled, onChange, onPreparandoChange }: Props) {
  const [preparando, setPreparando] = useState(false);
  const [erro, setErro] = useState('');
  const ocupado = useRef(false);
  const ativo = useRef(true);
  useEffect(() => { ativo.current = true; return () => { ativo.current = false; }; }, []);

  async function escolher() {
    if (disabled || ocupado.current) return;
    ocupado.current = true;
    setPreparando(true);
    onPreparandoChange(true);
    setErro('');
    try {
      const opcoes: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], allowsMultipleSelection: false, quality: 1, exif: false };
      const resultado = await ImagePicker.launchImageLibraryAsync(opcoes);
      if (resultado.canceled || !ativo.current) return;
      const imagem = resultado.assets[0];
      if (!imagem?.uri || !imagem.width || !imagem.height) throw new Error('Não foi possível abrir esta foto.');
      const escala = Math.min(1, 1600 / Math.max(imagem.width, imagem.height));
      const contexto = ImageManipulator.manipulate(imagem.uri);
      contexto.resize({ width: Math.max(1, Math.round(imagem.width * escala)), height: Math.max(1, Math.round(imagem.height * escala)) });
      const renderizada = await contexto.renderAsync();
      const foto = await renderizada.saveAsync({ format: SaveFormat.JPEG, compress: 0.75, base64: true });
      if (!foto.base64 || Math.ceil(foto.base64.length * 3 / 4) > 2 * 1024 * 1024) {
        throw new Error('A foto ficou muito grande. Escolha uma imagem menor; o limite é 2 MB após compressão.');
      }
      if (ativo.current) onChange({ uri: foto.uri, base64: foto.base64, largura: foto.width, altura: foto.height });
    } catch (falha) {
      if (ativo.current) setErro(falha instanceof Error ? falha.message : 'Não foi possível preparar a foto. Tente outra imagem.');
    } finally {
      ocupado.current = false;
      if (ativo.current) { setPreparando(false); onPreparandoChange(false); }
    }
  }

  const bloqueado = disabled || preparando;
  return (
    <View style={styles.campoDescricao}>
      <Text style={styles.texto_input}>Foto do problema — opcional</Text>
      <Text style={styles.avisoSugestao}>Adicione uma foto para ajudar a identificar o problema. Evite rostos e dados pessoais.</Text>
      {value && <Image source={{ uri: value.uri }} style={styles.fotoOcorrencia} resizeMode="contain" accessibilityLabel="Prévia da foto selecionada" />}
      <View style={styles.acoesFoto}>
        <Pressable disabled={bloqueado} accessibilityRole="button" accessibilityState={{ disabled: bloqueado }}
          style={[styles.botaoSugestao, styles.botaoFoto, bloqueado && styles.botaoSugestaoDesabilitado]} onPress={escolher}>
          <Text style={styles.textoBotaoSugestao}>{value ? 'Trocar foto' : 'Escolher da galeria'}</Text>
        </Pressable>
        {value && <Pressable disabled={bloqueado} accessibilityRole="button" accessibilityState={{ disabled: bloqueado }}
          style={styles.botaoSugestao} onPress={() => { onChange(null); setErro(''); }}>
          <Text style={styles.erroSugestao}>Remover foto</Text>
        </Pressable>}
      </View>
      {preparando && <View style={styles.linhaStatus}><ActivityIndicator color="#0147f6" /><Text style={styles.avisoSugestao}>Preparando foto...</Text></View>}
      {!!erro && <Text accessibilityRole="alert" style={styles.erroSugestao}>{erro}</Text>}
    </View>
  );
}
