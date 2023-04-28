import { selectRentReview } from "../../app/features/rentReviewSlice";
import { useAppSelector } from "../../app/hooks";
import { RentReviewStatusColor } from "../../models";

export function InstructionOnAcceptance() {
  const { currentRentReview } = useAppSelector(selectRentReview);
  const statusColor = RentReviewStatusColor[currentRentReview.status];

  return (
    <>
      {/* Instruction when rent increase is accepted */}
      <div
        className={`p-3 border border-${statusColor}-200 rounded-lg bg-${statusColor}-50 dark:bg-${statusColor}-600 dark:border-${statusColor}-500 `}
      >
        <h2
          className={`mb-2 text-lg font-semibold text-${statusColor}-900 dark:text-white`}
        >
          The proposed rent increase has been accepted.
        </h2>
        <p className={`mb-2 text-${statusColor}-900 dark:text-white`}>
          As a result, we have generated two documents that require your
          attention:
        </p>
        <ol
          className={`max-w-md space-y-1 text-${statusColor}-500 list-decimal list-inside dark:text-${statusColor}-400`}
        >
          <li>
            Rent Increase Notice: outlines the details of the rent increase and
            provides information on when it will take effect.
          </li>
          <li>
            New Lease Agreement: This document reflects the updated rental
            amount and other changes to the lease agreement. Please review it
            carefully and sign where necessary.
          </li>
        </ol>
      </div>
      <div className="flex my-5 gap-x-3 flex-wrap">
        <a
          href={currentRentReview.rentIncreaseNotice}
          target="_blank"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
              clipRule="evenodd"
            ></path>
          </svg>{" "}
          Download Rent Increase Notice
        </a>

        <a
          href={currentRentReview.leaseAgreement}
          target="_blank"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
              clipRule="evenodd"
            ></path>
          </svg>{" "}
          Download New Lease Agreement
        </a>
      </div>
    </>
  );
}
