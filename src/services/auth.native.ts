import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseError } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth, type Auth, } from 'firebase/auth';

import { firebaseApp } from './firebase';

function configurarAuth(): Auth {
  try {
    return initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (erro) {
    if (
      erro instanceof FirebaseError &&
      erro.code === 'auth/already-initialized'
    ) {
      return getAuth(firebaseApp);
    }

    throw erro;
  }
}

export const auth = configurarAuth();