import moment from "moment";
import { useNavigate } from "react-router-dom";
import { RentReview, RentReviewStatusColor } from "../../models";
import formatPrice from "../../utils/formatPrice";

export function ReviewItem({
  rentReview,
}: {
  rentReview: RentReview;
}): JSX.Element {
  const navigate = useNavigate();
  const statusColor = RentReviewStatusColor[rentReview.status];
  return (
    <tr
      key={rentReview.id}
      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
    >
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {moment().format("ll")}
      </th>
      <td className="px-6 py-4">
        {formatPrice(rentReview.reveiwFormDetails.currentRentAmount)}
      </td>
      <td className="px-6 py-4">
        {formatPrice(rentReview.reveiwFormDetails.newRentAmount)}
      </td>
      <td className={"px-6 py-4"}>
        <span
          className={`bg-${statusColor}-100 text-${statusColor}-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-${statusColor}-900 dark:text-${statusColor}-300`}
        >
          {rentReview.status}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <button
          onClick={() => {
            navigate(
              `/dashboard/rentalRecords/${rentReview.rentalRecord}/rent-review/${rentReview.id}`
            );
          }}
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
        >
          view
        </button>
      </td>
    </tr>
  );
}
