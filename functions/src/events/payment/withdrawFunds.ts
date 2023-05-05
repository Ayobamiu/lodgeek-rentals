import admin = require("firebase-admin");
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { BankRecord, FirebaseCollections, Payout } from "../../models";
import formatPrice from "../../utils/formatPrice";

export const db = admin.firestore();
/**
 * Pay amount on the payout doc to the remittance account.
 * @param {Payout} payout Payout to be remitted
 */
export async function withdrawPayOutToRemittanceAccount(payout: Payout) {
  const payoutRef = db.collection(FirebaseCollections.payout).doc(payout.id);

  const bankRecordRef = db
    .collection(FirebaseCollections.bankReord)
    .doc(payout.remittanceAccoundId);
  const bankRecordDocSnap = await bankRecordRef.get();

  if (bankRecordDocSnap.exists) {
    const bankRecordOwnerDoc = bankRecordDocSnap.data() as BankRecord;
    const data = {
      type: "nuban",
      name: bankRecordOwnerDoc.accountName,
      account_number: bankRecordOwnerDoc.accountNumber,
      bank_code: bankRecordOwnerDoc.bank.code,
      currency: "NGN",
    };

    await axios
      .post("https://api.paystack.co/transferrecipient", data, {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_SECRET_KEY}`,
        },
      })
      .then(async (res) => {
        const transactionReference = uuidv4();
        const recipient = res.data.data.recipient_code;
        const transferData = {
          source: "balance",
          reason: `Payout of ${formatPrice(payout.amount)}`,
          amount: payout.amount * 100,
          reference: transactionReference,
          recipient,
        };

        await axios
          .post("https://api.paystack.co/transfer", transferData, {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_SECRET_KEY}`,
            },
          })
          .then(onSuccess)
          .catch(onError);
      })
      .catch(onError);
  }
  /**
   * Triggers on Error
   */
  async function onError() {
    const updatedRent: Payout = {
      ...payout,
      status: "failed",
    };
    await payoutRef.update(updatedRent);
  }
  /**
   * Triggers on Success
   */
  async function onSuccess() {
    const updatedRent: Payout = {
      ...payout,
      status: "success",
    };
    await payoutRef.update(updatedRent);
  }
}
