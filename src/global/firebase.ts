import {initializeApp} from "firebase-admin";
import {firebaseConfig} from "src/config/firebase.config";

export const FirebaseService = initializeApp(firebaseConfig);

