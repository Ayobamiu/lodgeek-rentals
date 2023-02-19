import { useCallback, useEffect } from "react";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { BankRecord, FirebaseCollections } from "../models";
import { bankRecordRef, db } from "../firebase/config";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  addBankRecord,
  selectBankRecords,
  setBankRecords,
} from "../app/features/bankRecordSlice";
import { selectUser } from "../app/features/userSlice";

function useBanks() {
  const dispatch = useAppDispatch();
  const loggedInUser = useAppSelector(selectUser);
  const bankRecords = useAppSelector(selectBankRecords);

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
  return { addBank };
}
export default useBanks;
