import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { categorias, type Categoria } from '@/constants/categorias';
import { styles } from '@/styles/ocorrencias';

type Props = { value: string; onChange: (categoria: Categoria) => void };

export function CampoCategoria({ value, onChange }: Props) {
  const [aberto, setAberto] = useState(false);
  const categoriaSelecionada = categorias.find((item) => item.value === value);

  function escolher(categoria: Categoria) {
    onChange(categoria);
    setAberto(false);
  }

  return (
    <View style={styles.campoDescricao}>
      <Text style={styles.texto_input}>Categoria</Text>
      <Pressable style={styles.seletorCategoria} onPress={() => setAberto((valor) => !valor)}
        accessibilityRole="button" accessibilityLabel={`Categoria: ${categoriaSelecionada?.label ?? 'não selecionada'}`}
        accessibilityState={{ expanded: aberto }}>
        <Text style={styles.textoCategoria}>{categoriaSelecionada?.label ?? 'Selecione uma categoria'}</Text>
        <Ionicons name={aberto ? 'chevron-up' : 'chevron-down'} size={20} color="#374151" />
      </Pressable>
      {aberto && <View style={styles.listaCategorias}>
        {categorias.map((item) => <Pressable key={item.value} onPress={() => escolher(item.value)}
          accessibilityRole="radio" accessibilityState={{ checked: item.value === value }}
          style={({ pressed }) => [styles.opcaoCategoria, (pressed || item.value === value) && styles.opcaoCategoriaAtiva]}>
          <Text style={styles.textoCategoria}>{item.label}</Text>
          {item.value === value && <Ionicons name="checkmark" size={20} color="#0147f6" />}
        </Pressable>)}
      </View>}
    </View>
  );
}
