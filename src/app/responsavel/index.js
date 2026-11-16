import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import TelaResponsavelOcorrencias from '@/screens/TelaResponsavelOcorrencias';
import { acompanharTodasOcorrencias } from '@/services/responsavel-ocorrencias';

export default function Responsavel() {
  const [ocorrencias, setOcorrencias] = useState(/** @type {import('@/services/ocorrencias').Ocorrencia[]} */ ([]));
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    setCarregando(true);
    setErro('');

    const cancelar = acompanharTodasOcorrencias(
      (dados) => {
        setOcorrencias(dados);
        setCarregando(false);
      },
      (falha) => {
        console.error('Erro ao carregar ocorrências do responsável:', falha);
        setErro('Não foi possível carregar as ocorrências. Verifique suas permissões.');
        setCarregando(false);
      }
    );

    return () => cancelar();
  }, [tentativa]);

  return (
    <TelaResponsavelOcorrencias
      ocorrencias={ocorrencias}
      carregando={carregando}
      erro={erro}
      aoAbrirDetalhes={(id) => router.push(`/responsavel/${id}`)}
      aoAbrirPerfil={() => router.push('/perfil')}
      aoTentarNovamente={() => setTentativa((valor) => valor + 1)}
    />
  );
}
