import {
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { Company, FirebaseCollections } from "../../models";
import { companyRef, db } from "../config";

export async function getUserCompanies(email: string) {
  const q = query(
    companyRef,
    where("primaryOwner", "==", email),
    where("team", "array-contains", email)
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

export const updateCompanyInDatabase = async (company: Company) => {
  const docRef = doc(db, FirebaseCollections.companies, company.id);
  return await updateDoc(docRef, company);
};
