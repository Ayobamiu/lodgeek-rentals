import { selectRentalRecord } from "../../app/features/rentalRecordSlice";
import {
  selectRent,
  setSelectedAdditionalFees,
} from "../../app/features/rentSlice";
import { selectUser } from "../../app/features/userSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { AdditionalFee } from "../../models";
import formatPrice from "../../utils/formatPrice";

type RentItemProps = {
  showPayRentButton: boolean;
  fee: AdditionalFee;
};

export function AdditionalFeeItemForTable(props: RentItemProps): JSX.Element {
  const { fee, showPayRentButton } = props;
  const loggedInUser = useAppSelector(selectUser);
  const { currentRentalRecord } = useAppSelector(selectRentalRecord);
  const { selectedAdditionalFees } = useAppSelector(selectRent);
  const dispatch = useAppDispatch();

  const showAdditionalFeePayButton =
    loggedInUser?.email === currentRentalRecord?.tenant;

  function feeIsSelected(i: AdditionalFee) {
    return selectedAdditionalFees.findIndex((x) => x.id === i.id) > -1;
  }

  const updateSelectedAdditionalFees = (value: AdditionalFee[]) => {
    dispatch(setSelectedAdditionalFees(value));
  };

  const onClickFee = () => {
    if (feeIsSelected(fee)) {
      updateSelectedAdditionalFees([
        ...selectedAdditionalFees.filter((x) => x.id !== fee.id),
      ]);
    } else {
      updateSelectedAdditionalFees([...selectedAdditionalFees, fee]);
    }
  };

  const rentNotClickable = !showPayRentButton || fee.paid;

  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
      <td className="w-4 p-4">
        {!fee.paid && (
          <div className="flex items-center">
            <input
              id="checkbox-table-1"
              type="checkbox"
              onChange={onClickFee}
              checked={feeIsSelected(fee)}
              disabled={rentNotClickable}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 disabled:cursor-not-allowed dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="checkbox-table-1" className="sr-only">
              checkbox
            </label>
          </div>
        )}
      </td>
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {fee.feeTitle}
      </th>
      <td className="px-6 py-4">{formatPrice(fee.feeAmount)}</td>
      <td className="px-6 py-4">
        {fee.feeIsRequired ? "Required" : "Not Required"}
      </td>

      <td className="px-6 py-4">
        {fee.paid ? (
          <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
            Paid
          </span>
        ) : (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
            Not Paid
          </span>
        )}
      </td>

      {!fee.paid && (
        <td className="px-6 py-4">
          {showAdditionalFeePayButton && (
            <button
              onClick={onClickFee}
              disabled={rentNotClickable}
              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            >
              Pay
            </button>
          )}
        </td>
      )}
    </tr>
  );
}
