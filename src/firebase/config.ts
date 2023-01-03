// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import "firebase/compat/auth";
import { collection, doc, getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCAh09zMEvDptgHHoE0bVsJs7VU_0dfH4A",
  authDomain: "lodgeek-rentals.firebaseapp.com",
  projectId: "lodgeek-rentals",
  storageBucket: "lodgeek-rentals.appspot.com",
  messagingSenderId: "1083371496950",
  appId: "1:1083371496950:web:cea604eed545303895d3d7",
  measurementId: "G-FVQ0X4NMP5",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = firebase.auth();
const db = getFirestore(app);
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
  app,
  db,
  PROPERTY_PATH,
  RENTAL_RECORD_PATH,
  RENT_PATH,
  USER_PATH,
};
