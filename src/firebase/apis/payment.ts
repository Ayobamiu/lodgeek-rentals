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
import { Payment, FirebaseCollections } from "../../models";
import { paymentRef, db } from "../config";

export async function getPaymentsForCompany(id: string) {
  const q = query(paymentRef, where("companyId", "==", id));
  let paymentsList: Payment[] = [];

  await getDocs(q).then((paymentsSnapshot) => {
    paymentsList = paymentsSnapshot.docs.map((doc) => doc.data()) as Payment[];
  });

  return paymentsList;
}

export async function createPayment(payment: Payment) {
  return await setDoc(doc(paymentRef, payment.id), payment);
}

export async function deletePaymentFromDatabase(id: string) {
  return await deleteDoc(doc(paymentRef, id));
}

export async function getPayment(id: string) {
  const docRef = doc(paymentRef, id);
  const docSnap = await getDoc(docRef);
  return docSnap.data() as Payment;
}

export const updatePaymentInDatabase = async (payment: Payment) => {
  const docRef = doc(db, FirebaseCollections.payment, payment.id);
  return await updateDoc(docRef, payment);
};
