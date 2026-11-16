import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { test } from 'node:test';
import { criarFotos } from './fotos.mjs';

const id = 'abcdefghijklmnopqrst';
const usuarioId = 'usuario';
const base64 = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0xff, 0xd9]).toString('base64');
const publicId = `help-campus/${usuarioId}/${id}-${createHash('sha256').update(Buffer.from(base64, 'base64')).digest('hex').slice(0, 16)}`;
const dados = { descricao: 'Torneira vazando água', local: 'Bloco A', categoria: 'hidraulica', prioridade: 'media' };
const documento = (dono = usuarioId, imagem = publicId) => ({ fields: {
  usuarioId: { stringValue: dono },
  foto: { mapValue: { fields: { publicId: { stringValue: imagem }, formato: { stringValue: 'jpg' } } } },
} });
const json = (dados, status = 200) => new Response(JSON.stringify(dados), { status });

function preparar({ salvar = true, docInicial = null, confirmar = null, falhaConfirmacao = false, erroGravacao = {}, httpGravacao = 403 } = {}) {
  const chamadas = [];
  let consultas = 0;
  const fotos = criarFotos({ cloudName: 'teste', apiKey: 'key', apiSecret: 'secret', projectId: 'projeto', categorias: { hidraulica: 'Hidráulica' },
    fetchImpl: async (url, opcoes) => {
      chamadas.push({ url, opcoes });
      if (url.includes('/ocorrencias/')) {
        consultas++;
        if (consultas > 1 && falhaConfirmacao) throw new Error('Conexão perdida');
        const doc = consultas === 1 ? docInicial : confirmar;
        return doc ? json(doc) : json({}, 404);
      }
      if (url.endsWith('/upload')) return json({ public_id: publicId, resource_type: 'image', type: 'authenticated', format: 'jpg', width: 800, height: 600 });
      if (url.endsWith(':commit')) return json(erroGravacao, salvar ? 200 : httpGravacao);
      if (url.endsWith('/destroy')) return json({ result: 'ok' });
      throw new Error('Rota de teste inesperada');
    },
  });
  const executar = (corpo = { ocorrenciaId: id, base64, dados }, rota = '/ocorrencias/com-foto') => fotos({ rota, corpo, usuarioId, token: 'token' });
  return { executar, chamadas };
}

test('envia foto autenticada e salva metadados com criação atômica no Firestore', async () => {
  const { executar, chamadas } = preparar();
  assert.deepEqual(await executar(), { id });
  const upload = chamadas.find((item) => item.url.endsWith('/upload'));
  assert.equal(upload.opcoes.body.get('type'), 'authenticated');
  assert.equal(upload.opcoes.body.get('overwrite'), 'false');
  assert.equal(upload.opcoes.body.get('file'), `data:image/jpeg;base64,${base64}`);
  const commit = JSON.parse(chamadas.find((item) => item.url.endsWith(':commit')).opcoes.body);
  assert.deepEqual(commit.writes[0].currentDocument, { exists: false });
  assert.equal(commit.writes[0].update.fields.foto.mapValue.fields.publicId.stringValue, publicId);
  assert.equal(commit.writes[0].update.fields.usuarioId.stringValue, usuarioId);
  assert.ok(!JSON.stringify(commit).includes(base64));
});

test('nova tentativa de uma ocorrência já salva não envia outra foto', async () => {
  const { executar, chamadas } = preparar({ docInicial: documento() });
  assert.deepEqual(await executar(), { id });
  assert.equal(chamadas.length, 1);
});

test('recusa arquivo não JPEG, tamanho excessivo, categoria e id inválidos antes do upload', async () => {
  const { executar, chamadas } = preparar();
  for (const corpo of [
    { ocorrenciaId: '../outra-conta', base64, dados },
    { ocorrenciaId: id, base64: Buffer.from('isto não é uma foto').toString('base64'), dados },
    { ocorrenciaId: id, base64: 'x'.repeat(3_000_000), dados },
    { ocorrenciaId: id, base64, dados: { ...dados, categoria: 'inventada' } },
  ]) await assert.rejects(executar(corpo), (erro) => erro.status === 400);
  assert.equal(chamadas.length, 0);
});

test('remove imagem após falha de gravação com ausência confirmada', async () => {
  const { executar, chamadas } = preparar({ salvar: false });
  await assert.rejects(executar());
  assert.equal(chamadas.filter((item) => item.url.endsWith('/destroy')).length, 1);
});

test('não remove imagem quando a confirmação do banco é incerta', async () => {
  const { executar, chamadas } = preparar({ salvar: false, falhaConfirmacao: true });
  await assert.rejects(executar());
  assert.equal(chamadas.filter((item) => item.url.endsWith('/destroy')).length, 0);
});

test('reconhece gravação confirmada após resposta perdida sem remover foto', async () => {
  const { executar, chamadas } = preparar({ salvar: false, confirmar: documento() });
  assert.deepEqual(await executar(), { id });
  assert.equal(chamadas.filter((item) => item.url.endsWith('/destroy')).length, 0);
});

test('gera URL temporária somente para foto da ocorrência do proprietário', async () => {
  const { executar } = preparar({ docInicial: documento() });
  const retorno = await executar({ ocorrenciaId: id }, '/fotos/visualizar');
  const url = new URL(retorno.url);
  assert.equal(url.searchParams.get('type'), 'authenticated');
  assert.equal(url.searchParams.get('public_id'), publicId);
  assert.equal(url.searchParams.get('expires_at'), String(retorno.expiraEm));
  assert.equal(url.searchParams.get('signature').length, 64);
  assert.ok(!retorno.url.includes('secret'));
});

test('nega acesso a ocorrência de outra conta e a referência de imagem fora da pasta do proprietário', async () => {
  for (const doc of [documento('outra-conta'), documento(usuarioId, 'help-campus/outra-conta/foto')]) {
    const { executar } = preparar({ docInicial: doc });
    await assert.rejects(executar({ ocorrenciaId: id }, '/fotos/visualizar'), (erro) => erro.status === 404);
  }
});

test('ausência de credenciais retorna mensagem de configuração sem expor segredos', async () => {
  const fotos = criarFotos({ projectId: 'projeto', categorias: {} });
  await assert.rejects(fotos({ rota: '/fotos/visualizar', corpo: { ocorrenciaId: id }, usuarioId, token: 'token' }), (erro) => erro.status === 503);
});

test('identifica recusa do Firestore sem registrar corpo com dados sensíveis', async (t) => {
  const log = t.mock.method(console, 'error', () => {});
  const { executar } = preparar({ salvar: false, erroGravacao: { error: {
    status: 'PERMISSION_DENIED', message: 'texto privado e token não devem ir ao log',
  } } });
  await assert.rejects(executar(), (erro) => erro.status === 403 && erro.message.includes('PERMISSION_DENIED'));
  const mensagens = log.mock.calls.map((call) => call.arguments.join(' ')).join('\n');
  assert.match(mensagens, /HTTP 403, PERMISSION_DENIED/);
  assert.ok(!mensagens.includes('texto privado'));
});

test('distingue API desativada de regras negando gravação', async (t) => {
  t.mock.method(console, 'error', () => {});
  const { executar } = preparar({ salvar: false, erroGravacao: { error: {
    status: 'PERMISSION_DENIED', details: [{ reason: 'SERVICE_DISABLED' }],
  } } });
  await assert.rejects(executar(), (erro) => erro.status === 503 && erro.message.includes('API do Firestore está desativada'));
});
