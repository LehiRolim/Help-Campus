import { Ionicons } from '@expo/vector-icons';
import { Text, View, type StyleProp, type TextStyle } from 'react-native';

import { nomesStatus, type StatusOcorrencia as Status } from '@/constants/status-ocorrencias';
import { styles } from '@/styles/ocorrencias';

type Props = {
  status: Status;
  exibirRotulo?: boolean;
  estiloTexto?: StyleProp<TextStyle>;
};

export function StatusOcorrencia({ status, exibirRotulo = false, estiloTexto }: Props) {
  const nome = nomesStatus[status] ?? status;

  return (
    <View style={styles.linhaStatus} accessible accessibilityLabel={`Status: ${nome}`}>
      <Ionicons
        name="checkmark"
        size={22}
        color={status === 'fechada' ? '#15803d' : '#6b7280'}
        accessible={false}
      />
      <Text style={[styles.textoCartaoOcorrencia, styles.textoStatus, estiloTexto]}>
        {exibirRotulo ? `Status: ${nome}` : nome}
      </Text>
    </View>
  );
}
