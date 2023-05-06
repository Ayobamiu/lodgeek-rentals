import moment from "moment";
import {
  selectSelectedRents,
  setOpenReduceRent,
  setRentToEdit,
  setSelectedRents,
} from "../../app/features/rentSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { CompanyRole, Rent, RentStatus, RentStatusColor } from "../../models";
import formatPrice from "../../utils/formatPrice";
import { rentSelected } from "../../utils/others";
import { CopyOutlined } from "@ant-design/icons";
import { copyToClipboard } from "../../utils/copyToClipboard";
import { selectUser } from "../../app/features/userSlice";
import { selectRentalRecord } from "../../app/features/rentalRecordSlice";
import { useMemo } from "react";
type RentItemProps = {
  showPayRentButton: boolean;
  rent: Rent;
};

export function RentItemForTable(props: RentItemProps): JSX.Element {
  const { rent, showPayRentButton } = props;
  const selectedRents = useAppSelector(selectSelectedRents);
  const loggedInUser = useAppSelector(selectUser);
  const { currentRentalRecord, currentRentalRecordMembers } =
    useAppSelector(selectRentalRecord);

  const dispatch = useAppDispatch();
  const statusColor = RentStatusColor[rent.status];

  const rentNotClickable =
    !showPayRentButton ||
    rent.status === RentStatus["Paid - Rent has been paid."];
  const onClickRentItem = () => {
    if (rentNotClickable) return;
    if (rentSelected(selectedRents, rent)) {
      dispatch(setSelectedRents(selectedRents.filter((i) => i.id !== rent.id)));
    } else {
      dispatch(setSelectedRents([...selectedRents, rent]));
    }
  };
  const paymentLink = `${process.env.REACT_APP_BASE_URL}pay-for-rent/${rent.id}`;
  const hasAdminRole = useMemo(() => {
    const myMemberObject = currentRentalRecordMembers.find(
      (i) => i.memberData.email === loggedInUser?.email
    );
    return myMemberObject?.memberData.role === CompanyRole.admin ?? false;
  }, [currentRentalRecordMembers, loggedInUser]);

  const hasOwnersRole = useMemo(() => {
    const myMemberObject = currentRentalRecordMembers.find(
      (i) => i.memberData.email === loggedInUser?.email
    );
    return (
      myMemberObject?.memberData.role === CompanyRole.admin ||
      loggedInUser?.email === currentRentalRecord.owner
    );
  }, [currentRentalRecordMembers, currentRentalRecord, loggedInUser]);

  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
      {rent.status !== RentStatus["Paid - Rent has been paid."] && (
        <td className="w-4 p-4">
          <div className="flex items-center">
            <input
              id="checkbox-table-1"
              type="checkbox"
              onChange={onClickRentItem}
              checked={rentSelected(selectedRents, rent)}
              disabled={rentNotClickable}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 disabled:cursor-not-allowed"
            />
            <label htmlFor="checkbox-table-1" className="sr-only">
              checkbox
            </label>
          </div>
        </td>
      )}
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {moment(rent.dueDate).format("MMM YYYY")}
      </th>
      <td className="px-6 py-4">{formatPrice(rent.rent)}</td>
      <td className="px-6 py-4">
        <span
          className={`bg-${statusColor}-100 text-${statusColor}-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-${statusColor}-900 dark:text-${statusColor}-300`}
        >
          {rent.status}
        </span>
      </td>
      {rent.status === RentStatus["Paid - Rent has been paid."] && (
        <td className="px-6 py-4">{moment(rent.paidOn).format("ll")}</td>
      )}
      {rent.status !== RentStatus["Paid - Rent has been paid."] && (
        <td className="px-6 py-4 flex gap-3">
          <button
            onClick={onClickRentItem}
            disabled={rentNotClickable}
            className="font-medium text-blue-600 dark:text-blue-600  disabled:cursor-not-allowed"
          >
            Pay
          </button>
          {(hasAdminRole || hasOwnersRole) && (
            <button
              onClick={() => {
                dispatch(setOpenReduceRent(true));
                dispatch(setRentToEdit(rent));
              }}
              disabled={rentNotClickable}
              className="font-medium text-blue-600 dark:text-blue-600  disabled:cursor-not-allowed"
            >
              Reduce rent
            </button>
          )}
          <button
            onClick={() => {
              copyToClipboard(paymentLink);
            }}
            className="font-medium text-blue-600 dark:text-blue-600  disabled:cursor-not-allowed flex items-center gap-1"
          >
            Payment link <CopyOutlined />
          </button>
        </td>
      )}
    </tr>
  );
}
