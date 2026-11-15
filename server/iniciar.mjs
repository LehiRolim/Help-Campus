import { networkInterfaces } from 'node:os';
import { criarServidor } from './ia.mjs';

const geminiKey = process.env.GEMINI_API_KEY?.trim();
const firebaseKey = process.env.FIREBASE_WEB_API_KEY?.trim();
if (!geminiKey || !firebaseKey) {
  console.error('Configure GEMINI_API_KEY e FIREBASE_WEB_API_KEY no ambiente do servidor. Consulte server/README.md.');
  process.exit(1);
}

const port = Number(process.env.PORT || 8787);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('PORT deve ser uma porta válida entre 1 e 65535.');
  process.exit(1);
}
const servidor = criarServidor({
  geminiKey, firebaseKey,
  projectId: process.env.FIREBASE_PROJECT_ID || 'help-campus-b6d64',
  model: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
  cloudName: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  cloudApiKey: process.env.CLOUDINARY_API_KEY?.trim(),
  cloudApiSecret: process.env.CLOUDINARY_API_SECRET?.trim(),
});
servidor.requestTimeout = 60_000;
servidor.headersTimeout = 10_000;
servidor.on('error', (erro) => {
  console.error(`Não foi possível iniciar o servidor (${erro.code}). Verifique se a porta ${port} está livre.`);
  process.exitCode = 1;
});
servidor.listen(port, '0.0.0.0', () => {
  console.log(`Servidor da IA iniciado na porta ${port}.`);
  if (process.env.RENDER_EXTERNAL_URL) {
    console.log(`Verificação de conexão: ${process.env.RENDER_EXTERNAL_URL}/health`);
  } else {
    console.log('Mantenha este terminal aberto para os testes locais.');
    for (const interfaces of Object.values(networkInterfaces())) {
      for (const rede of interfaces ?? []) {
        if (rede.family === 'IPv4' && !rede.internal) console.log(`Possível endereço para o celular: http://${rede.address}:${port}`);
      }
    }
  }
});

for (const sinal of ['SIGTERM', 'SIGINT']) {
  process.on(sinal, () => {
    servidor.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 10_000).unref();
  });
}
