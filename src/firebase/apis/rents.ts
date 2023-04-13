import {
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { Rent, FirebaseCollections } from "../../models";
import { db, rentRef } from "../config";

export async function getRentsForRentalRecord(id: string) {
  const q = query(rentRef, where("rentalRecord", "==", id));
  let rentList: Rent[] = [];

  await getDocs(q).then((rentSnapshot) => {
    rentList = rentSnapshot.docs.map((doc) => doc.data()) as Rent[];
  });

  return rentList;
}

export async function createRent(rent: Rent) {
  return await setDoc(doc(rentRef, rent.id), rent);
}

export async function getRent(id: string) {
  const docRef = doc(rentRef, id);
  const docSnap = await getDoc(docRef);
  return docSnap.data() as Rent;
}

export const updateRentInDatabase = async (rent: Rent) => {
  const docRef = doc(db, FirebaseCollections.rents, rent.id);
  return await updateDoc(docRef, rent);
};
