import admin = require("firebase-admin");
import { FirebaseCollections, Rent, RentStatus } from "../models";
import moment from "moment";
import { fetchDataAndSendAWeekNotice } from "./fetchDataAndSendAWeekNotice";
import { fetchDataAndSendDueDateNotice } from "./fetchDataAndSendDueDateNotice";
import { fetchDataAndSendALateRentNotice } from "./fetchDataAndSendALateRentNotice";
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

  const querySnapshot = await db
    .collection("rents")
    .where("status", "in", [
      RentStatus["Upcoming - Rent is not due for payment."],
      RentStatus["Late - Due date has passed and rent has not been paid."],
    ])
    .get();

  querySnapshot.forEach(async (snapDoc) => {
    const rent = snapDoc.data() as Rent;
    const dueDate = moment(rent.dueDate);
    const today = moment();
    const diffInWeeks = dueDate.diff(today, "weeks");
    const diffInDays = dueDate.diff(today, "days");

    if (isUpcomingrent(rent)) {
      if (
        dueDateIsLessThanAWeekAndNoReminderSent(diffInWeeks, diffInDays, rent)
      ) {
        await fetchDataAndSendAWeekNotice(rent);
      }

      if (dueDateIsTodayAndNoReminderSent(rent)) {
        await fetchDataAndSendDueDateNotice(rent);
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
    }

    if (isLateRent(rent)) {
      if (rentDueMoreThan5DaysAgo(diffInDays, rent)) {
        await fetchDataAndSendALateRentNotice(rent);
      }
    }
  });
}

/**
 * Returns true if due date is less than a week and no remainder has been sent
 * @param {number} diffInWeeks Difference in week
 * @param {number} diffInDays Difference in days
 * @param {Rent} rent Rent Amount
 * @return {boolean}
 */
function dueDateIsLessThanAWeekAndNoReminderSent(
  diffInWeeks: number,
  diffInDays: number,
  rent: Rent
): boolean {
  return diffInWeeks < 1 && diffInDays > 1 && !rent.sentAWeekReminder;
}

/**
 * Returns true if due date is today and no remainder has been sent
 * @param {Rent} rent Rent amount
 * @return {boolean}
 */
function dueDateIsTodayAndNoReminderSent(rent: Rent): boolean {
  return (
    moment(rent.dueDate).isSame(Date.now(), "day") && !rent.sentADayReminder
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
