import { collection, doc, setDoc } from "firebase/firestore";
import { db, generateFirebaseId } from "../firebase/config";
import { FirebaseCollections } from "../models";

const mailRef = collection(db, "mail");

export const sendEmail = async (
  email: string,
  subject: string,
  text: string,
  html: string,
  attachments?: {
    filename?: string;
    path: string;
  }[]
) => {
  await setDoc(doc(mailRef, generateFirebaseId(FirebaseCollections.mail)), {
    to: email,
    message: { subject, text, html, attachments: attachments || [] },
  })
    .then((c) => {
      console.log("Queued email for delivery!");
    })
    .catch((error) => {
      return null;
    });
};
