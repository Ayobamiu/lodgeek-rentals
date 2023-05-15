import { NotificationMessage, RentalRecord } from "../../models";

export const sortRentalRecords = (rentalRecords: RentalRecord[]) => {
  return rentalRecords.sort((a, b) => {
    if (a.updatedDate && b.updatedDate) {
      return b.updatedDate - a.updatedDate;
    } else if (a.updatedDate) {
      return -1;
    } else if (b.updatedDate) {
      return 1;
    } else {
      return 0;
    }
  });
};
export function sortNotificationsByTimestamp(
  notifications: NotificationMessage[]
): NotificationMessage[] {
  return notifications.sort((a, b) => b.timestamp - a.timestamp);
}
