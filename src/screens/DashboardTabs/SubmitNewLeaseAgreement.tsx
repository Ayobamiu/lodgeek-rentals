import {
  faCheckCircle,
  faExternalLink,
  faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import {
  selectRentReview,
  updateCurrentRentReview,
} from "../../app/features/rentReviewSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ActivityIndicator from "../../components/shared/ActivityIndicator";
import { UploadPhotoAsync } from "../../firebase/storage_upload_blob";
import {
  Rent,
  RentReview,
  RentReviewRecord,
  RentReviewStatus,
} from "../../models";
import { updateRentReviewInDatabase } from "../../firebase/apis/rentReview";
import useRentalRecords from "../../hooks/useRentalRecords";
import {
  selectRentalRecord,
  setCurrentRentalRecordRents,
} from "../../app/features/rentalRecordSlice";
import formatPrice from "../../utils/formatPrice";
import moment from "moment";
import { generateSimpleEmail } from "../../utils/generateSimpleEmail";
import { sendEmail } from "../../api/email";
import { collection, doc, writeBatch } from "firebase/firestore";
import { db, RENT_PATH } from "../../firebase/config";

export function SubmitNewLeaseAgreement() {
  const [acceptingIncrease, setAcceptingIncrease] = useState(false);
  const [uploadingRentIncreaseNotice, setUploadingRentIncreaseNotice] =
    useState(false);
  const [uploadingLease, setUploadingLease] = useState(false);
  const dispatch = useAppDispatch();
  const { currentRentReview } = useAppSelector(selectRentReview);
  const {
    currentRentalRecord,
    currentRentalRecordTenant,
    currentRentalRecordOwner,
    currentRentalRecordRents,
  } = useAppSelector(selectRentalRecord);
  const { handleUpdateRentalRecord } = useRentalRecords();

  const handleUploadRentIncrease = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.length) {
      const fileUploaded = e.target.files[0];
      setUploadingRentIncreaseNotice(true);
      const url = await UploadPhotoAsync(
        `/rentdocs/${Date.now()}-${fileUploaded.name}`,
        fileUploaded
      )
        .finally(() => {
          setUploadingRentIncreaseNotice(false);
        })
        .catch(() => {
          toast.error("Error uploading file.");
        });

      if (url) {
        dispatch(
          updateCurrentRentReview({
            rentIncreaseNotice: url,
          })
        );
      }
    }
  };

  const handleUploadLeaseAgreement = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.length) {
      const fileUploaded = e.target.files[0];
      setUploadingLease(true);
      const url = await UploadPhotoAsync(
        `/rentdocs/${Date.now()}-${fileUploaded.name}`,
        fileUploaded
      )
        .finally(() => {
          setUploadingLease(false);
        })
        .catch(() => {
          toast.error("Error uploading file.");
        });

      if (url) {
        dispatch(
          updateCurrentRentReview({
            leaseAgreement: url,
          })
        );
      }
    }
  };
  /**
   * Updates rents with the newRentAmount
   */
  async function updateRentFees() {
    const rentBatch = writeBatch(db);

    //Change rent amount on all rent after reviewDate
    const rentsAfterReviewDate = currentRentalRecordRents.filter((i) =>
      moment(i.dueDate).isSameOrAfter(
        currentRentReview.reveiwFormDetails.reviewDate,
        "day"
      )
    );

    //Update rents fees to newRentAmount
    const rentsWithUpdatedFees = rentsAfterReviewDate.map((rentdoc) => {
      const rentData: Rent = {
        ...rentdoc,
        rent: currentRentReview.reveiwFormDetails.newRentAmount,
      };
      return rentData;
    });

    rentsWithUpdatedFees.forEach((rentdoc) => {
      var docRef = doc(collection(db, RENT_PATH), rentdoc.id);
      rentBatch.update(docRef, rentdoc);
    });

    rentBatch.commit().then(() => {
      const updatedRents = currentRentalRecordRents.map(
        (rentWithOriginalRentFees) => {
          const rentWithUpdatedRentFees = rentsWithUpdatedFees.find(
            (x) => x.id === rentWithOriginalRentFees.id
          );
          if (rentWithUpdatedRentFees) {
            return rentWithUpdatedRentFees;
          } else {
            return rentWithOriginalRentFees;
          }
        }
      );
      dispatch(setCurrentRentalRecordRents(updatedRents));
    });
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const rentReviewRecord: RentReviewRecord = {
      id: currentRentReview.id,
      leaseAgreement: currentRentReview.leaseAgreement,
      currentRentAmount: currentRentReview.reveiwFormDetails.currentRentAmount,
      dateSubmitted: Date.now(),
      effectDate: currentRentReview.reveiwFormDetails.reviewDate,
      newRentAmount: currentRentReview.reveiwFormDetails.newRentAmount,
      reasonForReview: currentRentReview.reveiwFormDetails.reasonForReview,
      rentIncreaseNotice: currentRentReview.rentIncreaseNotice,
      reviewDate: Date.now(),
      notes: currentRentReview.reveiwFormDetails.notes,
    };

    const updatedCurrentRentReview: RentReview = {
      ...currentRentReview,
      status: RentReviewStatus.increaseAccepted,
      acceptedOn: Date.now(),
    };
    setAcceptingIncrease(true);
    await updateRentReviewInDatabase(updatedCurrentRentReview).then(() => {
      dispatch(
        updateCurrentRentReview({
          status: RentReviewStatus.increaseAccepted,
          acceptedOn: Date.now(),
        })
      );
    });
    const rentReviews: RentReviewRecord[] = [
      ...(currentRentalRecord.rentReviews || []),
      rentReviewRecord,
    ];

    const paragraphs = [
      `Dear ${currentRentalRecordTenant?.firstName} ${currentRentalRecordTenant?.lastName},`,
      `We hope this email finds you well. We want to inform you that your rent will be increasing due to ${currentRentReview.reveiwFormDetails.reasonForReview}. Please note that this decision was made after careful consideration of various factors such as local tenancy laws, comparable rental properties, tenant payment history, and lease agreements.`,
      `We understand that rent increases can be challenging, but we assure you that we have done our best to keep the increase as reasonable as possible. The new rental price will be ${formatPrice(
        currentRentReview.reveiwFormDetails.newRentAmount
      )} per ${currentRentalRecord.rentPer}, effective from ${moment(
        currentRentReview.reveiwFormDetails.reviewDate
      ).format("ll")}.`,
      `Attached to this email, you will find a Rent Increase Notice and a new Lease Agreement. Please review these documents carefully and let us know if you have any questions or concerns.`,
      `Thank you for your prompt attention to this matter.`,
      `Best regards,`,
      `${currentRentalRecordOwner?.firstName} ${currentRentalRecordOwner?.lastName}`,
    ];

    const generatedEmail = generateSimpleEmail({
      paragraphs,
    });

    await sendEmail(
      currentRentReview.tenant,
      `Rent Increase Notice`,
      paragraphs.join(" \n"),
      generatedEmail,
      [
        {
          path: currentRentReview.leaseAgreement,
          filename: "Lease Agreement.pdf",
        },
        {
          path: currentRentReview.rentIncreaseNotice,
          filename: "Rent Increase Notice.pdf",
        },
      ]
    );

    await updateRentFees();

    await handleUpdateRentalRecord({
      ...currentRentalRecord,
      rentReviews,
      rent: currentRentReview.reveiwFormDetails.newRentAmount,
    }).finally(() => {
      setAcceptingIncrease(false);
    });
  };

  return (
    <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 my-5">
      <form className="space-y-6" onSubmit={onSubmit}>
        <h5 className="text-xl font-medium text-gray-900 dark:text-white">
          Upload rent increase notice and a new lease agreement.
        </h5>
        <div>
          <label
            className="flex items-center gap-x-3 text-sm font-medium text-gray-900 dark:text-white"
            htmlFor="rentIncreaseNotice"
          >
            Upload Rent increase notice file{" "}
            {currentRentReview.rentIncreaseNotice && (
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-500"
              />
            )}
            {uploadingRentIncreaseNotice && <ActivityIndicator size="4" />}
          </label>
          <input
            className={`${
              currentRentReview.rentIncreaseNotice ? "w-0 h-0" : "block w-full"
            } text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400`}
            id="rentIncreaseNotice"
            type="file"
            required
            accept="application/pdf"
            defaultValue={currentRentReview.rentIncreaseNotice}
            onChange={handleUploadRentIncrease}
            disabled={uploadingRentIncreaseNotice}
          />
          {currentRentReview.rentIncreaseNotice && (
            <small className="text-grey-500 underline underline-offset-4">
              Change file <FontAwesomeIcon icon={faFolderOpen} />
            </small>
          )}
          <div className="flex items-center">
            {currentRentReview.rentIncreaseNotice && (
              <small>
                <a
                  href={currentRentReview.rentIncreaseNotice}
                  className="text-blue-500 underline underline-offset-4"
                  target="_blank"
                >
                  Rent Increase Notice <FontAwesomeIcon icon={faExternalLink} />
                </a>
              </small>
            )}
          </div>
          <p
            className="mt-1 text-sm text-gray-500 dark:text-gray-300"
            id="rentIncreaseNotice_help"
          >
            Only PDF format
          </p>
        </div>
        <div>
          <label
            className="flex items-center gap-x-3 text-sm font-medium text-gray-900 dark:text-white"
            htmlFor="leaseAgreement"
          >
            Upload new lease agreement file{" "}
            {currentRentReview.leaseAgreement && (
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-500"
              />
            )}
            {uploadingLease && <ActivityIndicator size="4" />}
          </label>
          <input
            className={`${
              currentRentReview.leaseAgreement ? "w-0 h-0" : "block w-full"
            } text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400`}
            id="leaseAgreement"
            type="file"
            required
            defaultValue={currentRentReview.leaseAgreement}
            accept="application/pdf"
            onChange={handleUploadLeaseAgreement}
            disabled={uploadingLease}
          />
          {currentRentReview.leaseAgreement && (
            <small className="text-grey-500 underline underline-offset-4">
              Change file <FontAwesomeIcon icon={faFolderOpen} />
            </small>
          )}
          <div className="flex items-center">
            {currentRentReview.leaseAgreement && (
              <small>
                <a
                  href={currentRentReview.leaseAgreement}
                  className="text-blue-500 underline underline-offset-4"
                  target="_blank"
                >
                  Lease Agreement <FontAwesomeIcon icon={faExternalLink} />
                </a>
              </small>
            )}
          </div>
          <p
            className="mt-1 text-sm text-gray-500 dark:text-gray-300"
            id="leaseAgreement_help"
          >
            Only PDF format
          </p>
        </div>

        <button
          type="submit"
          disabled={acceptingIncrease}
          className="w-full flex gap-x-3 items-center justify-center text-white bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Proceed {acceptingIncrease && <ActivityIndicator size="4" />}
        </button>
      </form>
    </div>
  );
}
