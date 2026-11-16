import { criarServidor } from './ia.mjs'; 

const servidor = criarServidor({
  geminiKey: process.env.GEMINI_API_KEY,
  model: process.env.MODEL_NAME || 'gemini-3.8-flash', 
  firebaseKey: process.env.FIREBASE_WEB_API_KEY,
  projectId: process.env.FIREBASE_PROJECT_ID,
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudApiKey: process.env.CLOUDINARY_API_KEY,
  cloudApiSecret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = 8787;
servidor.listen(PORT, () => {
  console.log(`[Help-Campus] Servidor a rodar na porta ${PORT} com o modelo gemini-3.8-flash`);
});