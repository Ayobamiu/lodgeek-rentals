// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import { getAnalytics } from "firebase/analytics";
import "firebase/compat/auth";
import { collection, doc, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
  measurementId: process.env.REACT_APP_measurementId,
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);
// const fv = firebase.firestore.FieldValue;

const auth = getAuth();

const analytics = getAnalytics(app);
// const firestore = firebase.firestore();

export const generateFirebaseId = (path: string) => {
  // const firRef = firestore.collection(path).doc();
  const firRef = doc(collection(db, path));

  return firRef.id;
};
const USER_PATH = "users";
const PROPERTY_PATH = "properties";
const RENTAL_RECORD_PATH = "rentalRecords";
const RENT_PATH = "rents";

export {
  analytics,
  auth,
  db,
  PROPERTY_PATH,
  RENTAL_RECORD_PATH,
  RENT_PATH,
  USER_PATH,
};
