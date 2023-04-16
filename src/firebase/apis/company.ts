import {
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { Company, FirebaseCollections, User } from "../../models";
import { companyRef, db, usersRef } from "../config";

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

export async function getUserDefaultCompany(id: string) {
  const userRef = doc(usersRef, id);
  const userSnap = await getDoc(userRef);
  const user = userSnap.data() as User;
  if (user.defaultCompany) {
    const docRef = doc(companyRef, user.defaultCompany);
    const docSnap = await getDoc(docRef);
    return docSnap.data() as Company;
  } else {
    return null;
  }
}
export async function getCompany(id: string) {
  const docRef = doc(companyRef, id);
  const docSnap = await getDoc(docRef);
  return docSnap.data() as Company;
}

export const updateCompanyInDatabase = async (company: Company) => {
  const docRef = doc(db, FirebaseCollections.companies, company.id);
  return await updateDoc(docRef, company);
};
