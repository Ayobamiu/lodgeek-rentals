import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { db, generateFirebaseId, transactionRef } from "../firebase/config";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import {
  BankRecord,
  FirebaseCollections,
  MoneyTransaction,
  User,
} from "../models";
import { sendEmail } from "../api/email";
import formatPrice from "../utils/formatPrice";
type ProcessItProps = {
  amount: number;
  senderUserEmail: string;
  description: string;
  remittanceAccount: string;
};

export async function withdrawFundToRemittanceAccount(props: ProcessItProps) {
  const { amount, senderUserEmail, description, remittanceAccount } = props;

  const bankRecordRef = doc(
    db,
    FirebaseCollections.bankReord,
    remittanceAccount
  );

  const bankRecordDocSnap = await getDoc(bankRecordRef);

  if (bankRecordDocSnap.exists()) {
    const bankRecordOwnerDoc = bankRecordDocSnap.data() as BankRecord;

    const data = {
      type: "nuban",
      name: bankRecordOwnerDoc.accountName,
      account_number: bankRecordOwnerDoc.accountNumber,
      bank_code: bankRecordOwnerDoc.bank.code,
      currency: "NGN",
    };
    const transactionReference = uuidv4();
    await axios
      .post(`https://api.paystack.co/transferrecipient`, data, {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_SECRET_KEY}`,
        },
      })
      .then(async (res) => {
        const recipient_code = res.data.data.recipient_code;
        const transferData = {
          source: "balance",
          reason: description,
          amount: amount * 100,
          reference: transactionReference,
          recipient: recipient_code,
        };

        await axios
          .post(`https://api.paystack.co/transfer`, transferData, {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_SECRET_KEY}`,
            },
          })
          .then(async () => {
            /* Remove from sender's account balance */
            if (senderUserEmail) {
              const senderRef = doc(
                db,
                FirebaseCollections.users,
                senderUserEmail
              );
              const senderDocSnap = await getDoc(senderRef);
              if (senderDocSnap.exists()) {
                const senderOwnerDoc = senderDocSnap.data() as User;
                const updatedsenderUserData: User = {
                  ...senderOwnerDoc,
                  balance: (senderOwnerDoc.balance || 0) - amount,
                };
                await updateDoc(senderRef, updatedsenderUserData)
                  .then(async (c) => {
                    /* Add transaction record */
                    const transactionForLandlordId = generateFirebaseId(
                      FirebaseCollections.transaction
                    );

                    const transactionData: MoneyTransaction = {
                      id: transactionForLandlordId,
                      payer: senderOwnerDoc.email,
                      amount: amount,
                      createdAt: Date.now(),
                      updatedAt: Date.now(),
                      currency: "NGN",
                      description,
                      payee: senderOwnerDoc.email,
                      serviceFee: 0,
                      status: "success",
                      type: "minus",
                      receiptNumber: uuidv4(),
                    };

                    await setDoc(
                      doc(transactionRef, transactionForLandlordId),
                      transactionData
                    );

                    /* Add transaction record */
                  })
                  .finally(() => {});
              }
            }
          })
          .catch(onError);
      })
      .catch(onError);
  }

  function onError() {
    sendEmail(
      "contact@lodgeek.com",
      `Dispense Error - User: ${senderUserEmail}`,
      `${formatPrice(
        amount
      )} was processed unsuccesfully. \n User: ${senderUserEmail}`,
      `<p>
                  ${formatPrice(
                    amount
                  )} was processed unsuccesfully. \n User: ${senderUserEmail} 
                </p>`
    );
  }
}
