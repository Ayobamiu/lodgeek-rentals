import {
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { Property, FirebaseCollections } from "../../models";
import { db, propertyRef } from "../config";

export async function getPropertiesForCompany(id: string) {
  const q = query(propertyRef, where("company", "==", id));
  let propertyList: Property[] = [];

  await getDocs(q).then((propertySnapshot) => {
    propertyList = propertySnapshot.docs.map((doc) => doc.data()) as Property[];
  });

  return propertyList;
}

export async function createProperty(property: Property) {
  return await setDoc(doc(propertyRef, property.id), property);
}

export async function getProperty(id: string) {
  const docRef = doc(propertyRef, id);
  const docSnap = await getDoc(docRef);
  return docSnap.data() as Property;
}

export const updatePropertyInDatabase = async (property: Property) => {
  const docRef = doc(db, FirebaseCollections.properties, property.id);
  return await updateDoc(docRef, property);
};
