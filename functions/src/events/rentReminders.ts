import admin = require("firebase-admin");
import { FirebaseCollections, Rent, RentStatus } from "../models";
import moment from "moment";
import { fetchDataAndSendAWeekNotice } from "./fetchDataAndSendAWeekNotice";
import { fetchDataAndSendDueDateNotice } from "./fetchDataAndSendDueDateNotice";
import { fetchDataAndSendALateRentNotice } from "./fetchDataAndSendALateRentNotice";

export const db = admin.firestore();

/**
 * Send reminders for upcoming and late rents.
 */
export async function sendRemindersForFents() {
  const querySnapshot = await db
    .collection("rents")
    .where("status", "in", [
      RentStatus["Upcoming - Rent is not due for payment."],
      RentStatus["Late - Due date has passed and rent has not been paid."],
    ])
    .get();

  querySnapshot.forEach(async (snapDoc) => {
    const rent = snapDoc.data() as Rent;
    var dueDate = moment(rent.dueDate);
    var today = moment();
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

      //If deudate has passed
      //Update rent to late
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
function dueDateIsLessThanAWeekAndNoReminderSent(
  diffInWeeks: number,
  diffInDays: number,
  rent: Rent
): boolean {
  return diffInWeeks < 1 && diffInDays > 1 && !rent.sentAWeekReminder;
}

function dueDateIsTodayAndNoReminderSent(rent: Rent): boolean {
  return (
    moment(rent.dueDate).isSame(Date.now(), "day") && !rent.sentADayReminder
  );
}

function rentDueMoreThan5DaysAgo(diffInDays: number, rent: Rent): boolean {
  return diffInDays < -5 && !rent.sentFirstFailedRent;
}

function isUpcomingrent(rent: Rent): boolean {
  return rent.status === RentStatus["Upcoming - Rent is not due for payment."];
}

function isLateRent(rent: Rent): boolean {
  return (
    rent.status ===
    RentStatus["Late - Due date has passed and rent has not been paid."]
  );
}
