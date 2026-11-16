
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';

import { db } from './firebase';
import type { Ocorrencia } from './ocorrencias';
import type { StatusOcorrencia } from '@/constants/status-ocorrencias';

// Acompanha todas as ocorrências cadastradas.
export function acompanharTodasOcorrencias(
  aoAtualizar: (ocorrencias: Ocorrencia[]) => void,
  aoFalhar: (erro: Error) => void,
) {
  return onSnapshot(collection(db, 'ocorrencias'), (resultado) => {
    const ocorrencias = resultado.docs.map((documento) => ({
      ...documento.data(),
      id: documento.id,
    })) as Ocorrencia[];

    ocorrencias.sort(
      (a, b) =>
        (b.criadaEm?.toMillis() ?? 0) -
        (a.criadaEm?.toMillis() ?? 0),
    );

    aoAtualizar(ocorrencias);
  }, aoFalhar);
}

// Acompanha os detalhes de uma ocorrência.
export function acompanharDetalhesResponsavel(
  id: string,
  aoAtualizar: (ocorrencia: Ocorrencia | null) => void,
  aoFalhar: (erro: Error) => void,
) {
  return onSnapshot(doc(db, 'ocorrencias', id), (resultado) => {
    if (!resultado.exists()) {
      aoAtualizar(null);
      return;
    }

    aoAtualizar({
      ...resultado.data(),
      id: resultado.id,
    } as Ocorrencia);
  }, aoFalhar);
}

// Fecha ou reabre uma ocorrência, alterando apenas seu status.
export async function alterarStatusOcorrencia(
  id: string,
  novoStatus: StatusOcorrencia,
) {
  if (!id || id.includes('/')) {
    throw new Error('Identificador da ocorrência inválido.');
  }

  if (novoStatus !== 'aberta' && novoStatus !== 'fechada') {
    throw new Error('Status inválido.');
  }

  await updateDoc(doc(db, 'ocorrencias', id), {
    status: novoStatus,
  });
}
