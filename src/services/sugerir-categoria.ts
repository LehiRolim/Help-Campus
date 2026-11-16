import { categorias, tamanhoMaximoDescricao, type Categoria } from '@/constants/categorias';
import { garantirUsuario } from './ocorrencias';

export async function sugerirCategoria(descricao: string, signal: AbortSignal): Promise<Categoria> {
  const endereco = process.env.EXPO_PUBLIC_IA_API_URL?.trim();
  if (!endereco) throw new Error('A sugestão por IA ainda não foi configurada. Escolha a categoria manualmente.');
  const texto = descricao.trim();
  if (texto.length < 10 || texto.length > tamanhoMaximoDescricao) {
    throw new Error('Descreva o problema com pelo menos 10 caracteres.');
  }
  const base = endereco.replace(/\/+$/, '');
<<<<<<< HEAD
=======
  // Acorda a hospedagem gratuita antes de enviar a descrição ou o token.
>>>>>>> origin/main
  try {
    const health = await fetch(`${base}/health`, { signal });
    if (!health.ok || (await health.json()).ok !== true) throw new Error('Servidor indisponível.');
  } catch {
    throw new Error('Não foi possível conectar à IA. Tente novamente ou escolha manualmente.');
  }
  const usuario = await garantirUsuario();
  const token = await usuario.getIdToken();
  if (signal.aborted) throw new Error('Solicitação cancelada.');
  let resposta;
  try {
    resposta = await fetch(`${base}/sugerir-categoria`, {
<<<<<<< HEAD
      method: 'POST',
      signal,
=======
      method: 'POST', signal,
>>>>>>> origin/main
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ descricao: texto }),
    });
  } catch {
    throw new Error('Não foi possível conectar à IA. Verifique sua conexão ou escolha manualmente.');
  }
  let dados;
<<<<<<< HEAD
  try {
    dados = await resposta.json();
  } catch {
=======
  try { dados = await resposta.json(); } catch {
>>>>>>> origin/main
    throw new Error('O servidor da IA não está pronto. Tente novamente em instantes.');
  }
  if (!resposta.ok) throw new Error(typeof dados.erro === 'string' ? dados.erro : 'Não foi possível sugerir uma categoria.');
  const categoria = categorias.find((item) => item.value === dados.categoria);
  if (!categoria) throw new Error('A IA retornou uma categoria inválida. Escolha manualmente.');
  return categoria.value;
<<<<<<< HEAD
} 
=======
}
>>>>>>> origin/main
