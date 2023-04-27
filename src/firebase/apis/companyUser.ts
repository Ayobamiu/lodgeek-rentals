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
import { CompanyUser, FirebaseCollections } from "../../models";
import { companyUserRef, db } from "../config";

export async function getCompanyUsersForCompany(id: string) {
  const q = query(companyUserRef, where("companyId", "==", id));
  let companyUsersList: CompanyUser[] = [];

  await getDocs(q).then((companyUsersSnapshot) => {
    companyUsersList = companyUsersSnapshot.docs.map((doc) =>
      doc.data()
    ) as CompanyUser[];
  });

  return companyUsersList;
}

export async function createCompanyUser(companyUser: CompanyUser) {
  return await setDoc(doc(companyUserRef, companyUser.id), companyUser);
}

export async function deleteCompanyUser(id: string) {
  return await deleteDoc(doc(companyUserRef, id));
}

export async function getCompanyUser(id: string) {
  const docRef = doc(companyUserRef, id);
  const docSnap = await getDoc(docRef);
  return docSnap.data() as CompanyUser;
}

export const updateCompanyUserInDatabase = async (companyUser: CompanyUser) => {
  const docRef = doc(db, FirebaseCollections.companyUser, companyUser.id);
  return await updateDoc(docRef, companyUser);
};
