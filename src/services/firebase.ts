import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseError, getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth, type Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyACF7hvlxU_ARlntechBysyRM7fjQd4XWw",
  authDomain: "help-campus-b6d64.firebaseapp.com",
  projectId: "help-campus-b6d64",
  storageBucket: "help-campus-b6d64.firebasestorage.app",
  messagingSenderId: "44538956424",
  appId: "1:44538956424:web:5202929fe3dbd0b10ead3d"
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