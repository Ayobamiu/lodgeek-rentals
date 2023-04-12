import { Disclosure } from "@headlessui/react";
import { SubmitNewLeaseAgreement } from "./SubmitNewLeaseAgreement";
import ActivityIndicator from "../../components/shared/ActivityIndicator";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectRentReview,
  updateCurrentRentReview,
} from "../../app/features/rentReviewSlice";
import { useState } from "react";
import { RentReview, RentReviewStatus } from "../../models";
import { updateRentReviewInDatabase } from "../../firebase/apis/rentReview";
import { toast } from "react-toastify";
import { selectRentalRecord } from "../../app/features/rentalRecordSlice";
import { generateSimpleEmail } from "../../utils/generateSimpleEmail";
import { sendEmail } from "../../api/email";

export function ManagersDecisionButtons() {
  const { currentRentReview } = useAppSelector(selectRentReview);
  const {
    currentRentalRecordTenant,
    currentRentalRecordOwner,
    currentRentalRecordProperty,
  } = useAppSelector(selectRentalRecord);
  const [rejectingIncrease, setRejectingIncrease] = useState(false);
  const dispatch = useAppDispatch();

  const rejectRentIncrease = async () => {
    const updatedCurrentRentReview: RentReview = {
      ...currentRentReview,
      status: RentReviewStatus.increaseRejected,
      rejectedOn: Date.now(),
    };
    setRejectingIncrease(true);
    await updateRentReviewInDatabase(updatedCurrentRentReview)
      .then(async () => {
        const paragraphs = [
          `Dear ${currentRentalRecordTenant?.firstName} ${currentRentalRecordTenant?.lastName},`,
          `I hope this email finds you well. I am writing to inform you about the decision regarding the rent increase for your ${currentRentalRecordProperty?.title}. After careful consideration of your response and a review of the current market conditions, we have decided not to increase your rent at this time.`,
          `We understand that this may come as a relief to you and we want to assure you that we value your tenancy and appreciate your cooperation during this process.`,
          `Please be informed that your current lease agreement and rental rate still hold and we encourage you to continue your tenancy with us. If you have any further questions or concerns, please feel free to reach out to us.`,
          `Thank you for your understanding and cooperation.`,
          `Best regards,`,
          `${currentRentalRecordOwner?.firstName} ${currentRentalRecordOwner?.lastName}`,
        ];

        const generatedEmail = generateSimpleEmail({
          paragraphs,
        });

        await sendEmail(
          currentRentReview.tenant,
          `Rent Increase Decision - ${currentRentalRecordProperty?.address}`,
          paragraphs.join(" \n"),
          generatedEmail
        );
        dispatch(
          updateCurrentRentReview({
            status: RentReviewStatus.increaseRejected,
            rejectedOn: Date.now(),
          })
        );
        toast.success("Rent Increase cancelled.");
      })
      .finally(() => {
        setRejectingIncrease(false);
      });
  };
  return (
    <>
      {/* Manager's info before decision is made. Buttons to Accept or reject rent increase. */}
      <Disclosure>
        {() => (
          <>
            <div className="flex items-center gap-3">
              <Disclosure.Button className="py-2">
                <button
                  type="button"
                  className="inline-flex gap-x-3 items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
                >
                  Proceed with rent Increase.
                </button>
              </Disclosure.Button>

              <button
                type="button"
                disabled={rejectingIncrease}
                onClick={rejectRentIncrease}
                className="inline-flex gap-x-3 items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-red-700 disabled:bg-gray-500 disabled:cursor-not-allowed rounded-lg focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900 hover:bg-red-800"
              >
                Cancel rent Increase Process.{" "}
                {rejectingIncrease && <ActivityIndicator size="4" />}
              </button>
            </div>

            <Disclosure.Panel className="text-gray-500">
              <div className="uploadRentIncreaseNotice">
                <SubmitNewLeaseAgreement />
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
}
