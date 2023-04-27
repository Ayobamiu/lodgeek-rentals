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
import { Invoice, FirebaseCollections } from "../../models";
import { invoiceRef, db } from "../config";

export async function getInvoicesForCompany(id: string) {
  const q = query(invoiceRef, where("companyId", "==", id));
  let invoicesList: Invoice[] = [];

  await getDocs(q).then((invoicesSnapshot) => {
    invoicesList = invoicesSnapshot.docs.map((doc) => doc.data()) as Invoice[];
  });

  return invoicesList;
}

export async function createInvoice(invoice: Invoice) {
  return await setDoc(doc(invoiceRef, invoice.id), invoice);
}

export async function deleteInvoiceFromDatabase(id: string) {
  return await deleteDoc(doc(invoiceRef, id));
}

export async function getInvoice(id: string) {
  const docRef = doc(invoiceRef, id);
  const docSnap = await getDoc(docRef);
  return docSnap.data() as Invoice;
}

export const updateInvoiceInDatabase = async (invoice: Invoice) => {
  const docRef = doc(db, FirebaseCollections.invoice, invoice.id);
  return await updateDoc(docRef, invoice);
};
