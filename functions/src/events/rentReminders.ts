import admin = require("firebase-admin");
import { FirebaseCollections, Reminder, Rent, RentStatus } from "../models";
import moment = require("moment");
import { sendLateRentReminder } from "./sendLateRentReminder";
import { sendRentReminder } from "./sendRentReminder";
import { sendEmail } from "../emails/email";

export const db = admin.firestore();

/**
 * Send reminders for upcoming and late rents.
 */
export async function sendRemindersForFents() {
  await sendEmail(
    "contact@lodgeek.com",
    `Sending reminders due for ${new Date().toDateString()}`,
    `Sending reminders due for ${new Date().toDateString()}`,
    `<p>Sending reminders due for ${new Date().toDateString()}</p>`
  );

  const remindersQuerySnapshot = await db
    .collection(FirebaseCollections.reminders)
    .where("sent", "==", false)
    .get();

  remindersQuerySnapshot.forEach(async (snapDoc) => {
    const reminder = snapDoc.data() as Reminder;
    const rentRef = db
      .collection(FirebaseCollections.rents)
      .doc(reminder.rentId);
    const rentDoc = await rentRef.get();

    if (rentDoc.exists) {
      const rent = rentDoc.data() as Rent;
      const today = moment();
      const dueDate = moment(rent.dueDate);
      const diffInDays = dueDate.diff(today, "days");

      if (isUpcomingrent(rent)) {
        if (reminderDateIsTodayAndNoReminderSent(reminder)) {
          await sendRentReminder(reminder);
        }
      }

      // If deudate has passed
      // Update rent to late
      if (diffInDays < 0) {
        const rentRef = db.collection(FirebaseCollections.rents).doc(rent.id);
        const lateRent: Rent = {
          ...rent,
          status:
            RentStatus[
              "Late - Due date has passed and rent has not been paid."
            ],
        };
        await rentRef.update(lateRent);
      }

      if (isLateRent(rent)) {
        if (rentDueMoreThan5DaysAgo(diffInDays, rent)) {
          await sendLateRentReminder(rent);
        }
      }
    }
  });
}

/**
 * Returns true if due date is today and no remainder has been sent
 * @param {Reminder} reminder Reminder amount
 * @return {boolean}
 */
function reminderDateIsTodayAndNoReminderSent(reminder: Reminder): boolean {
  return (
    moment(reminder.reminderDate).isSame(Date.now(), "day") && !reminder.sent
  );
}

/**
 * Returns true if due date is five days ago and late notice has not been sent
 * @param {number} diffInDays Difference in days
 * @param {Rent} rent Rent Amount
 * @return {boolean}
 */
function rentDueMoreThan5DaysAgo(diffInDays: number, rent: Rent): boolean {
  return diffInDays < -5 && !rent.sentFirstFailedRent;
}

/**
 * Returns true if it is upcoming
 * @param {Rent} rent Rent object
 * @return {boolean}
 */
function isUpcomingrent(rent: Rent): boolean {
  return rent.status === RentStatus["Upcoming - Rent is not due for payment."];
}

/**
 * Returns true true if rent is late
 * @param {Rent} rent Rent Object
 * @return {boolean}
 */
function isLateRent(rent: Rent): boolean {
  return (
    rent.status ===
    RentStatus["Late - Due date has passed and rent has not been paid."]
  );
}
