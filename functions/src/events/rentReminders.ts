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

    //Upcoming Rents
    if (rent.status === RentStatus["Upcoming - Rent is not due for payment."]) {
      //If deudate is less than a week.
      if (diffInWeeks < 1 && diffInDays > 1) {
        await fetchDataAndSendAWeekNotice(rent);
      }

      //If deudate is today.
      if (moment(rent.dueDate).isSame(Date.now(), "day")) {
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

    //Late Rents
    if (
      rent.status ===
      RentStatus["Late - Due date has passed and rent has not been paid."]
    ) {
      //Rent was due more than 5 days ago.
      if (diffInDays < -5 && !rent.sentFirstFailedRent) {
        await fetchDataAndSendALateRentNotice(rent);
      }
    }
  });
}
