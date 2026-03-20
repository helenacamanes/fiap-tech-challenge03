import { initializeApp, getApps, getApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getAuth,
  initializeAuth,
  // @ts-expect-error
  getReactNativePersistence,
  type Auth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { env } from "../../config/env";

console.log("Firebase env check", {
  apiKey: !!env.firebaseApiKey,
  authDomain: env.firebaseAuthDomain,
  projectId: env.firebaseProjectId,
  storageBucket: env.firebaseStorageBucket,
  messagingSenderId: !!env.firebaseMessagingSenderId,
  appId: !!env.firebaseAppId,
});

const firebaseConfig = {
  apiKey: env.firebaseApiKey,
  authDomain: env.firebaseAuthDomain,
  projectId: env.firebaseProjectId,
  storageBucket: env.firebaseStorageBucket,
  messagingSenderId: env.firebaseMessagingSenderId,
  appId: env.firebaseAppId,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let authInstance: Auth;

try {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  console.log("Firebase auth initialized with RN persistence");
} catch (error) {
  console.warn("initializeAuth failed, falling back to getAuth", error);
  authInstance = getAuth(app);
}

export const auth = authInstance;
export const db = getFirestore(app);
export { app };
