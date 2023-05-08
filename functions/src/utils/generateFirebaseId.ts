import admin = require("firebase-admin");
import { FirebaseCollections } from "../models";

export const db = admin.firestore();

export const generateFirebaseId = (id: FirebaseCollections) => {
  const ref = db.collection(id);
  return ref.id;
};
