import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch,
  updateDoc,
} from "firebase/firestore";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { sendEmail } from "../api/email";
import { selectProperties } from "../app/features/propertySlice";
import {
  addRentalRecord,
  addRentalRecords,
  selectRentalRecords,
  updateRentalRecord,
  updateUserKYC,
} from "../app/features/rentalRecordSlice";
import { selectUser } from "../app/features/userSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  db,
  generateFirebaseId,
  rentalRecordRef,
  RENTAL_RECORD_PATH,
  RENT_PATH,
  transactionRef,
  userKYCRef,
} from "../firebase/config";
import {
  FirebaseCollections,
  MoneyTransaction,
  Rent,
  RentalRecord,
  RentStatus,
  TenantInviteProps,
  UpdatePaidRentsProps,
  User,
  UserKYC,
} from "../models";
import formatPrice from "../utils/formatPrice";
import { generateSimpleEmail } from "../utils/generateSimpleEmail";
import base64 from "base-64";
import { getTransactionDescriptionAndAmount } from "./getTransactionDescriptionAndAmount";
import useBanks from "./useBanks";
import { v4 as uuidv4 } from "uuid";
import { selectSelectedCompany } from "../app/features/companySlice";

const useRentalRecords = () => {
  const [addingRentalRecord, setAddingRentalRecord] = useState(false);
  const dispatch = useAppDispatch();
  const rentalRecords = useAppSelector(selectRentalRecords);
  const loggedInUser = useAppSelector(selectUser);
  const properties = useAppSelector(selectProperties);
  const selectedCompany = useAppSelector(selectSelectedCompany);

  const { processWithdrawal } = useBanks();
  const getUsersRentalRecords = useCallback(async () => {
    const rentalRecordsCol = collection(db, RENTAL_RECORD_PATH);
    const q = query(
      rentalRecordsCol,
      where("tenant", "==", loggedInUser?.email)
    );

    await getDocs(q)
      .then((rentalRecordsSnapshot) => {
        const rentalRecordsList = rentalRecordsSnapshot.docs.map((doc) =>
          doc.data()
        ) as RentalRecord[];

        dispatch(addRentalRecords(rentalRecordsList));
      })
      .catch(() => {
        toast.error("Error Loading Rental Records");
      })
      .finally(() => {});
  }, [loggedInUser?.email, dispatch]);

  const getRentalRecordsForYourTenants = useCallback(async () => {
    const rentalRecordsCol = collection(db, RENTAL_RECORD_PATH);
    const q = query(
      rentalRecordsCol,
      where("company", "==", selectedCompany?.id)
    );

    await getDocs(q)
      .then((rentalRecordsSnapshot) => {
        const rentalRecordsList = rentalRecordsSnapshot.docs.map((doc) =>
          doc.data()
        ) as RentalRecord[];

        dispatch(addRentalRecords(rentalRecordsList));
      })
      .catch(() => {
        toast.error("Error Loading Rental Records");
      })
      .finally(() => {});
  }, [selectedCompany?.id, dispatch]);

  useEffect(() => {
    if (!rentalRecords.length) {
      getUsersRentalRecords();
      getRentalRecordsForYourTenants();
    }
  }, [
    loggedInUser?.email,
    rentalRecords.length,
    getUsersRentalRecords,
    getRentalRecordsForYourTenants,
    selectedCompany,
  ]);

  async function handleAddRentalRecord(data: RentalRecord, rents: Rent[]) {
    if (!loggedInUser?.email) {
      return toast.error("Error getting user details.");
    }

    const property = properties.find((i) => i.id === data.property);

    setAddingRentalRecord(true);
    const rentalRecordId = generateFirebaseId(RENTAL_RECORD_PATH);
    const rentalRecordData: RentalRecord = {
      ...data,
      id: rentalRecordId,
      owner: loggedInUser?.email,
      status: "inviteSent",
    };
    await setDoc(doc(rentalRecordRef, rentalRecordId), rentalRecordData)
      .then(() => {
        const rentBatch = writeBatch(db);
        rents.forEach((rentdoc) => {
          var docRef = doc(collection(db, RENT_PATH)); //automatically generate unique id
          const rentData: Rent = {
            ...rentdoc,
            id: docRef.id,
            rentalRecord: rentalRecordId,
            owner: loggedInUser?.email,
            rent: rentalRecordData.rent,
            rentPer: rentalRecordData.rentPer,
            property: rentalRecordData.property,
            tenant: data.tenant,
          };
          rentBatch.set(docRef, rentData);
        });

        rentBatch.commit().then(async () => {
          await sendEmailInvitationToTenant({
            rentalRecordData,
            property,
            loggedInUser,
          });
          dispatch(addRentalRecord(rentalRecordData));
        });
      })
      .catch(() => {
        toast.error("Error Adding Rental Record");
        return null;
      })
      .finally(() => {
        setAddingRentalRecord(false);
      });
  }

  async function updatePaidRents(props: UpdatePaidRentsProps) {
    const {
      owner,
      propertyTitle,
      rentalRecordId,
      rents,
      tenantName,
      tenantEmail,
      selectedAdditionalFees,
      rentalRecord,
    } = props;

    if (!loggedInUser?.email) {
      return toast.error("Error getting user details.");
    }

    if (!rents.length && !selectedAdditionalFees.length) {
      return toast.error("Error getting rents or fees details.");
    }

    const rentBatch = writeBatch(db);
    if (selectedAdditionalFees.length > 0) {
      const fees = rentalRecord.fees.map((i) => {
        if (selectedAdditionalFees.findIndex((x) => x.id === i.id) > -1) {
          return { ...i, paid: true, paidOn: Date.now() };
        } else {
          return i;
        }
      });
      const updatedRentalRecord: RentalRecord = { ...rentalRecord, fees };
      const thisRentalRecordRef = doc(
        db,
        FirebaseCollections.rentalRecords,
        updatedRentalRecord.id
      );
      await updateDoc(thisRentalRecordRef, updatedRentalRecord).catch(() => {});
    }

    rents.forEach((rentdoc) => {
      var docRef = doc(collection(db, RENT_PATH), rentdoc.id);
      const rentData: Rent = {
        ...rentdoc,
        status: RentStatus["Paid - Rent has been paid."],
        paidOn: Date.now(),
      };
      rentBatch.update(docRef, rentData);
    });

    rentBatch
      .commit()
      .then(async () => {
        const redirectURL = `/dashboard/rentalRecords/${rentalRecordId}`;
        const encodedRedirectUrl = base64.encode(redirectURL);
        const rentalRecordLink = `${process.env.REACT_APP_BASE_URL}dashboard/rentalRecords/${rentalRecordId}?redirect=${encodedRedirectUrl}&email=${owner}`;

        var { transactionDescription, totalAmount } =
          getTransactionDescriptionAndAmount(
            rents,
            selectedAdditionalFees,
            tenantName,
            propertyTitle
          );

        //Add transaction for tenant and landlord

        const transactionForLandlordId = generateFirebaseId(
          FirebaseCollections.transaction
        );
        const transactionForTenantId = generateFirebaseId(
          FirebaseCollections.transaction
        );

        const transactionData: MoneyTransaction = {
          id: transactionForLandlordId,
          payer: loggedInUser?.email,
          amount: totalAmount,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          currency: "NGN",
          description: transactionDescription,
          payee: owner,
          serviceFee: 0,
          status: "success",
          type: "plus",
          receiptNumber: uuidv4(),
        };

        await setDoc(
          doc(transactionRef, transactionForLandlordId),
          transactionData
        );

        await setDoc(doc(transactionRef, transactionForTenantId), {
          ...transactionData,
          type: "minus",
          id: transactionForTenantId,
        });
        //Add transaction for tenant and landlord

        const ownerRef = doc(db, FirebaseCollections.users, owner);
        const docSnap = await getDoc(ownerRef);
        if (docSnap.exists()) {
          const ownerDoc = docSnap.data() as User;
          const updatedUser: User = {
            ...ownerDoc,
            balance: (ownerDoc.balance || 0) + totalAmount,
          };
          await updateDoc(ownerRef, updatedUser).finally(() => {});

          /* Process Direct Remittance */
          //If there is a remitance specified for this rental record, send it there here, else send to the owner's default.
          if (rentalRecord.remittanceAccount) {
            await processWithdrawal({
              amount: totalAmount,
              type: "fromLodgeekToRemittanceAccount",
              remittanceAccount: rentalRecord.remittanceAccount,
              senderUserEmail: ownerDoc.email,
            });
          } else {
            if (ownerDoc.directRemitance) {
              await processWithdrawal({
                amount: totalAmount,
                type: "fromLodgeekToRemittanceAccount",
                remittanceAccount: ownerDoc.remittanceAccount,
                senderUserEmail: ownerDoc.email,
              });
            }
          }
          /* Process Direct Remittance */
        }

        const paragraphsForLandlord = [
          "The payment details are as follows:",
          `Tenant: ${tenantName}`,
          `Property: ${propertyTitle}`,
          ...rents.map(
            (rent) =>
              `Rent for ${moment(rent.dueDate).format(
                rent.rentPer === "month" ? "MMM YYYY" : "YYYY"
              )} - ${formatPrice(rent.rent)}`
          ),
          ...selectedAdditionalFees.map(
            (fee) => `${fee.feeTitle} - ${formatPrice(fee.feeAmount)}`
          ),
          `Total - ${formatPrice(totalAmount)}`,
          "Click on the link below to view rent details.",
        ];

        const paragraphsForTenant = [
          "The payment details are as follows:",
          `Property: ${propertyTitle}`,
          ...rents.map(
            (rent) =>
              `Rent for ${moment(rent.dueDate).format(
                "MMM YYYY"
              )} - ${formatPrice(rent.rent)}`
          ),
          ...selectedAdditionalFees.map(
            (fee) => `${fee.feeTitle} - ${formatPrice(fee.feeAmount)}`
          ),
          `Total - ${formatPrice(totalAmount)}`,
        ];

        const emailSubjectForTenant = "Your rent payment has been confirmed.";

        const generatedEmailForLandlord = generateSimpleEmail({
          paragraphs: paragraphsForLandlord,
          buttons: [
            {
              link: rentalRecordLink,
              text: "View details",
            },
          ],
          title: transactionDescription,
        });

        const generatedEmailForTenant = generateSimpleEmail({
          paragraphs: paragraphsForTenant,
          title: emailSubjectForTenant,
        });

        if (tenantEmail) {
          await sendEmail(
            tenantEmail,
            emailSubjectForTenant,
            paragraphsForTenant.join(" \n"),
            generatedEmailForTenant
          );
        }

        if (owner) {
          await sendEmail(
            owner,
            transactionDescription,
            paragraphsForLandlord.join(" \n"),
            generatedEmailForLandlord
          ).then(() => {
            toast.success("Payment was successfully obtained.");
          });
        }
      })
      .catch(() => {
        toast.error("Error Updating Rents.");
      });
  }

  async function handleUpdateRentalRecord(data: RentalRecord) {
    if (!loggedInUser?.email) {
      return toast.error("Error getting user details.");
    }
    if (!data.id) {
      return toast.error("Error getting data.");
    }

    await updateDoc(doc(rentalRecordRef, data.id), data)
      .then(() => {
        dispatch(updateRentalRecord(data));
      })
      .finally(() => {});
  }

  async function getRentalRecordData(
    id: string
  ): Promise<RentalRecord | undefined> {
    let rentalRecord = rentalRecords.find((i) => i.id === id);
    if (!rentalRecord) {
      const docRef = doc(db, RENTAL_RECORD_PATH, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        rentalRecord = docSnap.data() as RentalRecord;
        dispatch(addRentalRecord(rentalRecord));
      }
    }

    return rentalRecord;
  }

  async function saveUserKYC(userKYC: UserKYC) {
    if (userKYC.id) {
      const existingKYCRef = doc(db, FirebaseCollections.userKYC, userKYC.id);
      await updateDoc(existingKYCRef, userKYC).then(() => {
        dispatch(updateUserKYC(userKYC));
      });
    } else {
      if (!loggedInUser?.email) {
        return toast.error(
          "Can't resolve logged in user. Reload and try again."
        );
      }
      const newUserKYCData: UserKYC = {
        ...userKYC,
        id: loggedInUser?.email,
        user: loggedInUser?.email,
      };
      await setDoc(doc(userKYCRef, loggedInUser?.email), newUserKYCData).then(
        () => {
          dispatch(updateUserKYC(newUserKYCData));
          toast.success("Saved your data for future use.");
        }
      );
    }
  }

  async function loadUserKYC() {
    if (!loggedInUser?.email) {
      return toast.error("Can't resolve logged in user. Reload and try again.");
    }
    const userKYCRef = doc(
      db,
      FirebaseCollections.userKYC,
      loggedInUser?.email
    );
    const docSnap = await getDoc(userKYCRef);
    if (docSnap.exists()) {
      const userKYCDoc = docSnap.data() as UserKYC;
      dispatch(updateUserKYC(userKYCDoc));
    }
  }

  async function sendEmailInvitationToTenant(props: TenantInviteProps) {
    const { rentalRecordData, property, loggedInUser } = props;
    const redirectURL = `/dashboard/rentalRecords/${rentalRecordData.id}`;
    const encodedRedirectUrl = base64.encode(redirectURL);
    const rentalRecordLink = `${process.env.REACT_APP_BASE_URL}/dashboard/rentalRecords/${rentalRecordData.id}?redirect=${encodedRedirectUrl}&email=${rentalRecordData.tenant}`;
    const email = generateSimpleEmail({
      paragraphs: [
        `Click on the link below to manage your rent at ${property?.title}.`,
      ],
      buttons: [{ text: "Manage rent", link: rentalRecordLink }],
    });
    await sendEmail(
      rentalRecordData.tenant,
      `${loggedInUser.firstName} ${loggedInUser.lastName} is inviting you to manage rent for ${property?.title}`,
      `Click on the link below to manage your rent at ${property?.title}.\n ${rentalRecordLink}`,
      email
    );
    toast.success(`Invite sent to ${rentalRecordData.tenant}`);
  }
  const rentalRecordStatuses = {
    created: "🔵 Created",
    inviteSent: "⌛️ Invite Sent - Pending Approval",
    inviteAccepted: "🟢 In Progress",
    cancelled: "🔴 Cancelled",
    inviteRejected: "🔴 Invite Rejected",
  };
  return {
    handleAddRentalRecord,
    addingRentalRecord,
    rentalRecordStatuses,
    getRentalRecordData,
    handleUpdateRentalRecord,
    updatePaidRents,
    saveUserKYC,
    loadUserKYC,
    sendEmailInvitationToTenant,
  };
};
export default useRentalRecords;
