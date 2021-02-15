import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAx4igzCgcYun1xS1hAe1tE5wVApb7VjFs",
  authDomain: "think-piece-fem-1242a.firebaseapp.com",
  projectId: "think-piece-fem-1242a",
  storageBucket: "think-piece-fem-1242a.appspot.com",
  messagingSenderId: "1024899357489",
  appId: "1:1024899357489:web:77a22a69ec6934f5102e10",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();

firestore.settings({ timestampsInSnapshots: true });

window.firebase = firebase;

export default firebase;
