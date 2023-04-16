import { FormEvent, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { selectRentalRecord } from "../../app/features/rentalRecordSlice";
import {
  selectRentReview,
  updateCurrentRentReview,
} from "../../app/features/rentReviewSlice";
import { selectUser } from "../../app/features/userSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ProfilePhoto } from "../../components/dashboard/ProfilePhoto";
import ActivityIndicator from "../../components/shared/ActivityIndicator";
import { addResponseToRentReview } from "../../firebase/apis/rentReview";
import { ReviewRequestDetails } from "./ReviewRequestDetails";
import { v4 as uuidv4 } from "uuid";
import { RentReviewResponse, RentReviewStatus } from "../../models";
import moment from "moment";
import { generateSimpleEmail } from "../../utils/generateSimpleEmail";
import { sendEmail } from "../../api/email";

export function ReviewConversations() {
  let { reviewId } = useParams();
  const loggedInUser = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const { currentRentReview } = useAppSelector(selectRentReview);
  const {
    currentRentalRecordOwner,
    currentRentalRecordProperty,
    currentRentalRecordTenant,
  } = useAppSelector(selectRentalRecord);
  const [message, setMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const sortedResponses = [...(currentRentReview.responses || [])].sort(
    function (a, b) {
      return Number(b.date) - Number(a.date);
    }
  );

  const decisionMade = [
    RentReviewStatus.increaseAccepted,
    RentReviewStatus.increaseRejected,
  ].includes(currentRentReview.status);

  const sendNewResponseEmail = async (email: string, recipientName: string) => {
    const reviewLink = `${process.env.REACT_APP_BASE_URL}dashboard/rentalRecords/${currentRentReview.rentalRecord}/rent-review/${currentRentReview.id}`;
    const paragraphs = [
      `Dear ${recipientName},`,
      `This is to inform you that there has been a response to the rent review request for ${currentRentalRecordProperty?.title} that you initiated on Lodgeek.`,
      `Please log in to your Lodgeek account to view the response and continue the rent review process. You can access the review page by clicking on the link provided below:`,
      `<a href=${reviewLink}>Review Page Link</a>`,
      `Thank you for using Lodgeek for your property management needs.`,
      `Best regards,`,
      `The Lodgeek Team.`,
    ];

    const generatedEmail = generateSimpleEmail({
      paragraphs,
      buttons: [
        {
          link: reviewLink,
          text: "View the details",
        },
      ],
    });

    await sendEmail(
      email,
      `Rent Review Response Notification`,
      paragraphs.join(" \n"),
      generatedEmail
    );
  };

  const submitResponse = async (e: FormEvent) => {
    e.preventDefault();

    if (!reviewId || !loggedInUser?.email) {
      return toast.error("Unable to send response.");
    }

    setSendingMessage(true);

    const response = {
      message,
      user: loggedInUser?.email,
      date: Date.now(),
      id: uuidv4(),
    };

    await addResponseToRentReview(reviewId, response)
      .finally(() => {
        setSendingMessage(false);
      })
      .then(() => {
        if (loggedInUser.email === currentRentReview.owner) {
          //Send email to tenant
          sendNewResponseEmail(
            currentRentReview.tenant,
            `${currentRentalRecordTenant?.firstName} ${currentRentalRecordTenant?.lastName}`
          );
        } else {
          //Send email to property manager
          sendNewResponseEmail(
            currentRentReview.owner,
            `${currentRentalRecordOwner?.firstName} ${currentRentalRecordOwner?.lastName}`
          );
        }
        const responses: RentReviewResponse[] = [
          ...(currentRentReview.responses || []),
          response,
        ];
        dispatch(updateCurrentRentReview({ responses }));
        const reviewResponseForm: HTMLFormElement | null =
          document &&
          (document.getElementById("reviewResponseForm") as HTMLFormElement);
        if (reviewResponseForm) {
          reviewResponseForm.reset();
        }
      });
  };

  /* Only property manager and tenant can send responses, when decision has not been made */

  const canSendResponses =
    loggedInUser?.email &&
    [currentRentReview.tenant, currentRentReview.owner].includes(
      loggedInUser?.email
    ) &&
    !decisionMade;

  return (
    <div className="max-w-xl my-4">
      {canSendResponses && (
        <form id="reviewResponseForm" onSubmit={submitResponse}>
          <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
              <label htmlFor="response" className="sr-only">
                Your response
              </label>
              <textarea
                id="response"
                rows={4}
                className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                placeholder="Write a response..."
                required
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>
            <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
              <button
                type="submit"
                disabled={sendingMessage}
                className="inline-flex gap-x-3 items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
              >
                Post response {sendingMessage && <ActivityIndicator size="4" />}
              </button>
            </div>
          </div>
          <p className="ml-auto text-xs text-gray-500 dark:text-gray-400 mb-4">
            Your response should address accepting the proposed rent increase,
            negotiating a lower increase, or rejecting the increase entirely.
          </p>
        </form>
      )}

      <ol className="relative border-l border-gray-200 dark:border-gray-700">
        {sortedResponses.map((response) => (
          <li className="mb-10 ml-6" key={response.id}>
            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
              <ProfilePhoto size="6" name={response.user} />
            </span>
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600">
              <div className="items-center justify-between sm:flex">
                <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                  {moment(response.date).calendar()}
                </time>
                <div className="text-sm font-normal text-gray-500 dark:text-gray-300">
                  {response.user}
                </div>
              </div>
              <div className="p-3 text-xs font-normal text-gray-500 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300">
                <p>{response.message}</p>
              </div>
            </div>
          </li>
        ))}

        <li className="mb-10 ml-6">
          <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
            <ProfilePhoto
              size="6"
              name={`${currentRentalRecordOwner?.firstName} ${currentRentalRecordOwner?.lastName}`}
              photoURL={currentRentalRecordOwner?.photoURL}
            />
          </span>
          <ReviewRequestDetails review={currentRentReview} />
        </li>
      </ol>
    </div>
  );
}
