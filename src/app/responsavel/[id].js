import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import DetalhesResponsavel from '@/screens/DetalhesResponsavel';
import {
  acompanharDetalhesResponsavel,
  alterarStatusOcorrencia,
} from '@/services/responsavel-ocorrencias';

export default function DetalhesOcorrenciaResponsavel() {
  const { id } = useLocalSearchParams();
  const [ocorrencia, setOcorrencia] = useState(/** @type {import('@/services/ocorrencias').Ocorrencia | null} */ (null));
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (typeof id !== 'string') {
      setErro('Identificador da ocorrência inválido.');
      setCarregando(false);
      return;
    }

    setCarregando(true);
    setErro('');

    const cancelar = acompanharDetalhesResponsavel(
      id,
      (dados) => {
        setOcorrencia(dados);
        setCarregando(false);
        if (!dados) setErro('Ocorrência não encontrada.');
      },
      (falha) => {
        console.error('Erro ao carregar detalhes:', falha);
        setErro('Não foi possível carregar os detalhes. Verifique suas permissões.');
        setCarregando(false);
      }
    );

    return () => cancelar();
  }, [id]);

  return (
    <DetalhesResponsavel
      ocorrencia={ocorrencia}
      carregando={carregando}
      erro={erro}
      aoVoltar={() => router.replace('/responsavel')}
      aoAlterarStatus={alterarStatusOcorrencia}
    />
  );
}
