import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC7VLaYQEGljie_syr1UKcK3_V_D5N9Sf8",
  authDomain: "tarefas-cf7de.firebaseapp.com",
  projectId: "tarefas-cf7de",
  storageBucket: "tarefas-cf7de.appspot.com",
  messagingSenderId: "263534704903",
  appId: "1:263534704903:web:31e840b778a60d4db3ada2"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app,  {
  persistence: getReactNativePersistence()
})

export const database = getDatabase(app)