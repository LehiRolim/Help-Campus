import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

let AsyncStorage = null;
try {
  AsyncStorage = require('@async-storage/async-storage').default;
} catch (e) {
}

const firebaseConfig = {
  apiKey: "AIzaSyAK_N1FGQDSDDdGzI-mLGeHFc0XmimkOAs",
  authDomain: "help-campus.firebaseapp.com",
  projectId: "help-campus",
  storageBucket: "help-campus.firebasestorage.app",
  messagingSenderId: "999750859533",
  appId: "1:999750859533:web:8a2530b3de580a7e8ace44"
};

const app = initializeApp(firebaseConfig);  

export const auth = initializeAuth(app, {
  persistence: Platform.OS === 'web' ? undefined : (AsyncStorage ? getReactNativePersistence(AsyncStorage) : undefined)
});

export const db = getFirestore(app);