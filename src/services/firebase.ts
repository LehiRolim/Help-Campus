import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseError, getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth, type Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyAK_N1FGQDSDDdGzI-mLGeHFc0XmimkOAs",
  authDomain: "help-campus.firebaseapp.com",
  projectId: "help-campus",
  storageBucket: "help-campus.firebasestorage.app",
  messagingSenderId: "999750859533",
  appId: "1:999750859533:web:8a2530b3de580a7e8ace44"
};

export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

function configurarAuth(): Auth {
  if (Platform.OS === 'web') {
    return getAuth(firebaseApp);
  }
  try {
    return initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (erro) {
    if (erro instanceof FirebaseError && erro.code === 'auth/already-initialized') {
      return getAuth(firebaseApp);
    }
    throw erro;
  }
}

export const auth = configurarAuth();
export const db = getFirestore(firebaseApp);