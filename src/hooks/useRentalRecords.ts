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
  updateRentalRecord,
} from "../app/features/rentalRecordSlice";
import { selectUser } from "../app/features/userSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  db,
  generateFirebaseId,
  RENTAL_RECORD_PATH,
  RENT_PATH,
} from "../firebase/config";
import { Rent, RentalRecord } from "../models";

const useRentalRecords = () => {
  const rentalRecordRef = collection(db, RENTAL_RECORD_PATH);
  const [addingRentalRecord, setAddingRentalRecord] = useState(false);

  const dispatch = useAppDispatch();
  const rentalRecords = useAppSelector(selectRentalRecords);
  const loggedInUser = useAppSelector(selectUser);
  const properties = useAppSelector(selectProperties);

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
      .catch((error) => {
        toast.error("Error Loading Rental Records");
      })
      .finally(() => {});
  }, [loggedInUser?.email, dispatch]);

  const getRentalRecordsForYourTenants = useCallback(async () => {
    const rentalRecordsCol = collection(db, RENTAL_RECORD_PATH);
    const q = query(
      rentalRecordsCol,
      where("owner", "==", loggedInUser?.email)
    );

    await getDocs(q)
      .then((rentalRecordsSnapshot) => {
        const rentalRecordsList = rentalRecordsSnapshot.docs.map((doc) =>
          doc.data()
        ) as RentalRecord[];

        dispatch(addRentalRecords(rentalRecordsList));
      })
      .catch((error) => {
        toast.error("Error Loading Rental Records");
      })
      .finally(() => {});
  }, [loggedInUser?.email, dispatch]);

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
  ]);

  const handleAddRentalRecord = async (data: RentalRecord, rents: Rent[]) => {
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
      .then((c) => {
        const rentBatch = writeBatch(db);
        rents.forEach((rentdoc) => {
          var docRef = doc(collection(db, RENT_PATH)); //automatically generate unique id
          const rentData = {
            ...rentdoc,
            id: docRef.id,
            rentalRecord: rentalRecordId,
            owner: loggedInUser?.email,
            rent: rentalRecordData.rent,
            rentPer: rentalRecordData.rentPer,
            property: rentalRecordData.property,
          };
          rentBatch.set(docRef, rentData);
        });

        rentBatch.commit().then(async () => {
          const rentalRecordLink =
            "http://localhost:3000/dashboard?tab=rentalRecordDetails&rentalRecordId=DsTRakjwfUUifykhQb7F";
          await sendEmail(
            rentalRecordData.tenant,
            `${loggedInUser.firstName} ${loggedInUser.lastName} is inviting you to manage rent for ${property?.title}`,
            `Click on the link below to manage your rent at ${property?.title}.\n ${rentalRecordLink}`,
            `Click on the link below to manage your rent at ${property?.title}.\n <a href=${rentalRecordLink}>Link</a>`
          );
          dispatch(addRentalRecord(rentalRecordData));
          toast.success(`Invite sent to ${rentalRecordData.tenant}`);
        });
      })
      .catch((error) => {
        toast.error("Error Adding Rental Record");
        return null;
      })
      .finally(() => {
        setAddingRentalRecord(false);
      });
  };

  const updatePaidRents = async (rents: Rent[]) => {
    if (!loggedInUser?.email) {
      return toast.error("Error getting user details.");
    }

    if (!rents.length) {
      return toast.error("Error getting rents details.");
    }

    const rentBatch = writeBatch(db);
    rents.forEach((rentdoc) => {
      var docRef = doc(collection(db, RENT_PATH), rentdoc.id); //automatically generate unique id
      const rentData: Rent = {
        ...rentdoc,
        status: "paid",
      };
      rentBatch.update(docRef, rentData);
    });

    rentBatch
      .commit()
      .then(() => {
        toast.success("Succesfully Updated Rents.");
      })
      .catch((error) => {
        toast.error("Error Updating Rents.");
      });
  };

  const handleUpdateRentalRecord = async (data: RentalRecord) => {
    if (!loggedInUser?.email) {
      return toast.error("Error getting user details.");
    }
    if (!data.id) {
      return toast.error("Error getting data.");
    }

    await updateDoc(doc(rentalRecordRef, data.id), data)
      .then((c) => {
        //TODO: Send Email Invite to tenant.
        dispatch(updateRentalRecord(data));
      })
      .finally(() => {});
  };

  const getRentalRecordData = async (
    id: string
  ): Promise<RentalRecord | undefined> => {
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
  };

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
  };
};
export default useRentalRecords;
