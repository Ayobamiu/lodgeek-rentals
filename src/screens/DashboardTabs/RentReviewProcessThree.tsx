import moment from "moment";
import { RentReviewStatus } from "../../models";
import { useAppSelector } from "../../app/hooks";
import { selectRentReview } from "../../app/features/rentReviewSlice";
import { selectUser } from "../../app/features/userSlice";
import { InstructionOnAcceptance } from "./InstructionOnAcceptance";
import { InstructionOnRejection } from "./InstructionOnRejection";
import { TenantsInstructionAfterResponse } from "./TenantsInstructionAfterResponse";
import { ManagersDecisionButtons } from "./ManagersDecisionButtons";

export function RentReviewProcessThree() {
  const { currentRentReview } = useAppSelector(selectRentReview);
  const loggedInUser = useAppSelector(selectUser);

  const decisionMade = [
    RentReviewStatus.increaseAccepted,
    RentReviewStatus.increaseRejected,
  ].includes(currentRentReview.status);
  const beforeDecisionMade = [
    RentReviewStatus.reviewSent,
    RentReviewStatus.tenantResponded,
  ].includes(currentRentReview.status);

  return (
    <li className="ml-6">
      <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
        <svg
          aria-hidden="true"
          className="w-3 h-3 text-blue-800 dark:text-blue-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
            clipRule="evenodd"
          ></path>
        </svg>
      </span>
      <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
        Rent increase notice
      </h3>
      {/* Date when decision was made */}
      {decisionMade && (
        <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
          {currentRentReview.status === RentReviewStatus.increaseAccepted
            ? "Accepted"
            : "Rejected"}{" "}
          on{" "}
          {moment(
            currentRentReview.status === RentReviewStatus.increaseAccepted
              ? currentRentReview.acceptedOn
              : currentRentReview.rejectedOn
          ).format("ll")}
        </time>
      )}

      <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
        If rent is to be increased, property manager sends a rent increase
        notice to the tenant.
      </p>
      <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
        If tenant accepts the increase, new lease agreement is signed. If not,
        the lease agreement continues with the previous rent amount.
      </p>

      {decisionMade && (
        <>
          {currentRentReview.status === RentReviewStatus.increaseAccepted ? (
            <InstructionOnAcceptance />
          ) : (
            <InstructionOnRejection />
          )}
        </>
      )}

      {beforeDecisionMade && (
        <>
          {loggedInUser?.email === currentRentReview.tenant ? (
            <TenantsInstructionAfterResponse />
          ) : (
            <ManagersDecisionButtons />
          )}
        </>
      )}
    </li>
  );
}
