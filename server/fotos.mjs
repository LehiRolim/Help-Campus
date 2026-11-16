import { createHash } from 'node:crypto';

export class ErroFoto extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

const MAX_BYTES = 2 * 1024 * 1024;
const stringValue = (valor) => ({ stringValue: valor });

function assinar(parametros, segredo) {
  const texto = Object.keys(parametros).sort().map((chave) => `${chave}=${parametros[chave]}`).join('&');
  return createHash('sha256').update(texto + segredo).digest('hex');
}

export function criarFotos({ cloudName, apiKey, apiSecret, projectId, categorias, fetchImpl = fetch }) {
  const firestore = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
  const cloudinary = `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName || '')}/image`;
  const emAndamento = new Set();
  let dia = '';
  let totalUploads = 0;

  async function consultar(id, token) {
    const resposta = await fetchImpl(`${firestore}/ocorrencias/${id}`, {
      headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(10_000),
    });
    if (resposta.status === 404) return { estado: 'ausente' };
    // Regras de leitura por proprietário podem negar até a leitura de um documento inexistente.
    if (resposta.status === 403) return { estado: 'desconhecido' };
    if (!resposta.ok) throw new ErroFoto(503, 'Não foi possível consultar a ocorrência. Tente novamente.');
    return { estado: 'encontrado', campos: (await resposta.json()).fields };
  }

  async function operacaoCloudinary(acao, parametros) {
    const form = new URLSearchParams(parametros);
    const resposta = await fetchImpl(`${cloudinary}/${acao}`, {
      method: 'POST',
      headers: { Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}` },
      body: form, signal: AbortSignal.timeout(45_000),
    });
    if (!resposta.ok) {
      console.error(`Cloudinary ${acao}: HTTP ${resposta.status}.`);
      throw new ErroFoto(503, 'Não foi possível enviar a foto. Confira a configuração do Cloudinary e tente novamente.');
    }
    return resposta.json();
  }

  async function falhaGravacao(resposta) {
    let erro;
    try { erro = (await resposta.json()).error; } catch { /* Resposta sem JSON. */ }
    const padroes = { 400: 'INVALID_ARGUMENT', 401: 'UNAUTHENTICATED', 403: 'PERMISSION_DENIED', 404: 'NOT_FOUND', 409: 'ALREADY_EXISTS', 429: 'RESOURCE_EXHAUSTED' };
    const status = Object.values(padroes).includes(erro?.status) ? erro.status : padroes[resposta.status] ?? 'UNAVAILABLE';
    // Registrar somente códigos conhecidos, sem mensagem bruta, tokens, descrição ou credenciais.
    const motivos = ['SERVICE_DISABLED', 'BILLING_DISABLED', 'API_KEY_SERVICE_BLOCKED', 'APP_CHECK_TOKEN_INVALID'];
    const motivo = erro?.details?.find((detalhe) => motivos.includes(detalhe.reason))?.reason;
    console.error(`[Firestore] cadastro: HTTP ${resposta.status}, ${status}${motivo ? `, ${motivo}` : ''}.`);
    if (motivo === 'SERVICE_DISABLED') return new ErroFoto(503, 'A API do Firestore está desativada no projeto. Ative-a antes de tentar novamente.');
    if (resposta.status === 403) return new ErroFoto(403, `O Firestore negou o cadastro (${status}). Confira as regras para o campo foto e a configuração de App Check do Firestore.`);
    if (resposta.status === 401) return new ErroFoto(401, 'O Firestore não aceitou sua sessão. Reabra o aplicativo e tente novamente.');
    if (resposta.status === 429) return new ErroFoto(429, 'A cota do Firestore foi atingida. Aguarde antes de tentar novamente.');
    return new ErroFoto(503, `Não foi possível salvar a ocorrência no Firestore (${status}). Tente novamente e confira o diagnóstico no terminal.`);
  }

  return async function fotos({ rota, corpo, usuarioId, token }) {
    if (!cloudName || !apiKey || !apiSecret) throw new ErroFoto(503, 'O armazenamento de fotos ainda não foi configurado no servidor.');
    const id = corpo?.ocorrenciaId;
    if (!/^[a-zA-Z0-9]{20}$/.test(id || '') || !/^[a-zA-Z0-9_-]{1,128}$/.test(usuarioId)) {
      throw new ErroFoto(400, 'Identificador de ocorrência inválido.');
    }
    const prefixo = `help-campus/${usuarioId}/${id}-`;
    if (rota === '/fotos/visualizar') {
      const documento = await consultar(id, token);
      const campos = documento.campos;
      const foto = campos?.foto?.mapValue?.fields;
      const publicId = foto?.publicId?.stringValue;
      if (documento.estado !== 'encontrado' || campos?.usuarioId?.stringValue !== usuarioId
        || typeof publicId !== 'string' || !publicId.startsWith(prefixo)
        || !/^[a-f0-9]{16}$/.test(publicId.slice(prefixo.length)) || foto?.formato?.stringValue !== 'jpg') {
        throw new ErroFoto(404, 'Foto não encontrada ou indisponível para sua conta.');
      }
      const timestamp = Math.floor(Date.now() / 1000);
      const parametros = { public_id: publicId, format: 'jpg', type: 'authenticated', timestamp, expires_at: timestamp + 300 };
      const query = new URLSearchParams({ ...parametros, signature: assinar(parametros, apiSecret), api_key: apiKey });
      return { url: `${cloudinary}/download?${query}`, expiraEm: parametros.expires_at };
    }

    const dados = corpo?.dados;
    const descricao = typeof dados?.descricao === 'string' ? dados.descricao.trim() : '';
    const local = typeof dados?.local === 'string' ? dados.local.trim() : '';
    if (!descricao || descricao.length > 2000 || !local || local.length > 200
      || !Object.hasOwn(categorias, dados?.categoria ?? '') || !['alta', 'media', 'baixa'].includes(dados?.prioridade)) {
      throw new ErroFoto(400, 'Preencha descrição, local, categoria e prioridade corretamente.');
    }
    const base64 = corpo?.base64;
    if (typeof base64 !== 'string' || base64.length > Math.ceil(MAX_BYTES / 3) * 4 || base64.length % 4 !== 0) {
      throw new ErroFoto(400, 'Envie uma foto JPEG de até 2 MB.');
    }
    const bytes = Buffer.from(base64, 'base64');
    if (bytes.toString('base64') !== base64 || bytes.length < 4 || bytes.length > MAX_BYTES || bytes[0] !== 0xff || bytes[1] !== 0xd8
      || bytes[2] !== 0xff || bytes.at(-2) !== 0xff || bytes.at(-1) !== 0xd9) {
      throw new ErroFoto(400, 'Arquivo de foto inválido. Selecione a foto novamente.');
    }
    const chave = `${usuarioId}/${id}`;
    if (emAndamento.has(chave)) throw new ErroFoto(409, 'Esta ocorrência já está sendo salva. Aguarde antes de tentar novamente.');
    emAndamento.add(chave);
    try {
      const anterior = await consultar(id, token);
      if (anterior.estado === 'encontrado') {
        if (anterior.campos?.usuarioId?.stringValue !== usuarioId) throw new ErroFoto(403, 'Ocorrência indisponível.');
        return { id }; // Repetir a solicitação após perda de conexão não cria outra ocorrência.
      }
      const publicId = prefixo + createHash('sha256').update(bytes).digest('hex').slice(0, 16);
      const hoje = new Date().toISOString().slice(0, 10);
      if (dia !== hoje) { dia = hoje; totalUploads = 0; }
      if (totalUploads >= 100) throw new ErroFoto(429, 'Limite diário de envio de fotos atingido. Tente mais tarde ou cadastre sem foto.');
      totalUploads++;
      const imagem = await operacaoCloudinary('upload', {
        file: `data:image/jpeg;base64,${base64}`, public_id: publicId, type: 'authenticated',
        overwrite: 'false', format: 'jpg', transformation: 'c_limit,w_1600,h_1600',
      });
      if (imagem.public_id !== publicId || imagem.resource_type !== 'image' || imagem.type !== 'authenticated'
        || imagem.format !== 'jpg' || !Number.isInteger(imagem.width) || !Number.isInteger(imagem.height)
        || imagem.width < 1 || imagem.height < 1 || imagem.width > 1600 || imagem.height > 1600) {
        throw new ErroFoto(502, 'O armazenamento retornou uma foto inválida. Tente selecionar outra imagem.');
      }
      const foto = { mapValue: { fields: {
        publicId: stringValue(publicId), formato: stringValue('jpg'),
        largura: { integerValue: String(imagem.width) }, altura: { integerValue: String(imagem.height) },
      } } };
      try {
        const resposta = await fetchImpl(`${firestore}:commit`, {
          method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(15_000),
          body: JSON.stringify({ writes: [{
            update: { name: `projects/${projectId}/databases/(default)/documents/ocorrencias/${id}`, fields: {
              descricao: stringValue(descricao), local: stringValue(local), categoria: stringValue(dados.categoria),
              prioridade: stringValue(dados.prioridade), usuarioId: stringValue(usuarioId), status: stringValue('aberta'), foto,
            } },
            currentDocument: { exists: false },
            updateTransforms: [{ fieldPath: 'criadaEm', setToServerValue: 'REQUEST_TIME' }],
          }] }),
        });
        if (!resposta.ok) throw await falhaGravacao(resposta);
      } catch (erro) {
        // Não apagar uma foto se o banco pode ter confirmado a gravação antes de uma queda da conexão.
        let confirmacao;
        try { confirmacao = await consultar(id, token); } catch { /* Estado incerto: preservar imagem privada para nova tentativa. */ }
        if (confirmacao?.estado === 'encontrado' && confirmacao.campos?.usuarioId?.stringValue === usuarioId) return { id };
        if (confirmacao?.estado === 'ausente') {
          try { await operacaoCloudinary('destroy', { public_id: publicId, type: 'authenticated', invalidate: 'true' }); }
          catch { console.error('Uma foto privada não pôde ser removida após falha no cadastro. Revise a Media Library.'); }
        }
        throw erro;
      }
      return { id };
    } finally { emAndamento.delete(chave); }
  };
}
