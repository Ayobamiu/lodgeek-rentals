import { FirebaseCollections, Property, Rent } from "../models";
import moment from "moment";
import formatPrice from "../utils/formatPrice";
import { generateSimpleEmail } from "../emails/generateSimpleEmail";
import { sendEmail } from "../emails/email";
import { db } from "./rentReminders";

/**
 * Sends NOTICE OF FAILURE TO PAY RENT
 *
 *@param { Rent } rent The late rent.
 */

export async function fetchDataAndSendALateRentNotice(
  rent: Rent
): Promise<void> {
  if (!rent.property) return;
  const propertyRef = db
    .collection(FirebaseCollections.properties)
    .doc(rent.property);
  const property = await propertyRef.get();
  if (property.exists) {
    const propertyData = property.data() as Property;

    const paragraphs = [
      "Dear Tenant:",
      `This email is to remind you that your rent is due and payable on ${moment(
        rent.dueDate
      ).format("ll")}, and late
          if paid after ${moment(rent.dueDate).format(
            "MMM YYYY"
          )}. To date, we have not received your full ${
        rent.rentPer === "month" ? "monthly" : "yearly"
      } rent payment.`,
      `Please understand that failure to pay rent is the most frequent cause for tenants to lose their
        housing, and we are concerned about the balance due from you.`,
      `Presently, you have an amount due of ${formatPrice(
        rent.rent
      )}. Please pay this amount
        immediately. `,

      "Make your payment by clicking the following button.",
      "Please contact me with any question you may have.",
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
      `Notice of failure to pay rent for ${propertyData.title}`,
      paragraphs.join(" \n"),
      generatedEmail
    ).then(async () => {
      const rentRef = db.collection(FirebaseCollections.rents).doc(rent.id);
      const updatedRent: Rent = {
        ...rent,
        sentFirstFailedRent: true,
      };
      await rentRef.update(updatedRent);
    });
  }
}
