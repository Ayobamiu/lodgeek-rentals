import { applicationDefault } from "firebase-admin/app";
import functions = require("firebase-functions");
const admin = require("firebase-admin");

// var serviceAccount = require("./json/lodgeek-rentals-firebase-adminsdk-ui0g5-6d94baf6a4.json");
admin.initializeApp({
  credential: applicationDefault(),
  databaseURL: "https://lodgeek-rentals-default-rtdb.firebaseio.com",
});
import { sendRemindersForFents } from "./events/rentReminders";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
export const triggerSchedule = functions.pubsub
  .schedule("0 0 * * * *") //This will be run every day at 12:00 AM
  .onRun((context) => {
    sendRemindersForFents();
    return null;
  });
