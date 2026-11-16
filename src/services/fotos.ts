import type { NovaOcorrencia } from './ocorrencias';

export type FotoLocal = { uri: string; base64: string; largura: number; altura: number };
export type FotoSalva = { publicId: string; formato: 'jpg'; largura: number; altura: number };

async function requisitar(rota: string, corpo: object, token: string, signal: AbortSignal) {
  const endereco = process.env.EXPO_PUBLIC_IA_API_URL?.trim().replace(/\/+$/, '');
  if (!endereco) throw new Error('O servidor de fotos ainda não foi configurado.');
  const health = await fetch(`${endereco}/health`, { signal });
  if (!health.ok) throw new Error('Não foi possível conectar ao servidor de fotos.');
  const resposta = await fetch(`${endereco}${rota}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(corpo), signal,
  });
  let dados;
  try { dados = await resposta.json(); } catch { throw new Error('O servidor de fotos não está pronto. Tente novamente.'); }
  if (!resposta.ok) throw new Error(typeof dados.erro === 'string' ? dados.erro : 'Não foi possível processar a foto.');
  return dados;
}

export async function salvarComFoto(dados: NovaOcorrencia, id: string, foto: FotoLocal, token: string) {
  const controle = new AbortController();
  const timeout = setTimeout(() => controle.abort(), 180_000);
  try {
    const resposta = await requisitar('/ocorrencias/com-foto', { ocorrenciaId: id, dados, base64: foto.base64 }, token, controle.signal);
    if (resposta.id !== id) throw new Error('Não foi possível confirmar o cadastro. Tente novamente.');
    return id;
  } finally { clearTimeout(timeout); }
}

export async function obterUrlFoto(id: string, token: string, signal: AbortSignal): Promise<string> {
  const dados = await requisitar('/fotos/visualizar', { ocorrenciaId: id }, token, signal);
  if (typeof dados.url !== 'string' || !dados.url.startsWith('https://api.cloudinary.com/')) {
    throw new Error('O servidor retornou um endereço de foto inválido.');
  }
  return dados.url;
}
