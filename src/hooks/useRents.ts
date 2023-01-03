import { collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import { toast } from "react-toastify";
import { db, RENT_PATH } from "../firebase/config";
import { Rent } from "../models";

const useRents = () => {
  const [loadingRents, setLoadingRents] = useState(false);

  async function getRentsForARentalRecord(
    rentalRecordId: string
  ): Promise<Rent[]> {
    const rentalRecordsCol = collection(db, RENT_PATH);
    const q = query(
      rentalRecordsCol,
      where("rentalRecord", "==", rentalRecordId)
    );
    let rentalRecordsList: Rent[] = [];
    setLoadingRents(true);
    await getDocs(q)
      .then((rentalRecordsSnapshot) => {
        rentalRecordsList = rentalRecordsSnapshot.docs.map((doc) =>
          doc.data()
        ) as Rent[];
      })
      .catch((error) => {
        toast.error("Error Loading Rental Records");
      });
    return rentalRecordsList;
  }

  return {
    getRentsForARentalRecord,
    loadingRents,
  };
};
export default useRents;
