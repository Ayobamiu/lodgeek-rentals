import { faFileDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  SignedTenancyAgreementStatus,
  SignedTenancyAgreementStatusColor,
} from "../../models";
import { Card, Modal } from "antd";
import { useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { selectRentalRecord } from "../../app/features/rentalRecordSlice";
import useRentalRecords from "../../hooks/useRentalRecords";
import base64 from "base-64";
import { generateSimpleEmail } from "../../utils/generateSimpleEmail";
import { sendEmail } from "../../api/email";
import ActivityIndicator from "../../components/shared/ActivityIndicator";
import { toast } from "react-toastify";

export function VerifySignedLease() {
  const {
    currentRentalRecord,
    currentRentalRecordOwner,
    currentRentalRecordTenant,
  } = useAppSelector(selectRentalRecord);
  const { handleUpdateRentalRecord } = useRentalRecords();
  const [openMModal, setOpenMModal] = useState(false);
  const statusColor =
    SignedTenancyAgreementStatusColor[
      currentRentalRecord.signedTenancyAgreementStatus
    ];

  const [rejectingSignedLease, setRejectingSignedLease] = useState(false);
  const [verifyingLease, setVerifyingLease] = useState(false);

  const [reason, setReason] = useState("");

  const closeModal = () => {
    setOpenMModal(false);
  };
  return (
    <>
      <Modal
        title="Reject Signed Lease agreement"
        open={openMModal}
        onOk={closeModal}
        onCancel={closeModal}
        okButtonProps={{ className: "bg-blue-500" }}
        okText="Upload"
        footer={null}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            await rejectSignedLease();
          }}
        >
          <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
              <label htmlFor="comment" className="sr-only">
                Your comment
              </label>
              <textarea
                id="comment"
                rows={4}
                className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                placeholder="Write a comment..."
                required
                onChange={(e) => {
                  setReason(e.target.value);
                }}
              ></textarea>
            </div>
            <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
              <button
                type="submit"
                className="inline-flex gap-x-3 justify-center  items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-red-700 rounded-lg focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900 hover:bg-red-800"
              >
                Reject with comment{" "}
                {rejectingSignedLease && <ActivityIndicator size="4" />}
              </button>
            </div>
          </div>
        </form>
        <p className="ml-auto text-xs text-gray-500 dark:text-gray-400">
          Please provide the tenant with instructions on how to upload an
          acceptable copy.
        </p>
      </Modal>
      <Card title="Complete your KYC and sign lease." className="mb-5">
        <Card style={{ marginTop: 16 }} type="inner" title="Lease Agreement">
          <p>
            Please verify the signed copy of the lease agreement uploaded by the
            tenant. Click on the link in the box to access the document. Once
            you have reviewed it, please provide feedback to the tenant through
            the platform.
          </p>
          <a
            href={currentRentalRecord.tenancyAgreementFile}
            target="_blank"
            download="Lease agreement"
            className="text-blue-500 underline underline-offset-4 my-2 block"
          >
            Download signed lease <FontAwesomeIcon icon={faFileDownload} />
          </a>
          <br />
          <div className="flex">
            <button
              type="button"
              disabled={verifyingLease}
              onClick={acceptSignedLease}
              className="text-xs focus:outline-none  flex gap-x-3 items-center justify-center disabled:bg-gray-500 disabled:cursor-not-allowed text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Accept {verifyingLease && <ActivityIndicator size="4" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpenMModal(true);
              }}
              disabled={rejectingSignedLease}
              className="text-xs focus:outline-none flex gap-x-3 items-center justify-center disabled:bg-gray-500 disabled:cursor-not-allowed  text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            >
              Reject {rejectingSignedLease && <ActivityIndicator size="4" />}
            </button>
          </div>
          <br />
          <span
            className={`inline-flex items-center bg-${statusColor}-100 text-${statusColor}-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-${statusColor}-900 dark:text-${statusColor}-300`}
          >
            <span
              className={`w-2 h-2 mr-1 bg-${statusColor}-500 rounded-full`}
            ></span>
            {currentRentalRecord.signedTenancyAgreementStatus}
          </span>
        </Card>
      </Card>
    </>
  );

  async function acceptSignedLease() {
    setVerifyingLease(true);
    await handleUpdateRentalRecord({
      ...currentRentalRecord,
      signedTenancyAgreementStatus: SignedTenancyAgreementStatus.verified,
      status: "inviteAccepted",
      tenantAgreed: true,
      tenantAgreedOn: Date.now(),
    })
      .then(async () => {
        const redirectURL = `/dashboard/rentalRecords/${currentRentalRecord.id}`;
        const encodedRedirectUrl = base64.encode(redirectURL);
        const rentalRecordLink = `${process.env.REACT_APP_BASE_URL}/dashboard/rentalRecords/${currentRentalRecord.id}?redirect=${encodedRedirectUrl}`;
        const emailSubjectForTenant = "Verification of Signed Lease Agreement";
        const paragraphs = [
          `Dear ${currentRentalRecordTenant?.firstName}`,
          `I am pleased to inform you that we have successfully verified your signed lease agreement. Your tenancy agreement is now in effect and you can proceed to pay rent.`,
          `Thank you for taking the time to upload and submit your signed lease agreement. If you have any questions or concerns regarding your tenancy, please feel free to contact us.`,
          `Best regards,`,
          `${currentRentalRecordOwner?.firstName} ${currentRentalRecordOwner?.lastName}`,
        ];

        const emailText = generateSimpleEmail({
          paragraphs,
          buttons: [{ text: "Rental page", link: rentalRecordLink }],
        });

        await sendEmail(
          currentRentalRecord.tenant,
          emailSubjectForTenant,
          paragraphs.join(" \n"),
          emailText
        );
        toast.success("Tenant has been notified.");
      })
      .finally(() => {
        setVerifyingLease(false);
      });
  }
  async function rejectSignedLease() {
    setRejectingSignedLease(true);
    await handleUpdateRentalRecord({
      ...currentRentalRecord,
      signedTenancyAgreementStatus: SignedTenancyAgreementStatus.rejected,
      reasonToRejectSignedTenancyAgreement: reason,
    })
      .then(async () => {
        const redirectURL = `/dashboard/rentalRecords/${currentRentalRecord.id}`;
        const encodedRedirectUrl = base64.encode(redirectURL);
        const rentalRecordLink = `${process.env.REACT_APP_BASE_URL}/dashboard/rentalRecords/${currentRentalRecord.id}?redirect=${encodedRedirectUrl}`;
        const emailSubjectForTenant =
          "Instructions for Uploading Acceptable Copy of Signed Lease Agreement";
        const paragraphs = [
          `Dear ${currentRentalRecordTenant?.firstName}`,
          `We regret to inform you that your signed lease document has been rejected. Please find below the reason(s) for the rejection:`,
          `${reason}`,
          `To proceed, kindly follow the instructions below to upload an acceptable copy of the signed lease document:`,
          `1. Log in to your account on the rental portal.`,
          `2. Go to the section for uploading the signed lease document.`,
          `3. Ensure that the document is in one of the acceptable formats, which includes JPEG, PNG, and PDF.`,
          `4. Make sure that the document is complete, legible, and signed.`,
          `5. Upload the new document and click on the submit button.`,
          `6. Once we receive the new document, we will review it and provide feedback within 48 hours.`,
          `If you have any questions or require further assistance, please do not hesitate to contact us.`,
          `Best regards,`,
          `${currentRentalRecordOwner?.firstName} ${currentRentalRecordOwner?.lastName}`,
        ];

        const emailText = generateSimpleEmail({
          paragraphs,
          buttons: [{ text: "Rental page", link: rentalRecordLink }],
        });

        await sendEmail(
          currentRentalRecord.tenant,
          emailSubjectForTenant,
          paragraphs.join(" \n"),
          emailText
        );
        toast.success("Tenant has been notified.");
        closeModal();
      })
      .finally(() => {
        setRejectingSignedLease(false);
      });
  }
}
