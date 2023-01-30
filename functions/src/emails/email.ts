import admin = require("firebase-admin");
import { FirebaseCollections } from "../models";

const db = admin.firestore();

const mailRef = db.collection(FirebaseCollections.mail);

export const sendEmail = async (
  email: string,
  subject: string,
  text: string,
  html: string
) => {
  // await setDoc(doc(mailRef, (Math.random() * 10000).toString()), {
  //   to: email,
  //   message: { subject, text, html },
  // })

  await mailRef
    .doc((Math.random() * 10000).toString())
    .set({
      to: email,
      message: { subject, text, html },
    })
    .then((c) => {
      console.log("Queued email for delivery!");
    })
    .catch((error) => {
      return null;
    });
};
