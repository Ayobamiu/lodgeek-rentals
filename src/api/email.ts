import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const mailRef = collection(db, "mail");

export const sendEmail = async (
  email: string,
  subject: string,
  text: string,
  html: string
) => {
  await setDoc(doc(mailRef, (Math.random() * 10000).toString()), {
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
