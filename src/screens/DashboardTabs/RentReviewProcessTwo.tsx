import { selectRentReview } from "../../app/features/rentReviewSlice";
import { useAppSelector } from "../../app/hooks";
import { RentReviewStatus } from "../../models";
import { ReviewConversations } from "./ReviewConversations";

export function RentReviewProcessTwo() {
  const { currentRentReview } = useAppSelector(selectRentReview);

  return (
    <li className="mb-10 ml-6">
      <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
        <svg
          aria-hidden="true"
          className="w-3 h-3 text-blue-800 dark:text-blue-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </span>
      <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
        Rent review decision
      </h3>

      <p className="text-base font-normal text-gray-500 dark:text-gray-400">
        After the property manager sends the rent review request to the tenant,
        they will wait for the tenant to respond. The response may involve
        accepting the proposed rent increase, negotiating a lower increase, or
        rejecting the increase entirely.
      </p>
      {currentRentReview.status !== RentReviewStatus.opened && (
        <ReviewConversations />
      )}
    </li>
  );
}
