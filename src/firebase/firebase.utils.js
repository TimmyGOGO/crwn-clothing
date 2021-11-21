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

// создание пользователя в БД и получение на него ссылки:
export const createUserProfileDocument = async (userAuth, additionalData) => {
  // если данных по авторизации нет - возвращаем undefined:
  if (!userAuth) return;

  // по uid пользователя из авторизации достаем ссылку на него в БД:
  const userRef = firestore.doc(`users/${userAuth.uid}`);
  // по ссылке берем срез данных:
  const snapShot = await userRef.get();
  console.log(snapShot);

  // если данные пустые, то создаем новую запись пользователя по информации из userAuth:
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

  // иначе просто возвращаем ссылку на пользователя:
  return userRef;
};

firebase.initializeApp(config);

// приложения из firebase:
// авторизация:
export const auth = firebase.auth();
// база данных NoSQL от Firebase (не Realtime-database)
export const firestore = firebase.firestore();

// функция для быстрого добавления коллекции (данных) в cloud firestore:
export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd
) => {
  // firebase вернет collectionRef, если не найдет существующий, то вернет новый ref:
  const collectionRef = firestore.collection(collectionKey);

  const batch = firestore.batch();
  objectsToAdd.forEach((obj) => {
    // достаём ссылку на документ, в данном случае с пустым индексом (firebase сам его создаёт)
    const newDocRef = collectionRef.doc();
    batch.set(newDocRef, obj);
  });

  // публикуем (фиксируем) собранные в batch изменения:
  return await batch.commit();
};
// пример использования:
/* addCollectionAndDocuments(
    "collections",
    collectionsArray.map(({ title, items }) => ({ title, items }))
); */

// фнукция для извлечения данных из snapshot firestore:
export const convertCollectionsSnapshotToMap = (collections) => {
  const transformedCollection = collections.docs.map((doc) => {
    const { title, items } = doc.data();

    return {
      routeName: encodeURI(title.toLowerCase()),
      id: doc.id,
      title,
      items,
    };
  });

  return transformedCollection.reduce((accumulator, collection) => {
    accumulator[collection.title.toLowerCase()] = collection;
    return accumulator;
  }, {});
};

// провайдер для всплывашки и авторизации через Google:
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
