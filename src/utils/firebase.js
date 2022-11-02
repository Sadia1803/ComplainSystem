import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

import "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyCCxJ-u3OmQcSCawYQdKuV4ShTLksSDHUQ",
  authDomain: "piacomplain-5a497.firebaseapp.com",
  databaseURL: "https://piacomplain-5a497-default-rtdb.firebaseio.com",
  projectId: "piacomplain-5a497",
  storageBucket: "piacomplain-5a497.appspot.com",
  messagingSenderId: "173072678601",
  appId: "1:173072678601:web:bca53a52aa2175b356d718"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default database;