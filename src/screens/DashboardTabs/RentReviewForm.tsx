import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { FormEvent, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { sendEmail } from "../../api/email";
import { selectRentalRecord } from "../../app/features/rentalRecordSlice";
import {
  selectRentReview,
  updateCurrentRentReview,
} from "../../app/features/rentReviewSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ActivityIndicator from "../../components/shared/ActivityIndicator";
import AppInput from "../../components/shared/AppInput";
import { createRentReview } from "../../firebase/apis/rentReview";
import { generateFirebaseId } from "../../firebase/config";
import {
  FirebaseCollections,
  RentReview,
  RentReviewStatus,
  RentStatus,
  ReveiwFormDetails,
} from "../../models";
import { generateSimpleEmail } from "../../utils/generateSimpleEmail";

export function RentReviewForm() {
  const {
    currentRentalRecord,
    currentRentalRecordRents,
    currentRentalRecordOwner,
    currentRentalRecordProperty,
    currentRentalRecordTenant,
  } = useAppSelector(selectRentalRecord);
  const { currentRentReview } = useAppSelector(selectRentReview);

  let { rentalRecordId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [submittingReview, setSubmittingReview] = useState(false);

  const paidRents = currentRentalRecordRents
    .filter((i) => i.status === RentStatus["Paid - Rent has been paid."])
    .sort((a, b) => a.dueDate - b.dueDate);
  const lastPaidRent = paidRents[paidRents.length - 1];

  const nextFourDuePayments = [];

  const firstRent = [...currentRentalRecordRents].sort(
    (a, b) => a.dueDate - b.dueDate
  )[0];

  for (let index = 1; index < 6; index++) {
    nextFourDuePayments.push(
      moment(lastPaidRent?.dueDate || firstRent.dueDate)
        .add(index, currentRentalRecord.rentPer)
        .toDate()
        .getTime()
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newReview: RentReview = {
      ...currentRentReview,
      id: generateFirebaseId(FirebaseCollections.rentReview),
      status: RentReviewStatus.reviewSent,
    };

    setSubmittingReview(true);
    await createRentReview(newReview)
      .then(async () => {
        const reviewLink = `${process.env.REACT_APP_BASE_URL}dashboard/rentalRecords/${currentRentReview.rentalRecord}/rent-review/${currentRentReview.id}`;
        const paragraphs = [
          `Dear ${currentRentalRecordTenant?.firstName} ${currentRentalRecordTenant?.lastName},`,
          `We hope this email finds you well. Your property manager, ${currentRentalRecordOwner?.firstName} ${currentRentalRecordOwner?.lastName}, has initiated a rent review for your rental property at ${currentRentalRecordProperty?.address}. As a tenant, you have the right to provide feedback on any proposed changes to your rent.`,
          `To view the details of the rent review and respond, please visit <a href=${reviewLink}>Rent Review Page</a>. Please note that this link is unique to you and should not be shared with others.`,
          `We encourage you to review all relevant information, including local tenancy laws, comparable rental properties, tenant payment history, and lease agreements, before making your decision. Your response should address accepting the proposed rent increase, negotiating a lower increase, or rejecting the increase entirely.`,
          `If you have any questions or concerns, please do not hesitate to contact us at contact@lodgeek.com. We appreciate your prompt attention to this matter.`,
          `Best regards,`,
          `The Lodgeek Team`,
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
          currentRentReview.tenant,
          `Rent Review Request for ${currentRentalRecordProperty?.address}`,
          paragraphs.join(" \n"),
          generatedEmail
        ).then(() => {
          toast.success(
            `Review request sent to ${currentRentalRecordTenant?.firstName} ${currentRentalRecordTenant?.lastName}`
          );
        });

        navigate(
          `/dashboard/rentalRecords/${rentalRecordId}/rent-review/${newReview.id}`,
          {
            replace: true,
          }
        );
      })
      .finally(() => {
        setSubmittingReview(false);
      });
  };

  const updateReveiwFormDetails = (data: Partial<ReveiwFormDetails>) => {
    const updatedReveiwFormDetails: ReveiwFormDetails = {
      ...currentRentReview.reveiwFormDetails,
      ...data,
    };

    dispatch(
      updateCurrentRentReview({
        reveiwFormDetails: updatedReveiwFormDetails,
      })
    );
  };

  return (
    <div className="max-w-xl mt-5">
      <h2 className="font-semibold text-black text-xl flex gap-x-3 items-center">
        Rent Review Form
      </h2>
      <p className="text-sm font-medium text-coolGray-500 text-justify my-2">
        As you prepare to conduct rent reviews for your properties, please keep
        in mind key factors such as local tenancy law, current rent amount,
        lease agreement, comparable rental properties, and tenant payment
        history. These factors will help ensure an informed and fair
        decision-making process for both you and your tenants. For properties
        located in Lagos, please refer to the{" "}
        <a
          href="http://lagosministryofjustice.org/wp-content/uploads/2022/01/Tenancy-Law-2011.pdf"
          target="_blank"
          className="underline underline-offset-2 text-blue-500"
        >
          Lagos Tenancy Law <FontAwesomeIcon icon={faExternalLink} size="xs" />
        </a>{" "}
        for guidance.
      </p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="propertyAddress">Property Address:</label>
          <AppInput
            type="text"
            id="propertyAddress"
            defaultValue={currentRentReview.reveiwFormDetails.address}
            onChange={(e) =>
              updateReveiwFormDetails({ address: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label htmlFor="unitNumber">Unit Number:</label>
          <AppInput
            type="text"
            id="unitNumber"
            defaultValue={currentRentReview.reveiwFormDetails.unitNumber}
            onChange={(e) =>
              updateReveiwFormDetails({ unitNumber: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label htmlFor="tenantName">Tenant Name:</label>
          <AppInput
            type="text"
            id="tenantName"
            defaultValue={currentRentReview.reveiwFormDetails.tenantName}
            onChange={(e) =>
              updateReveiwFormDetails({ tenantName: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label htmlFor="currentRentAmount">Current Rent Amount:</label>
          <div className="mb-4 flex p-4 py-3 px-3 leading-5 w-full text-coolGray-400 font-normal border border-coolGray-200 outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-lg shadow-sm">
            <CurrencyInput
              id="currentRentAmount"
              name="currentRentAmount"
              placeholder="₦ 500,000.00"
              decimalsLimit={2}
              value={currentRentReview.reveiwFormDetails.currentRentAmount}
              required
              prefix="₦ "
              className="w-full outline-none leading-5 text-coolGray-400 font-normal border-none"
              contentEditable={false}
              disabled
            />
          </div>
        </div>
        <div>
          <label htmlFor="newRentAmount">New Rent Amount:</label>
          <div className="mb-4 flex p-4 py-3 px-3 leading-5 w-full text-coolGray-400 font-normal border border-coolGray-200 outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-lg shadow-sm">
            <CurrencyInput
              id="newRentAmount"
              name="newRentAmount"
              placeholder="₦ 500,000.00"
              decimalsLimit={2}
              onValueChange={(value) => {
                updateReveiwFormDetails({
                  newRentAmount: Number(value),
                });
              }}
              defaultValue={currentRentReview.reveiwFormDetails.newRentAmount}
              required
              prefix="₦ "
              className="w-full outline-none leading-5 text-coolGray-400 font-normal border-none"
            />
          </div>
        </div>
        <div>
          <label htmlFor="reviewDate">
            Review Date (effective date of the increase):
          </label>

          <div className="mb-4 flex p-4 py-3 px-3 leading-5 w-full text-coolGray-400 font-normal border border-coolGray-200 outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-lg shadow-sm">
            <select
              name="reviewDate"
              id="reviewDate"
              className="w-full outline-none leading-5 text-coolGray-400 font-normal border-none"
              onChange={(e) =>
                updateReveiwFormDetails({ reviewDate: Number(e.target.value) })
              }
              required
              defaultValue={currentRentReview.reveiwFormDetails.reviewDate}
            >
              <option selected>Select date</option>
              {nextFourDuePayments.map((i, index) => (
                <option key={index} value={i}>
                  {moment(i).format("LL")}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="reviewReason">Reason for Rent Review:</label>
          <AppInput
            type="text"
            id="reviewReason"
            defaultValue={currentRentReview.reveiwFormDetails.reasonForReview}
            onChange={(e) =>
              updateReveiwFormDetails({ reasonForReview: e.target.value })
            }
            required
            list="rentReviewReasons"
          />
          <datalist id="rentReviewReasons">
            <option value="Tenant request">Tenant request</option>
            <option value="Lease renewal">Lease renewal</option>
            <option value="Inflation">Inflation</option>
            <option value="Property improvements">Property improvements</option>
            <option value="Market conditions">Market conditions</option>
          </datalist>
        </div>
        <div>
          <label htmlFor="reviewNotes">Notes:</label>
          <div className="mb-4 flex p-4 py-3 px-3 leading-5 w-full text-coolGray-400 font-normal border border-coolGray-200 outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-lg shadow-sm">
            <textarea
              id="reviewNotes"
              defaultValue={currentRentReview.reveiwFormDetails.notes}
              className="w-full outline-none leading-5 text-coolGray-400 font-normal border-none"
              onChange={(e) =>
                updateReveiwFormDetails({ notes: e.target.value })
              }
            ></textarea>
          </div>
        </div>
        <button
          className="flex flex-wrap gap-x-3 items-center justify-center h-[45px] px-4 w-full text-base text-white font-medium disabled:bg-gray-400 disabled:cursor-not-allowed bg-green-500 hover:bg-green-600 rounded-md shadow-button"
          type="submit"
          disabled={submittingReview}
        >
          Submit {submittingReview && <ActivityIndicator size="4" />}
        </button>
      </form>
    </div>
  );
}
