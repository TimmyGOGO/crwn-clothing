import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const config = {
  apiKey: "AIzaSyCPD85d7nvfjLdQ9uw71nhdebH6MXNMrxo",
  authDomain: "crwn-db-a14e5.firebaseapp.com",
  databaseURL: "https://crwn-db-a14e5.firebaseio.com",
  projectId: "crwn-db-a14e5",
  storageBucket: "crwn-db-a14e5.appspot.com",
  messagingSenderId: "363844275355",
  appId: "1:363844275355:web:f820a7cf9755ff58e6ca3e",
  measurementId: "G-Z8FKR97PBP",
};

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get();
  console.log(snapShot);

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.log("error creating user", error.message);
    }
  }

  return userRef;
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
