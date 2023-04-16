import moment from "moment";
import { useState } from "react";
import { toast } from "react-toastify";
import { setNotification } from "../../app/features/notificationSlice";
import {
  selectRentalRecord,
  setCurrentRentalRecordRents,
} from "../../app/features/rentalRecordSlice";
import { selectRent, setOpenRentPayment } from "../../app/features/rentSlice";
import { selectUser } from "../../app/features/userSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ActivityIndicator from "../../components/shared/ActivityIndicator";
import { createRent } from "../../firebase/apis/rents";
import { generateFirebaseId, RENT_PATH } from "../../firebase/config";
import { Rent, RentStatus } from "../../models";
import { rentSelected } from "../../utils/others";

import { RentItemForTable } from "./RentItemForTable";

export function UpaidRents({
  showPayRentButton,
}: {
  showPayRentButton: boolean;
}) {
  const dispatch = useAppDispatch();
  const loggedInUser = useAppSelector(selectUser);

  const {
    currentRentalRecordRents,
    currentRentalRecordCompany,
    currentRentalRecord,
  } = useAppSelector(selectRentalRecord);

  const { selectedRents, selectedAdditionalFees } = useAppSelector(selectRent);

  const payRent = () => {
    if (!currentRentalRecordCompany) {
      return dispatch(
        setNotification({
          type: "default",
          title: `Rent and fees payment are disabled for now.`,
          description:
            "Contact us to enable payment. Email: contact@lodgeek.com",
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
    if (!selectedRents.length && !selectedAdditionalFees.length) {
      return toast.warn("Select Rents or Fee to pay for.");
    }

    dispatch(setOpenRentPayment(true));
  };

  function filterOutPaidRents(rents: Rent[]) {
    return rents.filter(
      (rent) => rent.status !== RentStatus["Paid - Rent has been paid."]
    );
  }

  function sortRentsByDueDate(rents: Rent[]) {
    return rents.sort((a, b) => a.dueDate - b.dueDate);
  }

  const unpaidRents = sortRentsByDueDate(
    filterOutPaidRents(currentRentalRecordRents || [])
  );

  const allUnpaidRentsSelected =
    unpaidRents.length > 0 &&
    unpaidRents.findIndex((i) => !rentSelected(selectedRents, i)) === -1;

  const [addingNewRent, setAddingNewRent] = useState(false);

  const addAnotherRent = async () => {
    const rents = [...(currentRentalRecordRents || [])];

    const newRent: Rent = {
      dueDate: moment(currentRentalRecord.rentStarts)
        .add(rents.length, currentRentalRecord.rentPer)
        .toDate()
        .getTime(),
      id: generateFirebaseId(RENT_PATH),
      property: currentRentalRecord.property,
      rent: currentRentalRecord.rent,
      rentPer: currentRentalRecord.rentPer,
      rentalRecord: currentRentalRecord.id,
      status: RentStatus["Upcoming - Rent is not due for payment."],
      owner: currentRentalRecord.owner,
      tenant: currentRentalRecord.tenant,
      paidOn: -1,
      company: currentRentalRecord.company,
    };
    rents.push(newRent);
    setAddingNewRent(true);
    await createRent(newRent)
      .then(() => {
        dispatch(setCurrentRentalRecordRents(rents));
      })
      .finally(() => {
        setAddingNewRent(false);
      });
  };

  return (
    <div className="my-5">
      <div className="flex w-full justify-between mb-5">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex gap-x-3 items-center">
          Upcoming Rents
        </h5>
        {showPayRentButton && selectedRents.length > 0 && (
          <button
            type="submit"
            title="Pay Rent and fees"
            className="flex gap-x-3 items-center justify-center text-white bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            onClick={payRent}
          >
            Pay Rent
            {selectedAdditionalFees.length > 0 ? " and Fees" : ""}
          </button>
        )}
        {loggedInUser?.email === currentRentalRecord.owner && (
          <button
            title="Add new rent"
            disabled={addingNewRent}
            onClick={addAnotherRent}
            className="flex gap-x-3 items-center justify-center text-white bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Extend Rent {addingNewRent && <ActivityIndicator size="4" />}
          </button>
        )}
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-all"
                    type="checkbox"
                    disabled
                    checked={allUnpaidRentsSelected}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-all" className="sr-only">
                    checkbox
                  </label>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                Rent for
              </th>
              <th scope="col" className="px-6 py-3">
                Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>

              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {unpaidRents.map((rent, index) => (
              <RentItemForTable
                showPayRentButton={showPayRentButton}
                rent={rent}
                key={index}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
