import { useCallback, useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  BankRecord,
  FirebaseCollections,
  MoneyTransaction,
  User,
} from "../models";
import {
  bankRecordRef,
  db,
  generateFirebaseId,
  transactionRef,
} from "../firebase/config";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  addBankRecord,
  selectBankRecords,
  setBankRecords,
} from "../app/features/bankRecordSlice";
import { selectUser, updateUser } from "../app/features/userSlice";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import formatPrice from "../utils/formatPrice";
import { setNotification } from "../app/features/notificationSlice";
import { sendEmail } from "../api/email";
import { useNavigate } from "react-router-dom";
type ProcessItProps = {
  data: {
    type: string;
    name: string;
    account_number: string;
    bank_code: string;
    currency: string;
  };
  amount: number;
  senderUserEmail: string;

  description: string;
  type: "fromUserAccountToAccountNumber" | "fromLodgeekToRemittanceAccount";
};

type ProcessWithdrawalProps = {
  accountName?: string;
  amount: number;
  bankCode?: string;
  accountNumber?: string;
  senderUserEmail?: string;
  remittanceAccount?: string;
  type: "fromUserAccountToAccountNumber" | "fromLodgeekToRemittanceAccount";
};

function useBanks() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const loggedInUser = useAppSelector(selectUser);
  const bankRecords = useAppSelector(selectBankRecords);
  const [processingWithdrawal, setProcessingWithdrawal] = useState(false);

  const getUsersBankRecords = useCallback(async () => {
    const bankRecordsCol = collection(db, FirebaseCollections.bankReord);
    const q = query(bankRecordsCol, where("user", "==", loggedInUser?.email));

    await getDocs(q)
      .then((bankRecordsSnapshot) => {
        const bankRecordDocs = bankRecordsSnapshot.docs.map((doc) =>
          doc.data()
        ) as BankRecord[];

        dispatch(setBankRecords(bankRecordDocs));
      })
      .catch((error) => {
        toast.error("Error Loading Bank Records.");
      })
      .finally(() => {});
  }, [loggedInUser?.email, dispatch]);

  useEffect(() => {
    if (!bankRecords.length) {
      getUsersBankRecords();
    }
  }, [loggedInUser?.email, bankRecords.length, getUsersBankRecords]);

  const addBank = async (data: BankRecord) => {
    await setDoc(doc(bankRecordRef, data.id), data)
      .then((c) => {
        toast.success("Succesfully Added Bank Record.");
        dispatch(addBankRecord(data));
        return data;
      })
      .catch((error) => {
        toast.error("Error Adding Bank Record");
        return null;
      });
  };

  async function processWithdrawal(props: ProcessWithdrawalProps) {
    const {
      accountName,
      amount,
      bankCode,
      accountNumber,
      senderUserEmail,
      remittanceAccount,
      type,
    } = props;

    if (type === "fromUserAccountToAccountNumber") {
      if (!bankCode) {
        return toast("Account not verified.", { type: "error" });
      }
      if (!accountNumber) {
        return toast("Account not verified.", { type: "error" });
      }
      if (!accountName) {
        return toast("Account not verified.", { type: "error" });
      }
      if (!amount) {
        return toast("Enter amount to withdraw.", { type: "error" });
      }
      const data = {
        type: "nuban",
        name: accountName,
        account_number: accountNumber,
        bank_code: bankCode,
        currency: "NGN",
      };

      setProcessingWithdrawal(true);
      processIt({
        description: `Withdrawal of ${formatPrice(amount)}`,
        amount,
        data,
        senderUserEmail: senderUserEmail || "",
        type,
      });
    }
    if (type === "fromLodgeekToRemittanceAccount" && remittanceAccount) {
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
        setProcessingWithdrawal(true);

        processIt({
          description: `Remittance of ${formatPrice(amount)} to account`,
          amount,
          data,
          senderUserEmail: senderUserEmail || "",
          type,
        });
      }
    }
  }

  async function processIt(props: ProcessItProps): Promise<void> {
    const { data, amount, senderUserEmail, description, type } = props;

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
                    if (senderUserEmail === loggedInUser?.email) {
                      dispatch(updateUser(updatedsenderUserData));
                    }
                  })
                  .finally(() => {});
              }
            }

            toast(res.data.message, { type: "success" });
            if (type === "fromUserAccountToAccountNumber") {
              navigate("/dashboard/bankRecords");
            }
          })
          .catch((error) => {
            if (type === "fromUserAccountToAccountNumber") {
              dispatch(
                setNotification({
                  type: "default",
                  title:
                    "Unable to process transfer right now! The issue is from us.",
                  description:
                    "Contact Admin for swift response Or reach out on contact@lodgeek.com",
                  buttons: [
                    {
                      text: "Contact Admin on WhatsApp",
                      onClick: () => {},
                      type: "link",
                      link: "https://wa.me/message/NDRVMWGUHUGVI1",
                    },
                    {
                      text: "Send Email",
                      type: "link",
                      link: "mailto:contact@lodgeek.com",
                    },
                  ],
                })
              );
            }
            if (type === "fromLodgeekToRemittanceAccount") {
              //Send error message to Admin.
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
          });
      })
      .catch((error) => {
        toast("Could not process withdrawal.", { type: "error" });
      })
      .finally(() => {
        setProcessingWithdrawal(false);
      });
  }

  return { addBank, processWithdrawal, processingWithdrawal };
}
export default useBanks;
