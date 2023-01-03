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
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  addRentalRecord,
  addRentalRecords,
  selectRentalRecords,
  setRentalRecords,
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
  const [updatingRentalRecord, setUpdatingRentalRecord] = useState(false);
  const [loadingRentalRecords, setLoadingRentalRecords] = useState(false);
  const [updatingRents, setUpdatingRents] = useState(false);
  const dispatch = useAppDispatch();
  const rentalRecords = useAppSelector(selectRentalRecords);
  const loggedInUser = useAppSelector(selectUser);

  useEffect(() => {
    if (!rentalRecords.length) {
      console.log({ email: loggedInUser?.email });
      getUsersRentalRecords();
      getRentalRecordsForYourTenants();
    }
  }, [loggedInUser?.email]);

  async function getUsersRentalRecords() {
    const rentalRecordsCol = collection(db, RENTAL_RECORD_PATH);
    const q = query(
      rentalRecordsCol,
      where("tenant", "==", loggedInUser?.email)
    );

    setLoadingRentalRecords(true);
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
      .finally(() => {
        setLoadingRentalRecords(false);
      });
  }

  async function getRentalRecordsForYourTenants() {
    const rentalRecordsCol = collection(db, RENTAL_RECORD_PATH);
    const q = query(
      rentalRecordsCol,
      where("owner", "==", loggedInUser?.email)
    );

    setLoadingRentalRecords(true);
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
      .finally(() => {
        setLoadingRentalRecords(false);
      });
  }

  const handleAddRentalRecord = async (data: RentalRecord, rents: Rent[]) => {
    if (!loggedInUser?.email) {
      return toast.error("Error getting user details.");
    }
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

        rentBatch.commit().then(() => {
          //TODO: Send Email Invite to tenant.
          dispatch(addRentalRecord(rentalRecordData));
          toast.success("Succesfully Added Rental Record");
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
    setUpdatingRentalRecord(true);
    await updateDoc(doc(rentalRecordRef, data.id), data)
      .then((c) => {
        //TODO: Send Email Invite to tenant.
        dispatch(updateRentalRecord(data));
      })
      .finally(() => {
        setUpdatingRentalRecord(false);
      });
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
