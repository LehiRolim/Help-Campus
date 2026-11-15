import assert from 'node:assert/strict';
import { once } from 'node:events';
import { test } from 'node:test';
import { criarServidor } from './ia.mjs';

const claims = { aud: 'teste', sub: 'usuario', iss: 'https://securetoken.google.com/teste' };
const token = `header.${Buffer.from(JSON.stringify(claims)).toString('base64url')}.signature`;
const json = (dados, status = 200) => new Response(JSON.stringify(dados), { status });
const resultado = (categoria) => json({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text: JSON.stringify({ categoria }) }] } }] });

async function executar(t, chamadaGemini = () => resultado('hidraulica'), autenticar = () => json({ users: [{ localId: 'usuario' }] })) {
  const chamadas = [];
  const servidor = criarServidor({
    geminiKey: 'chave-secreta-de-teste', firebaseKey: 'firebase-publica', projectId: 'teste', model: 'modelo-teste',
    fetchImpl: async (url, opcoes) => {
      chamadas.push({ url, opcoes });
      return url.includes('identitytoolkit') ? autenticar() : chamadaGemini(opcoes);
    },
  });
  servidor.listen(0, '127.0.0.1');
  await once(servidor, 'listening');
  t.after(() => new Promise((resolve) => {
    servidor.close(resolve);
    servidor.closeAllConnections();
  }));
  const url = `http://127.0.0.1:${servidor.address().port}`;
  async function pedir(corpo = { descricao: 'Torneira do banheiro está vazando' }, extraHeaders = {}) {
    return fetch(`${url}/sugerir-categoria`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...extraHeaders },
      body: JSON.stringify(corpo),
    });
  }
  return { pedir, chamadas, url };
}

test('aceita categoria válida e envia apenas a descrição como conteúdo do usuário', async (t) => {
  const { pedir, chamadas } = await executar(t);
  const res = await pedir();
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { categoria: 'hidraulica' });
  const chamada = chamadas[1];
  assert.equal(chamada.opcoes.headers['x-goog-api-key'], 'chave-secreta-de-teste');
  const corpo = JSON.parse(chamada.opcoes.body);
  assert.deepEqual(corpo.contents, [{ role: 'user', parts: [{ text: 'Torneira do banheiro está vazando' }] }]);
  assert.equal(corpo.generationConfig.responseSchema.properties.categoria.enum.length, 7);
});

test('rejeita descrições vazias e grandes antes de acessar o Google', async (t) => {
  const { pedir, chamadas } = await executar(t);
  for (const descricao of ['', 'curta', 'x'.repeat(2001)]) {
    assert.equal((await pedir({ descricao })).status, 400);
  }
  assert.equal(chamadas.length, 0);
});

test('nega sessão ausente ou recusada sem chamar Gemini', async (t) => {
  const { pedir, chamadas } = await executar(t, undefined, () => json({}, 400));
  assert.equal((await pedir(undefined, { Authorization: '' })).status, 401);
  assert.equal((await pedir()).status, 401);
  assert.equal(chamadas.length, 1);
});

test('não aceita token de outro projeto', async (t) => {
  const { pedir, chamadas } = await executar(t);
  const outro = `header.${Buffer.from(JSON.stringify({ ...claims, aud: 'outro' })).toString('base64url')}.signature`;
  assert.equal((await pedir(undefined, { Authorization: `Bearer ${outro}` })).status, 401);
  assert.equal(chamadas.length, 1);
});

test('não aceita categoria inventada nem resposta bloqueada', async (t) => {
  const invalida = await executar(t, () => resultado('categoria-inventada'));
  assert.equal((await invalida.pedir()).status, 502);
  const bloqueada = await executar(t, () => json({ promptFeedback: { blockReason: 'SAFETY' } }));
  assert.equal((await bloqueada.pedir()).status, 502);
});

test('quota indisponível e timeout geram erros recuperáveis sem expor chave', async (t) => {
  const quota = await executar(t, () => json({ error: 'detalhes-privados' }, 429));
  const resposta = await quota.pedir();
  assert.equal(resposta.status, 429);
  assert.ok(!(await resposta.text()).includes('detalhes-privados'));
  const timeout = await executar(t, () => { throw new DOMException('chave-secreta-de-teste', 'TimeoutError'); });
  const falha = await timeout.pedir();
  assert.equal(falha.status, 504);
  assert.ok(!(await falha.text()).includes('chave-secreta-de-teste'));
});

test('limita chamadas por usuário antes de gastar mais cota Gemini', async (t) => {
  const { pedir, chamadas } = await executar(t);
  for (let i = 0; i < 6; i++) assert.equal((await pedir()).status, 200);
  assert.equal((await pedir()).status, 429);
  assert.equal(chamadas.filter(({ url }) => url.includes('generativelanguage')).length, 6);
});

test('health funciona sem Google e requisição grande é recusada', async (t) => {
  const { pedir, chamadas, url } = await executar(t);
  assert.deepEqual(await (await fetch(`${url}/health`)).json(), { ok: true });
  const inicio = await fetch(url);
  assert.equal(inicio.status, 200);
  assert.equal((await inicio.json()).health, '/health');
  assert.equal((await pedir({ descricao: 'x'.repeat(13000) })).status, 413);
  assert.equal(chamadas.length, 0);
});

test('rotas de foto também exigem sessão antes de acessar Firestore ou Cloudinary', async (t) => {
  const { url, chamadas } = await executar(t);
  for (const rota of ['/ocorrencias/com-foto', '/fotos/visualizar']) {
    const resposta = await fetch(`${url}${rota}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ocorrenciaId: 'abcdefghijklmnopqrst' }),
    });
    assert.equal(resposta.status, 401);
  }
  assert.equal(chamadas.length, 0);
});
