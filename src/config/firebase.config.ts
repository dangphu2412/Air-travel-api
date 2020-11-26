import {credential, ServiceAccount, AppOptions} from "firebase-admin";
import {FIREBASE_CONFIG} from "../env";
import serviceAccount from "./firebase.json";

export const firebaseConfig: AppOptions = {
  databaseURL: FIREBASE_CONFIG.DATABASE_FIREBASE_URL,
  credential: credential.cert(serviceAccount as ServiceAccount)
};
