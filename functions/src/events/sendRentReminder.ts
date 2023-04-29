import { FirebaseCollections, Property, Reminder, Rent, User } from "../models";
import moment from "moment";
import { generateSimpleEmail } from "../emails/generateSimpleEmail";
import formatPrice from "../utils/formatPrice";
import { sendEmail } from "../emails/email";
import { db } from "./rentReminders";
import { sendSMS } from "../mobile/phone";

/**
 * Sends rent reminder
 * @param { Reminder } reminder The upcoming reminder.
 */
export async function sendRentReminder(reminder: Reminder): Promise<void> {
  const propertyRef = db
    .collection(FirebaseCollections.properties)
    .doc(reminder.propertyId);
  const property = await propertyRef.get();

  const rentRef = db.collection(FirebaseCollections.rents).doc(reminder.rentId);
  const rent = await rentRef.get();

  if (property.exists && rent.exists) {
    const propertyData = property.data() as Property;
    const rentData = rent.data() as Rent;
    const paymentLink = `${process.env.REACT_APP_BASE_URL}pay-for-rent/${rentData.id}`;

    const paragraphs = [
      `This is a friendly reminder that your rent for ${moment(
        rentData.dueDate
      ).format("MMM YYYY")} is due on or before ${moment(
        rentData.dueDate
      ).format("ll")} in the total amount of ${formatPrice(rentData.rent)}.
          `,
      "I thank you in advance for timely payment. Please contact me with any question you may have.",
      "Make your payment by clicking the following button.",
      "Sincerely, Landlord.",
    ];

    const generatedEmail = generateSimpleEmail({
      paragraphs,
      buttons: [
        {
          link: paymentLink,
          text: "Pay now",
        },
      ],
    });

    if (!rentData.tenant) return;

    await sendEmail(
      rentData.tenant,
      `Rent reminder for ${propertyData.title}`,
      paragraphs.join(" \n"),
      generatedEmail
    ).then(async () => {
      const reminderRef = db
        .collection(FirebaseCollections.reminders)
        .doc(reminder.id);
      const updatedReminder: Reminder = {
        ...reminder,
        sent: true,
      };
      await reminderRef.update(updatedReminder);
    });

    const tenantRef = db
      .collection(FirebaseCollections.users)
      .doc(rentData.tenant);
    const tenant = await tenantRef.get();
    const tenantData = tenant.data() as User;

    if (tenantData.phone) {
      await sendSMS(
        tenantData.phone,
        `Hi ${
          tenantData.firstName
        }, this is a reminder that your rent for ${moment(
          rentData.dueDate
        ).format("MMM YYYY")} at ${propertyData.title} is due on ${moment(
          rentData.dueDate
        ).format("MMM YYYY")}. 
         The rent amount is ${formatPrice(
           rentData.rent
         )}. Please ensure the rent is paid on time with the payment link.
         Payment link: ${paymentLink} 
         Contact Lodgeek for any questions or concerns.
      `
      );
    }
  }
}
