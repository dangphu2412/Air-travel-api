import {initializeApp, credential, ServiceAccount} from "firebase-admin";
import {FIREBASE_CONFIG} from "../env";
import serviceAccount from "./firebase.json";

export const firebaseApp = initializeApp({
  databaseURL: FIREBASE_CONFIG.DATABASE_FIREBASE_URL,
  credential: credential.cert(serviceAccount as ServiceAccount)
});
