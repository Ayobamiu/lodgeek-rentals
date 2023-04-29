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
import { RentalRecord, FirebaseCollections } from "../../models";
import { rentalRecordRef, db } from "../config";

export async function getRentalRecordsForCompany(id: string) {
  const q = query(rentalRecordRef, where("companyId", "==", id));
  let rentalRecordsList: RentalRecord[] = [];

  await getDocs(q).then((rentalRecordsSnapshot) => {
    rentalRecordsList = rentalRecordsSnapshot.docs.map((doc) =>
      doc.data()
    ) as RentalRecord[];
  });

  return rentalRecordsList;
}
export async function getRentalRecordsForRentalRecord(id: string) {
  const q = query(rentalRecordRef, where("rentalRecordId", "==", id));
  let rentalRecordsList: RentalRecord[] = [];

  await getDocs(q).then((rentalRecordsSnapshot) => {
    rentalRecordsList = rentalRecordsSnapshot.docs.map((doc) =>
      doc.data()
    ) as RentalRecord[];
  });

  return rentalRecordsList;
}

export async function createRentalRecord(rentalRecord: RentalRecord) {
  return await setDoc(doc(rentalRecordRef, rentalRecord.id), rentalRecord);
}

export async function deleteRentalRecordFromDatabase(id: string) {
  return await deleteDoc(doc(rentalRecordRef, id));
}

export async function getRentalRecord(id: string) {
  const docRef = doc(rentalRecordRef, id);
  const docSnap = await getDoc(docRef);
  return docSnap.data() as RentalRecord;
}

export const updateRentalRecordInDatabase = async (
  rentalRecord: RentalRecord
) => {
  const docRef = doc(db, FirebaseCollections.rentalRecords, rentalRecord.id);
  return await updateDoc(docRef, rentalRecord);
};
