import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { selectRentalRecord } from "../../app/features/rentalRecordSlice";
import { selectRentReview } from "../../app/features/rentReviewSlice";
import { selectUser } from "../../app/features/userSlice";
import { useAppSelector } from "../../app/hooks";
import ActivityIndicator from "../../components/shared/ActivityIndicator";
import useRentalRecords from "../../hooks/useRentalRecords";
import { ReviewItem } from "./ReviewItem";

export const ReviewsOnRentalRecord = () => {
  let { rentalRecordId } = useParams();
  const navigate = useNavigate();
  const { rentReviews } = useAppSelector(selectRentReview);
  const { loadRentalReviews } = useRentalRecords();
  const [loading, setLoading] = useState(false);
  const { currentRentalRecord } = useAppSelector(selectRentalRecord);
  const loggedInUser = useAppSelector(selectUser);

  useEffect(() => {
    if (rentalRecordId) {
      (async () => {
        setLoading(true);
        await loadRentalReviews(rentalRecordId).finally(() => {
          setLoading(false);
        });
      })();
    }
  }, [rentalRecordId]);

  return (
    <div className=" p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="flex w-full justify-between">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex gap-x-3 items-center">
          Rent reviews {loading && <ActivityIndicator size="4" />}
        </h5>
        {currentRentalRecord.owner === loggedInUser?.email && (
          <button
            type="submit"
            title="Start Rent Review"
            onClick={() => {
              navigate(
                `/dashboard/rentalRecords/${rentalRecordId}/rent-review/new`
              );
            }}
            className="flex gap-x-3 items-center justify-center text-white bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Start Review
          </button>
        )}
      </div>
      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
        Here are the recent rent reviews, in reverse chronological order.
      </p>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Date created
              </th>
              <th scope="col" className="px-6 py-3">
                Previous rent
              </th>
              <th scope="col" className="px-6 py-3">
                New rent
              </th>
              <th scope="col" className="px-6 py-3">
                status
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">view</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rentReviews.map((rentReview) => (
              <ReviewItem key={rentReview.id} rentReview={rentReview} />
            ))}
          </tbody>
          {!rentReviews.length && (
            <caption className="px-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
              <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                No reviews found.
              </p>
            </caption>
          )}
        </table>
      </div>
    </div>
  );
};
