import functions = require("firebase-functions");
import moment = require("moment");
import { FirebaseCollections, Reminder, ReminderType, Rent } from "../models";
import admin = require("firebase-admin");
export const db = admin.firestore();
/**
 * Triggers automatically when a rent record is created and creates corresponding reminders in Firebase functions.
 * @return {any}
 */
export function createRemindersForRent(): (
  snapshot: functions.firestore.QueryDocumentSnapshot,
  context: functions.EventContext
) => any {
  return async (snapshot) => {
    const rentData = snapshot.data() as Rent;
    const rentId = snapshot.id;

    // Calculate reminder dates
    const threeMonthsReminderDate = moment(rentData.dueDate)
      .subtract(3, "month")
      .toDate()
      .getTime();
    const oneMonthReminderDate = moment(rentData.dueDate)
      .subtract(1, "month")
      .toDate()
      .getTime();
    const oneWeekReminderDate = moment(rentData.dueDate)
      .subtract(1, "week")
      .toDate()
      .getTime();
    const threeDaysReminderDate = moment(rentData.dueDate)
      .subtract(3, "day")
      .toDate()
      .getTime();
    const oneDayReminderDate = moment(rentData.dueDate)
      .subtract(1, "day")
      .toDate()
      .getTime();

    // Create reminders
    const remindersRef = db.collection(FirebaseCollections.reminders);
    const remindersBatch = db.batch();

    const threeMonthsReminderId = `${rentId}-3m`;
    const oneMonthReminderId = `${rentId}-1m`;
    const oneWeekReminderId = `${rentId}-1w`;
    const threeDaysReminderId = `${rentId}-3d`;
    const oneDayReminderId = `${rentId}-1d`;
    const dDayReminderId = `${rentId}-dd`;

    const threeMonthsReminder: Reminder = {
      rentId,
      reminderDate: threeMonthsReminderDate,
      id: threeMonthsReminderId,
      rentalRecordId: rentData.rentalRecord,
      propertyId: rentData.property,
      sent: false,
      type: ReminderType["3Months"],
      companyId: rentData.company,
      dueDate: rentData.dueDate,
    };
    const oneMonthReminder: Reminder = {
      rentId,
      reminderDate: oneMonthReminderDate,
      id: oneMonthReminderId,
      rentalRecordId: rentData.rentalRecord,
      propertyId: rentData.property,
      sent: false,
      type: ReminderType["1Month"],
      companyId: rentData.company,
      dueDate: rentData.dueDate,
    };
    const oneWeekReminder: Reminder = {
      rentId,
      reminderDate: oneWeekReminderDate,
      id: oneWeekReminderId,
      rentalRecordId: rentData.rentalRecord,
      propertyId: rentData.property,
      sent: false,
      type: ReminderType["1Week"],
      companyId: rentData.company,
      dueDate: rentData.dueDate,
    };
    const threeDaysReminder: Reminder = {
      rentId,
      reminderDate: threeDaysReminderDate,
      id: threeDaysReminderId,
      rentalRecordId: rentData.rentalRecord,
      propertyId: rentData.property,
      sent: false,
      type: ReminderType["3Days"],
      companyId: rentData.company,
      dueDate: rentData.dueDate,
    };
    const oneDayReminder: Reminder = {
      rentId,
      reminderDate: oneDayReminderDate,
      id: oneDayReminderId,
      rentalRecordId: rentData.rentalRecord,
      propertyId: rentData.property,
      sent: false,
      type: ReminderType["1Day"],
      companyId: rentData.company,
      dueDate: rentData.dueDate,
    };

    const dDayReminder: Reminder = {
      rentId,
      reminderDate: rentData.dueDate,
      id: dDayReminderId,
      rentalRecordId: rentData.rentalRecord,
      propertyId: rentData.property,
      sent: false,
      type: ReminderType["dDay"],
      companyId: rentData.company,
      dueDate: rentData.dueDate,
    };
    // Create 3Months and 1Month reminders for yearly rents
    if (rentData.rentPer === "year") {
      remindersBatch.create(
        remindersRef.doc(threeMonthsReminderId),
        threeMonthsReminder
      );
      remindersBatch.create(
        remindersRef.doc(oneMonthReminderId),
        oneMonthReminder
      );
    }
    remindersBatch.create(remindersRef.doc(oneWeekReminderId), oneWeekReminder);
    remindersBatch.create(
      remindersRef.doc(threeDaysReminderId),
      threeDaysReminder
    );
    remindersBatch.create(remindersRef.doc(oneDayReminderId), oneDayReminder);
    remindersBatch.create(remindersRef.doc(dDayReminderId), dDayReminder);

    await remindersBatch.commit();
  };
}
