import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

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
export const auth = firebase.auth();
export const storage = firebase.storage();

export const provider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => auth.signInWithPopup(provider);
export const signOut = () => auth.signOut();

firestore.settings({ timestampsInSnapshots: true });

window.firebase = firebase;

export const createUserProfileDocument = async (user, additionalData) => {
  if (!user) return;

  // Get a reference to the place in the database where a user profile might be.
  const userRef = firestore.doc(`users/${user.uid}`);

  // Go and fetch the document from that location
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const { displayName, email, photoURL } = user;
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName,
        email,
        photoURL,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.error(error);
    }
  }

  return getUserDocument(user.uid);
};

export const getUserDocument = async (uid) => {
  if (!uid) return null;
  try {
    return firestore.collection("users").doc(uid);
  } catch (error) {
    console.error("Error fetching user", error.message);
  }
};

export default firebase;
