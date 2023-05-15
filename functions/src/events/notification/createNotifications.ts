import admin = require("firebase-admin");
import {
  FirebaseCollections,
  NotificationMessage,
  NotificationOrder,
} from "../../models";

const db = admin.firestore();
/**
 * Creates notifications for all recipients in the notification order.
 * @param {NotificationOrder} notificationOrder
 */
export const createNotifications = async (
  notificationOrder: NotificationOrder
) => {
  const batch = db.batch();
  notificationOrder.recipientIDs.forEach((recipientId) => {
    const id = db.collection(FirebaseCollections.notifications).doc().id;
    const notification: NotificationMessage = {
      id,
      type: "push",
      title: notificationOrder.title,
      description: notificationOrder.description,
      icon: notificationOrder.icon || "",
      image: notificationOrder.image || "",
      link: notificationOrder.link || "",
      sound: notificationOrder.sound || "",
      recipientId,
      status: "sent",
      timestamp: Date.now(),
    };

    batch.create(
      db.collection(FirebaseCollections.notifications).doc(id),
      notification
    );
  });

  await batch.commit();

  return { message: "Notifications created successfully" };
};
