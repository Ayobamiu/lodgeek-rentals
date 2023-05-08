import React, { useState } from "react";
import { message, Modal, notification } from "antd";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectRent,
  setOpenReduceRent,
  updateRent,
} from "../../app/features/rentSlice";
import CurrencyInput from "react-currency-input-field";
import formatPrice from "../../utils/formatPrice";
import { Rent } from "../../models";
import { updateRentInDatabase } from "../../firebase/apis/rents";
import {
  selectRentalRecord,
  setCurrentRentalRecordRents,
} from "../../app/features/rentalRecordSlice";
import moment from "moment";
import { generateSimpleEmail } from "../../utils/generateSimpleEmail";
import { sendEmail } from "../../api/email";
import ActivityIndicator from "../shared/ActivityIndicator";

const ReduceRentModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { openReduceRent, rentToEdit } = useAppSelector(selectRent);
  const {
    currentRentalRecordTenant,
    currentRentalRecordOwner,
    currentRentalRecordRents,
  } = useAppSelector(selectRentalRecord);
  const [reductionAmount, setReductionAmount] = useState(0);
  const [reductionReason, setReductionReason] = useState("");
  const [updating, setUpdating] = useState(false);

  const handleCancel = () => {
    dispatch(setOpenReduceRent(false));
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (reductionAmount >= rentToEdit.rent) {
      return notification.error({
        message:
          "Cannot set new rent to an amount higher or equal to the current rent.",
        description:
          "Please reduce the rent to a lower amount or start a rent review process if you wish to increase the rent.",
      });
    }

    const updatedRent: Rent = {
      ...rentToEdit,
      rent: reductionAmount,
    };

    const resetFormAndClose = () => {
      if (e.currentTarget) {
        e.currentTarget.reset();
      }
      setReductionAmount(0);
      setReductionReason("");
      handleCancel();
    };

    setUpdating(true);
    await updateRentInDatabase(updatedRent)
      .then(async () => {
        //Send Email
        const subject = "Rent Reduction Notification";
        const rentPeriod = moment(rentToEdit.dueDate).format("MMM YYYY");
        const formatedOldRent = formatPrice(rentToEdit.rent);
        const formatedNewRent = formatPrice(updatedRent.rent);
        const paragraphs = [
          `Dear ${currentRentalRecordTenant?.firstName},`,
          `I am writing to inform you that your rent has been reduced from ${formatedOldRent} to ${formatedNewRent} due to the following reason. Your rent for ${rentPeriod} will be ${formatedNewRent}.`,
          `<strong>Reason:</strong> <em>${reductionReason}</em>`,
          `Please note that this is a one-time reduction and your rent will revert to the original amount in subsequent ${rentToEdit.rentPer}s unless otherwise stated.`,
          `If you have any questions or concerns regarding the rent reduction, please do not hesitate to reach out to your property manager.`,
          `Thank you for your understanding.`,
          `Best regards,`,
          `${currentRentalRecordOwner?.firstName} ${currentRentalRecordOwner?.lastName}`,
        ];
        const paymentLink = `${process.env.REACT_APP_BASE_URL}pay-for-rent/${rentToEdit.id}`;
        const generatedEmail = generateSimpleEmail({
          paragraphs,
          buttons: [
            {
              link: paymentLink,
              text: `Pay ${rentPeriod} rent now`,
            },
          ],
        });
        await sendEmail(
          rentToEdit.tenant,
          subject,
          paragraphs.join(" \n"),
          generatedEmail
        ).then(() => {
          message.success("Rent updated.");
        });

        //Update rent in store
        const rents: Rent[] = [...currentRentalRecordRents];
        const updatedRentIndex = rents.findIndex(
          (i) => i.id === updatedRent.id
        );
        rents.splice(updatedRentIndex, 1, updatedRent);
        dispatch(updateRent(updatedRent));
        dispatch(setCurrentRentalRecordRents(rents));

        resetFormAndClose();
      })
      .finally(() => {
        setUpdating(false);
      });
  };
  return (
    <>
      <Modal
        open={openReduceRent}
        title="Reduce Rent"
        onCancel={handleCancel}
        footer={null}
      >
        <form
          id="additionalFeeForm"
          onSubmit={onSubmit}
          className="flex flex-col gap-5 mb-5"
        >
          <div className="flex gap-x-2">
            <strong>Current Rent: </strong> {formatPrice(rentToEdit.rent)} per{" "}
            {rentToEdit.rentPer}
          </div>
          <div className="">
            <label htmlFor="reductionAmount">New Rent</label>
            <CurrencyInput
              id="reductionAmount"
              name="reductionAmount"
              placeholder="₦ 00.00"
              decimalsLimit={2}
              onValueChange={(value) => {
                setReductionAmount(Number(value));
              }}
              value={reductionAmount}
              required
              prefix="₦ "
              className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
            />
            <small>
              Enter a reduced rent (An Amount lesser than{" "}
              {formatPrice(rentToEdit.rent)}).
            </small>
          </div>
          <div className="">
            <label htmlFor="reductionReason">Reduction Reason</label>
            <textarea
              required
              className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
              placeholder="Enter Reduction Reason"
              id="reductionReason"
              name="reductionReason"
              value={reductionReason}
              onChange={(e) => {
                setReductionReason(e.target.value);
              }}
            />
          </div>

          <div className="lg:col-span-1 col-span-4 flex  gap-x-2">
            <button
              type="submit"
              disabled={updating}
              className="w-full px-4 py-3 text-sm text-white font-medium bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 rounded-md shadow-button flex items-center justify-center gap-x-3"
            >
              Reduce rent
              {updating && <ActivityIndicator size="4" />}
            </button>
          </div>
          <div
            className="flex p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
            role="alert"
          >
            <svg
              aria-hidden="true"
              className="flex-shrink-0 inline w-5 h-5 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Info</span>
            <div>
              <span className="font-medium">Information:</span> When you reduce
              a rent on Lodgeek, the tenant will receive a notification about
              the reduced amount and the reason for the reduction. Please ensure
              that the reason provided is clear and concise.
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ReduceRentModal;
