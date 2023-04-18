import { FirebaseCollections, Property, Rent } from "../models";
import moment from "moment";
import formatPrice from "../utils/formatPrice";
import { generateSimpleEmail } from "../emails/generateSimpleEmail";
import { sendEmail } from "../emails/email";
import { db } from "./rentReminders";

/**
 * Sends a due date reminder
 *
 *@param { Rent } rent The upcoming rent.
 */
export async function fetchDataAndSendDueDateNotice(rent: Rent): Promise<void> {
  if (!rent.property) return;

  const propertyRef = db
    .collection(FirebaseCollections.properties)
    .doc(rent.property);
  const property = await propertyRef.get();
  if (property.exists) {
    const propertyData = property.data() as Property;

    const paragraphs = [
      `This is a friendly reminder that your rent for ${moment(
        rent.dueDate
      ).format("MMM YYYY")} is due today in the total amount of ${formatPrice(
        rent.rent
      )}.`,
      "I thank you in advance for timely payment. Please contact me with any question you may have.",
      "Make your payment by clicking the following button.",
      "Sincerely, Landlord.",
    ];

    const generatedEmail = generateSimpleEmail({
      paragraphs,
      buttons: [
        {
          link: `${process.env.REACT_APP_BASE_URL}dashboard/rentalRecords/${rent.rentalRecord}`,
          text: "Pay now",
        },
      ],
    });

    if (!rent.tenant) return;

    await sendEmail(
      rent.tenant,
      `Rent reminder for ${propertyData.title}`,
      paragraphs.join(" \n"),
      generatedEmail
    ).then(async () => {
      const rentRef = db.collection(FirebaseCollections.rents).doc(rent.id);
      const updatedRent: Rent = {
        ...rent,
        sentADayReminder: true,
      };
      await rentRef.update(updatedRent);
    });
  }
}
