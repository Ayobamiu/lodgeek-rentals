import {
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { Payout, FirebaseCollections } from "../../models";
import { payoutRef, db } from "../config";

export async function getPayoutsForCompany(id: string) {
  const q = query(payoutRef, where("companyId", "==", id));
  let payoutsList: Payout[] = [];

  await getDocs(q).then((payoutsSnapshot) => {
    payoutsList = payoutsSnapshot.docs.map((doc) => doc.data()) as Payout[];
  });

  return payoutsList;
}

export async function createPayout(payout: Payout) {
  return await setDoc(doc(payoutRef, payout.id), payout);
}

export async function deletePayoutFromDatabase(id: string) {
  return await deleteDoc(doc(payoutRef, id));
}

export async function getPayout(id: string) {
  const docRef = doc(payoutRef, id);
  const docSnap = await getDoc(docRef);
  return docSnap.data() as Payout;
}

export const updatePayoutInDatabase = async (payout: Payout) => {
  const docRef = doc(db, FirebaseCollections.payout, payout.id);
  return await updateDoc(docRef, payout);
};
