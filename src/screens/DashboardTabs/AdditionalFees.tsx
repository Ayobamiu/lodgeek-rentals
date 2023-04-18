import { Disclosure } from "@headlessui/react";
import { toast } from "react-toastify";
import { setNotification } from "../../app/features/notificationSlice";
import { selectRentalRecord } from "../../app/features/rentalRecordSlice";
import { selectRent, setOpenRentPayment } from "../../app/features/rentSlice";
import { selectUser } from "../../app/features/userSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import AdditionalNewfeeForm from "../../components/rental/AdditionalNewfeeForm";
import { AdditionalFee } from "../../models";
import { AdditionalFeeItemForTable } from "./AdditionalFeeItemForTable";

export function AdditionalFees({
  showPayRentButton,
}: {
  showPayRentButton: boolean;
}) {
  const dispatch = useAppDispatch();
  const { currentRentalRecordCompany, currentRentalRecord } =
    useAppSelector(selectRentalRecord);
  const { selectedRents, selectedAdditionalFees } = useAppSelector(selectRent);
  const loggedInUser = useAppSelector(selectUser);

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

  function feeIsSelected(i: AdditionalFee) {
    return selectedAdditionalFees.findIndex((x) => x.id === i.id) > -1;
  }

  const unpaidFees = currentRentalRecord?.fees?.filter((i) => !i.paid) || [];

  const allUnpaidFeesSelected =
    unpaidFees.length > 0 &&
    unpaidFees.findIndex((i) => !feeIsSelected(i)) === -1;

  const noFeesAndIAmATenant =
    !currentRentalRecord?.fees.length &&
    loggedInUser?.email === currentRentalRecord.tenant;

  if (noFeesAndIAmATenant) return null;
  return (
    <div className="my-5">
      <Disclosure>
        {({ open }) => (
          <>
            <div className="flex w-full justify-between mb-5">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex gap-x-3 items-center">
                Additional Fees
              </h5>
              {loggedInUser?.email === currentRentalRecord.tenant &&
                selectedAdditionalFees.length > 0 && (
                  <button
                    type="submit"
                    title="Pay Rent and fees"
                    className="flex gap-x-3 items-center justify-center text-white bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    onClick={payRent}
                  >
                    Pay Fees
                    {selectedRents.length > 0 ? " and Rents" : ""}
                  </button>
                )}
              {loggedInUser?.email === currentRentalRecord.owner && (
                <Disclosure.Button className="py-2">
                  <button
                    title="Add new fees"
                    className="flex gap-x-3 items-center justify-center text-white bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  >
                    {open ? "Close fee form" : "Add fees"}
                  </button>
                </Disclosure.Button>
              )}
            </div>
            <Disclosure.Panel className="text-gray-500">
              <AdditionalNewfeeForm />
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

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
                    checked={allUnpaidFeesSelected}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-all" className="sr-only">
                    checkbox
                  </label>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Required
              </th>
              <th scope="col" className="px-6 py-3">
                Paid
              </th>

              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentRentalRecord?.fees.map((fee, index) => (
              <AdditionalFeeItemForTable
                showPayRentButton={showPayRentButton}
                fee={fee}
                key={index}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
