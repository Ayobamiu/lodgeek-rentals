import { selectRentalRecord } from "../../app/features/rentalRecordSlice";
import { useAppSelector } from "../../app/hooks";
import { RentStatus } from "../../models";
import { RentItemForTable } from "./RentItemForTable";

export function PaidRents({
  showPayRentButton,
}: {
  showPayRentButton: boolean;
}) {
  const { currentRentalRecordRents } = useAppSelector(selectRentalRecord);

  const paidRents = currentRentalRecordRents.filter(
    (i) => i.status === RentStatus["Paid - Rent has been paid."]
  );
  if (!paidRents.length) return null;
  return (
    <div className="">
      <div className="flex w-full justify-between mb-5">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex gap-x-3 items-center">
          Paid Rents
        </h5>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
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
                Paid on
              </th>
            </tr>
          </thead>
          <tbody>
            {paidRents.map((rent, index) => (
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
