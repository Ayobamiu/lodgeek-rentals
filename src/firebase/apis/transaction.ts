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
import { MoneyTransaction, FirebaseCollections } from "../../models";
import { transactionRef, db } from "../config";

export async function getTransactionsForCompany(id: string) {
  const q = query(transactionRef, where("company", "==", id));
  let transactionsList: MoneyTransaction[] = [];

  await getDocs(q).then((transactionsSnapshot) => {
    transactionsList = transactionsSnapshot.docs.map((doc) =>
      doc.data()
    ) as MoneyTransaction[];
  });

  return transactionsList;
}

export async function createTransaction(transaction: MoneyTransaction) {
  return await setDoc(doc(transactionRef, transaction.id), transaction);
}

export async function deleteTransactionFromDatabase(id: string) {
  return await deleteDoc(doc(transactionRef, id));
}

export async function getTransaction(id: string) {
  const docRef = doc(transactionRef, id);
  const docSnap = await getDoc(docRef);
  return docSnap.data() as MoneyTransaction;
}

export const updateTransactionInDatabase = async (
  transaction: MoneyTransaction
) => {
  const docRef = doc(db, FirebaseCollections.transaction, transaction.id);
  return await updateDoc(docRef, transaction);
};
