import { signInAnonymously, type User } from 'firebase/auth';
import {
    collection,
    doc,
    onSnapshot,
    query,
    serverTimestamp,
    setDoc,
    where,
    type Timestamp,
} from 'firebase/firestore';

import {
    tamanhoMaximoDescricao,
    type Categoria,
} from '@/constants/categorias';

import { auth } from './auth';
import { db } from './firebase';
import type { StatusOcorrencia } from '@/constants/status-ocorrencias';
import { salvarComFoto, type FotoLocal, type FotoSalva } from './fotos';

export type Prioridade = 'alta' | 'media' | 'baixa';

export type NovaOcorrencia = {
  descricao: string;
  local: string;
  categoria: Categoria;
  prioridade: Prioridade;
};

export type Ocorrencia = NovaOcorrencia & {
  id: string;
  usuarioId: string;
  status: StatusOcorrencia;
  criadaEm: Timestamp | null;
  foto?: FotoSalva;
};

export function acompanharOcorrencia(
  id: string,
  usuarioId: string,
  aoAtualizar: (ocorrencia: Ocorrencia | null) => void,
  aoFalhar: (erro: Error) => void,
) {
  return onSnapshot(doc(db, 'ocorrencias', id), (resultado) => {
    const dados = resultado.data();

    if (!resultado.exists() || dados?.usuarioId !== usuarioId) {
      aoAtualizar(null);
      return;
    }

    aoAtualizar({ ...dados, id: resultado.id } as Ocorrencia);
  }, aoFalhar);
}

export function acompanharOcorrencias(
  usuarioId: string,
  aoAtualizar: (ocorrencias: Ocorrencia[]) => void,
  aoFalhar: (erro: Error) => void,
) {
  const consulta = query(
    collection(db, 'ocorrencias'),
    where('usuarioId', '==', usuarioId),
  );

  return onSnapshot(consulta, (resultado) => {
    const ocorrencias = resultado.docs.map((documento) => ({
      ...documento.data(),
      id: documento.id,
    })) as Ocorrencia[];

    // Ordena localmente sem exigir um índice composto no Firebase.
    ocorrencias.sort((a, b) =>
      (b.criadaEm?.toMillis() ?? 0) - (a.criadaEm?.toMillis() ?? 0),
    );
    aoAtualizar(ocorrencias);
  }, aoFalhar);
}

let sessao: Promise<User> | undefined;

// Recupera o usuário salvo ou cria um usuário anônimo.
export function garantirUsuario(): Promise<User> {
  if (!sessao) {
    sessao = (async () => {
      await auth.authStateReady();

      if (auth.currentUser) {
        return auth.currentUser;
      }

      const resultado = await signInAnonymously(auth);

      return resultado.user;
    })().catch((erro) => {
      sessao = undefined;
      throw erro;
    });
  }

  return sessao;
}

// Valida os campos e grava uma ocorrência no Firestore.
export function criarIdOcorrencia() { return doc(collection(db, 'ocorrencias')).id; }

export async function salvarOcorrencia(dados: NovaOcorrencia, opcoes: { id?: string; foto?: FotoLocal | null } = {}) {
  const descricao = dados.descricao.trim();
  const local = dados.local.trim();

  if (!descricao || !local || !dados.categoria || !dados.prioridade) {
    throw new Error('Preencha todos os campos.');
  }

  if (descricao.length > tamanhoMaximoDescricao) {
    throw new Error('A descrição deve ter até 2.000 caracteres.');
  }

  if (local.length > 200) {
    throw new Error('O local deve ter até 200 caracteres.');
  }

  const usuario = await garantirUsuario();
  const id = opcoes.id ?? criarIdOcorrencia();
  if (opcoes.foto) {
    return salvarComFoto({ ...dados, descricao, local }, id, opcoes.foto, await usuario.getIdToken());
  }

  await setDoc(doc(db, 'ocorrencias', id), {
    descricao,
    local,
    categoria: dados.categoria,
    prioridade: dados.prioridade,
    usuarioId: usuario.uid,
    status: 'aberta',
    criadaEm: serverTimestamp(),
  });

  return id;
}
