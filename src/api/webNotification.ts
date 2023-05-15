import { httpsCallable } from "firebase/functions";
import { NotificationOrder } from "../models";
import { functions } from "../firebase/config";

export const sendWebNotification = (data: NotificationOrder) => {
  // Initialize Firebase app and create a reference to the function
  const handleAddNotificationMessage = httpsCallable(
    functions,
    "addNotificationMessage"
  );

  handleAddNotificationMessage(data)
    .then((result) => {
      // Handle success
    })
    .catch((error) => {
      // Handle error
    });
};
