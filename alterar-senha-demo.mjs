import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, updatePassword, signOut } from 'firebase/auth';
import { createInterface } from 'node:readline/promises';

const app = initializeApp({
  apiKey: 'AIzaSyAK_N1FGQDSDDdGzI-mLGeHFc0XmimkOAs',
  authDomain: 'help-campus.firebaseapp.com',
  projectId: 'help-campus',
});

const auth = getAuth(app);
const rl = createInterface({ input: process.stdin, output: process.stdout });

try {
  const email = await rl.question('E-mail cadastrado no Firebase: ');
  const senhaAtual = await rl.question('Senha atual: ');
  const novaSenha = await rl.question('Nova senha numérica (mínimo 6 dígitos): ');

  if (!/^\d{6,}$/.test(novaSenha)) {
    throw new Error('A nova senha deve conter somente números e ter no mínimo 6 dígitos.');
  }

  const credencial = await signInWithEmailAndPassword(auth, email.trim(), senhaAtual);
  await updatePassword(credencial.user, novaSenha);
  await signOut(auth);

  console.log('Senha alterada com sucesso!');
} catch (erro) {
  console.error('Falha:', erro.code ?? erro.message);
} finally {
  rl.close();
  process.exit();
}
