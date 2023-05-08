import functions = require("firebase-functions");
const admin = require("firebase-admin");

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMESNT_ID,
};

admin.initializeApp(firebaseConfig);
import { sendRemindersForFents } from "./events/rentReminders";
import { createRemindersForRent } from "./events/createRemindersForRent";
import { processPayouts } from "./events/payment/processPayouts";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
export const triggerSchedule = functions.pubsub
  .schedule("0 0 * * *") // This will be run every day at 12:00 AM
  .onRun(() => {
    sendRemindersForFents();
    return null;
  });

/**
 * This Cloud Function to run every three hours starting from the top of the hour.
 * For example, if we deploy this function at 2:15 PM, it will run at 3:00 PM, 6:00 PM, 9:00 PM, and so on.
 */
export const triggerPayouts = functions.pubsub
  .schedule("0 */3 * * *")
  .onRun(() => {
    processPayouts();
    return null;
  });

exports.createReminders = functions.firestore
  .document("rents/{rentId}")
  .onCreate(createRemindersForRent());
