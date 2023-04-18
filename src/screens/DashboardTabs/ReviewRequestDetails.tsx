import moment from "moment";
import DetailsBox from "../../components/shared/DetailsBox";
import { RentReview } from "../../models";
import formatPrice from "../../utils/formatPrice";

export function ReviewRequestDetails({ review }: { review: RentReview }) {
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600">
      <div className="items-center justify-between mb-3 sm:flex">
        <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
          {moment(review.createdDate).calendar()}
        </time>
        <div className="text-sm font-normal text-gray-500 lex dark:text-gray-300">
          Rent review request submitted
        </div>
      </div>
      <div className="p-3 text-xs font-normal text-gray-500 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300">
        <DetailsBox
          label="Property Address:"
          value={review.reveiwFormDetails.address}
        />
        <DetailsBox
          label="Unit Number:"
          value={review.reveiwFormDetails.unitNumber}
        />
        <DetailsBox
          label="Current Rent Amount:"
          value={formatPrice(review.reveiwFormDetails.currentRentAmount)}
        />
        <DetailsBox
          label="New Rent Amount:"
          value={formatPrice(review.reveiwFormDetails.newRentAmount)}
        />
        <DetailsBox
          label="Review Date (effective date of the increase):"
          value={moment(review.reveiwFormDetails.reviewDate).format("ll")}
        />
        <DetailsBox
          label="Reason for Rent Review:"
          value={review.reveiwFormDetails.reasonForReview}
        />
        <DetailsBox label="Notes:" value={review.reveiwFormDetails.notes} />
      </div>
    </div>
  );
}
