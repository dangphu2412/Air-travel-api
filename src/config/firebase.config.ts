import {AppOptions} from "firebase-admin";
import {FIREBASE_CONFIG} from "../env";

export const firebaseConfig: AppOptions = {
  databaseURL: FIREBASE_CONFIG.DATABASE_FIREBASE_URL,
  projectId: FIREBASE_CONFIG.PROJECT_ID
};
