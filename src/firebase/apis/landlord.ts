import {
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { Landlord, FirebaseCollections } from "../../models";
import { db, landlordRef } from "../config";

export async function getLandlordsForCompany(id: string) {
  const q = query(landlordRef, where("company", "==", id));
  let landlordList: Landlord[] = [];

  await getDocs(q).then((landlordSnapshot) => {
    landlordList = landlordSnapshot.docs.map((doc) => doc.data()) as Landlord[];
  });

  return landlordList;
}

export async function createLandlord(landlord: Landlord) {
  return await setDoc(doc(landlordRef, landlord.id), landlord);
}

export async function getLandlord(id: string) {
  const docRef = doc(landlordRef, id);
  const docSnap = await getDoc(docRef);
  return docSnap.data() as Landlord;
}

export const updateLandlordInDatabase = async (landlord: Landlord) => {
  const docRef = doc(db, FirebaseCollections.landlord, landlord.id);
  return await updateDoc(docRef, landlord);
};
