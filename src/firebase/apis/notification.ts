import {
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { NotificationMessage, FirebaseCollections } from "../../models";
import { notificationRef, db } from "../config";

export async function getUserNotifications(email: string) {
  const q = query(
    notificationRef,
    where("recipientId", "==", email),
    where("status", "==", "sent"),
    orderBy("timestamp", "desc"),
    limit(15)
  );

  const notificationsSnapshot = await getDocs(q);
  const notificationsList: NotificationMessage[] =
    notificationsSnapshot.docs.map((doc) => doc.data() as NotificationMessage);
  return notificationsList;
}

export async function createNotification(notification: NotificationMessage) {
  return await setDoc(doc(notificationRef, notification.id), notification);
}

export async function getNotification(id: string) {
  const docRef = doc(notificationRef, id);
  const docSnap = await getDoc(docRef);
  return docSnap.data() as NotificationMessage;
}

export const updateNotificationInDatabase = async (
  notification: NotificationMessage
) => {
  const docRef = doc(db, FirebaseCollections.notifications, notification.id);
  return await updateDoc(docRef, notification);
};
