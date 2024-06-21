import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB6e7YcYOKrvGfnYWmVLHqXoZMkiHvOgjY",
  authDomain: "webcarros-29f54.firebaseapp.com",
  projectId: "webcarros-29f54",
  storageBucket: "webcarros-29f54.appspot.com",
  messagingSenderId: "897906503000",
  appId: "1:897906503000:web:0fbdf1fd0e101839d7c92d"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
