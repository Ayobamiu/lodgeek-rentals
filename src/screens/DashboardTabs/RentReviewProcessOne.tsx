import { Disclosure } from "@headlessui/react";
import moment from "moment";
import { selectRentReview } from "../../app/features/rentReviewSlice";
import { useAppSelector } from "../../app/hooks";
import { RentReviewStatus, RentReviewStatusColor } from "../../models";
import { RentReviewForm } from "./RentReviewForm";
import { ReviewRequestDetails } from "./ReviewRequestDetails";

export function RentReviewProcessOne() {
  const { currentRentReview } = useAppSelector(selectRentReview);
  const statusColor = RentReviewStatusColor[currentRentReview.status];

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
      <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
        Rent review request{" "}
        <span
          className={`bg-${statusColor}-100 text-${statusColor}-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-${statusColor}-900 dark:text-${statusColor}-300 ml-3`}
        >
          {currentRentReview.status}
        </span>
      </h3>
      {/* TODO: change initial value to 0 */}
      {currentRentReview.createdDate > 0 && (
        <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
          Created on{" "}
          {moment(currentRentReview.createdDate).format("MMMM Do, YYYY")}
        </time>
      )}
      <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
        Property manager sends a request to tenant to review the current rent
        amount. In the first step of the rent review process, property managers
        should consider all relevant factors such as local tenancy laws,
        comparable rental properties, tenant payment history, and lease
        agreements.
      </p>

      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="py-2">
              <a
                href="#"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
              >
                {open ? "Hide" : "Show"} review{" "}
                {currentRentReview.status === RentReviewStatus.opened
                  ? "form"
                  : "details"}
              </a>
            </Disclosure.Button>
            <Disclosure.Panel className="text-gray-500">
              {currentRentReview.status === RentReviewStatus.opened ? (
                <RentReviewForm />
              ) : (
                <ReviewRequestDetails review={currentRentReview} />
              )}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </li>
  );
}
