import { doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { Company } from "../../models";
import { companyRef } from "../config";

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
