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
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { sendEmail } from "../api/email";
import { selectProperties } from "../app/features/propertySlice";
import {
  addRentalRecord,
  addRentalRecords,
  selectRentalRecords,
  updateCurrentRentalRecord,
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
  userKYCRef,
} from "../firebase/config";
import {
  FirebaseCollections,
  Rent,
  RentalRecord,
  TenantInviteProps,
  UserKYC,
} from "../models";
import { generateSimpleEmail } from "../utils/generateSimpleEmail";
import base64 from "base-64";
import { selectSelectedCompany } from "../app/features/companySlice";
import { getRentReviewsForRentalRecord } from "../firebase/apis/rentReview";
import { setRentReviews } from "../app/features/rentReviewSlice";
import { message } from "antd";

const useRentalRecords = () => {
  const [addingRentalRecord, setAddingRentalRecord] = useState(false);
  const dispatch = useAppDispatch();
  const rentalRecords = useAppSelector(selectRentalRecords);
  const loggedInUser = useAppSelector(selectUser);
  const properties = useAppSelector(selectProperties);
  const selectedCompany = useAppSelector(selectSelectedCompany);

  async function getAllRecords() {
    const rentalRecordsCol = collection(db, RENTAL_RECORD_PATH);

    const iAmATenant = getDocs(
      query(rentalRecordsCol, where("tenant", "==", loggedInUser?.email))
    );
    const isSelectedCompany = getDocs(
      query(rentalRecordsCol, where("company", "==", selectedCompany?.id))
    );
    const iAmATeamMember = getDocs(
      query(
        rentalRecordsCol,
        where("team", "array-contains", loggedInUser?.email)
      )
    );

    const [
      recordsWhereIamATenantQuerySnapshot,
      recordsForSelectedCompanySnapshot,
      recordsWhereIAmATeamMemberSnapshot,
    ] = await Promise.all([iAmATenant, isSelectedCompany, iAmATeamMember]);
    const recordsWhereIamATenant = recordsWhereIamATenantQuerySnapshot.docs;
    const recordsForSelectedCompany = recordsForSelectedCompanySnapshot.docs;
    const recordsWhereIAmATeamMember = recordsWhereIAmATeamMemberSnapshot.docs;

    const allRecords = recordsWhereIamATenant.concat(
      recordsForSelectedCompany,
      recordsWhereIAmATeamMember
    );

    return allRecords;
  }

  const getUsersRentalRecords = useCallback(async () => {
    getAllRecords()
      .then((result) => {
        const rentalRecordsList = result.map((i) => i.data()) as RentalRecord[];
        dispatch(addRentalRecords(rentalRecordsList));
      })
      .catch(() => {
        toast.error("Error Loading Rental Records");
      })
      .finally(() => {});
  }, [loggedInUser?.email, dispatch, selectedCompany?.id]);

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
    if (loggedInUser?.email && selectedCompany?.id) {
      getUsersRentalRecords();
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
    if (!selectedCompany?.id) {
      return toast.error("Error getting account details.");
    }

    const property = properties.find((i) => i.id === data.property);

    setAddingRentalRecord(true);
    const rentalRecordId = generateFirebaseId(RENTAL_RECORD_PATH);
    const rentalRecordData: RentalRecord = {
      ...data,
      id: rentalRecordId,
      owner: loggedInUser?.email,
      status: "inviteSent",
      company: selectedCompany.id,
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

  async function handleUpdateRentalRecord(data: RentalRecord) {
    if (!loggedInUser?.email) {
      return toast.error("Error getting user details.");
    }
    if (!data.id) {
      return toast.error("Error getting data.");
    }

    const updatedData: RentalRecord = { ...data, updatedDate: Date.now() };
    await updateDoc(doc(rentalRecordRef, data.id), updatedData)
      .then(() => {
        dispatch(updateRentalRecord(updatedData));
        dispatch(updateCurrentRentalRecord(updatedData));
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
        return message.error(
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
      return message.error(
        "Can't resolve logged in user. Reload and try again."
      );
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

  async function loadRentalReviews(rentalRecord: string) {
    const data = await getRentReviewsForRentalRecord(rentalRecord);
    dispatch(setRentReviews(data));
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

    saveUserKYC,
    loadUserKYC,
    sendEmailInvitationToTenant,
    loadRentalReviews,
  };
};
export default useRentalRecords;
