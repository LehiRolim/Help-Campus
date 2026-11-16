import { execFile, spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';

const raiz = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
const expoCli = join(dirname(require.resolve('expo/package.json')), 'bin/cli');
const processos = [];
let encerrando = false;

function parar(filho) {
  if (!filho.pid || filho.exitCode !== null || filho.signalCode !== null) return Promise.resolve();
  return new Promise((resolve) => {
    filho.once('close', resolve);
    if (process.platform === 'win32') {
      // Encerra somente a árvore do processo criado por este script (incluindo workers do Metro).
      execFile('taskkill.exe', ['/PID', String(filho.pid), '/T', '/F'], { windowsHide: true }, (erro) => {
        if (erro && filho.exitCode === null && filho.signalCode === null) filho.kill();
        resolve();
      });
    } else {
      filho.kill('SIGTERM');
      const limite = setTimeout(() => { filho.kill('SIGKILL'); resolve(); }, 5000);
      limite.unref();
      filho.once('close', () => clearTimeout(limite));
    }
  });
}

async function encerrar(codigo) {
  if (encerrando) return;
  encerrando = true;
  console.log('\n[Dev] Encerrando Expo e servidor...');
  await Promise.all(processos.map(parar));
  process.exit(codigo);
}

function acompanhar(nome, filho) {
  processos.push(filho);
  filho.once('error', (erro) => {
    console.error(`[${nome}] Não foi possível iniciar: ${erro.message}`);
    encerrar(1);
  });
  filho.once('exit', (codigo) => {
    if (!encerrando) {
      console.log(`\n[${nome}] Processo encerrado${codigo === null ? '' : ` (código ${codigo})`}.`);
      encerrar(codigo ?? 1);
    }
  });
}

process.on('SIGINT', () => encerrar(0));
process.on('SIGTERM', () => encerrar(0));

console.log('[Dev] Iniciando servidor de IA/fotos e Expo. Ctrl+C encerra os dois.');

const servidor = spawn(process.execPath, ['--env-file=.env.gemini.local', 'server/iniciar.mjs'], {
  cwd: raiz, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true,
});
acompanhar('Servidor', servidor);
for (const [stream, escrever] of [[servidor.stdout, console.log], [servidor.stderr, console.error]]) {
  createInterface({ input: stream }).on('line', (linha) => escrever(`[Servidor] ${linha}`));
}

// Somente o filho do servidor lê as credenciais. O Expo mantém stdin/TTY para QR Code e atalhos.
const expo = spawn(process.execPath, [expoCli, 'start', ...process.argv.slice(2)], {
  cwd: raiz, stdio: 'inherit', windowsHide: true,
});
acompanhar('Expo', expo);
