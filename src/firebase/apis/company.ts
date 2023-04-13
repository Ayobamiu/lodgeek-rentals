import {
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { Company, FirebaseCollections, IProperty } from "../../models";
import { companyRef, db, propertyRef } from "../config";

export async function getUserCompanies(email: string) {
  const q = query(
    companyRef,
    (where("primaryOwner", "==", email), where("team", "array-contains", email))
  );
  let companiesList: Company[] = [];

  await getDocs(q).then((companiesSnapshot) => {
    companiesList = companiesSnapshot.docs.map((doc) =>
      doc.data()
    ) as Company[];
  });

  return companiesList;
}

export async function createCompany(company: Company) {
  return await setDoc(doc(companyRef, company.id), company);
}

export async function getCompany(id: string) {
  const docRef = doc(companyRef, id);
  const docSnap = await getDoc(docRef);
  return docSnap.data() as Company;
}

// pROPERTY REF
export async function getProperty(id?: string) {
  const docRef = doc(propertyRef, id);
  const docSnap = await getDoc(docRef);
  return docSnap.data() as IProperty;
}

export const updateCompanyInDatabase = async (company: Company) => {
  const docRef = doc(db, FirebaseCollections.companies, company.id);
  return await updateDoc(docRef, company);
};
