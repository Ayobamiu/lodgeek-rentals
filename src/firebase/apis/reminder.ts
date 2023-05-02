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
import { Reminder, FirebaseCollections } from "../../models";
import { reminderRef, db } from "../config";

export async function getRemindersForCompany(id: string) {
  const q = query(reminderRef, where("companyId", "==", id));
  let remindersList: Reminder[] = [];

  await getDocs(q).then((remindersSnapshot) => {
    remindersList = remindersSnapshot.docs.map((doc) =>
      doc.data()
    ) as Reminder[];
  });

  return remindersList;
}
export async function getRemindersForRentalRecord(id: string) {
  const q = query(reminderRef, where("rentalRecordId", "==", id));
  let remindersList: Reminder[] = [];

  await getDocs(q).then((remindersSnapshot) => {
    remindersList = remindersSnapshot.docs.map((doc) =>
      doc.data()
    ) as Reminder[];
  });

  return remindersList;
}

export async function createReminder(reminder: Reminder) {
  return await setDoc(doc(reminderRef, reminder.id), reminder);
}

export async function deleteReminderFromDatabase(id: string) {
  return await deleteDoc(doc(reminderRef, id));
}

export async function getReminder(id: string) {
  const docRef = doc(reminderRef, id);
  const docSnap = await getDoc(docRef);
  return docSnap.data() as Reminder;
}

export const updateReminderInDatabase = async (reminder: Reminder) => {
  const docRef = doc(db, FirebaseCollections.reminders, reminder.id);
  return await updateDoc(docRef, reminder);
};
