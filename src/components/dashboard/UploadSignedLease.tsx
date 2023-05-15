import React, { useState } from "react";
import { Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExternalLink,
  faFolderOpen,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import ActivityIndicator from "../shared/ActivityIndicator";
import { UploadPhotoAsync } from "../../firebase/storage_upload_blob";
import { toast } from "react-toastify";
import useRentalRecords from "../../hooks/useRentalRecords";
import { useAppSelector } from "../../app/hooks";
import { selectRentalRecord } from "../../app/features/rentalRecordSlice";
import base64 from "base-64";
import { generateSimpleEmail } from "../../utils/generateSimpleEmail";
import { sendEmail } from "../../api/email";
import { SignedTenancyAgreementStatus } from "../../models";
import { sendWebNotification } from "../../api/webNotification";

const UploadSignedLease = ({
  closeModal,
  isModalOpen,
}: {
  closeModal: () => void;
  isModalOpen: boolean;
}) => {
  const {
    currentRentalRecord,
    currentRentalRecordCompany,
    currentRentalRecordProperty,
    currentRentalRecordTenant,
  } = useAppSelector(selectRentalRecord);
  const { handleUpdateRentalRecord } = useRentalRecords();
  const handleOk = () => {
    closeModal();
  };

  const handleCancel = () => {
    closeModal();
  };
  const [signedTenancyAgreementFile, setSignedTenancyAgreementFile] =
    useState("");

  const [uploadingTenancy, setUploadingTenancy] = useState(false);
  const [uploadingSignedLease, setUploadingSignedLease] = useState(false);
  const handleUploadTenancy = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.length) {
      const fileUploaded = e.target.files[0];
      setUploadingTenancy(true);
      const url = await UploadPhotoAsync(
        `/rentdocs/${Date.now()}-${fileUploaded.name}`,
        fileUploaded
      )
        .finally(() => {
          setUploadingTenancy(false);
        })
        .catch(() => {
          toast.error("Error uploading file.");
        });

      if (url) {
        setSignedTenancyAgreementFile(url);
      }
    }
  };

  const handleUploadSignedLease = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setUploadingSignedLease(true);
    await handleUpdateRentalRecord({
      ...currentRentalRecord,
      signedTenancyAgreementFile,
      tenancyAgreementFileSignedOn: Date.now(),
      signedTenancyAgreementStatus: SignedTenancyAgreementStatus["underReview"],
    })
      .then(async () => {
        const redirectURL = `/dashboard/rentalRecords/${currentRentalRecord.id}`;
        const encodedRedirectUrl = base64.encode(redirectURL);
        const rentalRecordLink = `${process.env.REACT_APP_BASE_URL}/dashboard/rentalRecords/${currentRentalRecord.id}?redirect=${encodedRedirectUrl}`;
        const emailSubjectForTenant = "Signed Lease Agreement Uploaded";
        const paragraphs = [
          `Dear ${currentRentalRecordCompany?.name}`,
          `I hope this email finds you well. I wanted to inform you that ${currentRentalRecordTenant?.firstName} ${currentRentalRecordTenant?.lastName} has uploaded a signed copy of the lease agreement for ${currentRentalRecordProperty?.address}. You can find the document on the <a href="${rentalRecordLink}">rental page</a>.`,
          `Please take a moment to verify the information and ensure that everything is in order. If you have any questions or concerns, please do not hesitate to contact us.`,
          `Thank you for your attention to this matter.`,
          `Best regards,`,
          `Lodgeek Admin`,
        ];

        const emailText = generateSimpleEmail({
          paragraphs,
          buttons: [{ text: "Rental page", link: rentalRecordLink }],
        });

        await sendEmail(
          currentRentalRecord.owner,
          emailSubjectForTenant,
          paragraphs.join(" \n"),
          emailText
        );
        sendWebNotification({
          title: emailSubjectForTenant,
          description: `${currentRentalRecordTenant?.firstName} ${currentRentalRecordTenant?.lastName} has uploaded a signed copy of the lease agreement for ${currentRentalRecordProperty?.address}.`,
          recipientIDs: [currentRentalRecord.owner],
          icon: currentRentalRecordTenant?.photoURL || "",
          link: rentalRecordLink,
        });
        closeModal();
      })
      .finally(() => {
        setUploadingSignedLease(false);
      });
  };

  return (
    <>
      <Modal
        title="Upload Signed Lease agreement"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ className: "bg-blue-500" }}
        okText="Upload"
        footer={null}
      >
        <form onSubmit={handleUploadSignedLease}>
          <label
            className=" mb-2 text-sm font-medium text-gray-900 dark:text-white"
            htmlFor="file_input"
          >
            {signedTenancyAgreementFile ? (
              <small className="text-grey-500 underline underline-offset-4">
                Change file <FontAwesomeIcon icon={faFolderOpen} />
              </small>
            ) : (
              <div className=" flex gap-x-3 items-center">
                Choose file{" "}
                {signedTenancyAgreementFile && (
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500"
                  />
                )}
                {uploadingTenancy && <ActivityIndicator size="4" />}
              </div>
            )}
          </label>
          <input
            accept="image/jpeg,image/png,application/pdf"
            className={`block ${
              signedTenancyAgreementFile ? "w-0 h-0" : "w-full"
            } text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400`}
            aria-describedby="file_input_help"
            id="file_input"
            type="file"
            onChange={handleUploadTenancy}
            required
          />
          {signedTenancyAgreementFile && (
            <div className="mb-3">
              <div className="flex items-center">
                <small className="flex items-center gap-x-3">
                  <a
                    href={signedTenancyAgreementFile}
                    className="text-blue-500 underline underline-offset-4"
                    target="_blank"
                  >
                    Signed Lease Agreement{" "}
                    <FontAwesomeIcon icon={faExternalLink} />
                  </a>
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    title="Delete Lease Agreement file"
                    className="text-red-500 cursor-pointer"
                    onClick={() => {
                      setSignedTenancyAgreementFile("");
                    }}
                  />
                </small>
              </div>
            </div>
          )}
          <p
            className="mt-1 text-sm text-gray-500 dark:text-gray-300"
            id="file_input_help"
          >
            You can upload image files like JPEG and PNG, as well as documents
            in PDF format.
          </p>
          <button
            type="submit"
            disabled={uploadingSignedLease}
            className="w-full disabled:bg-gray-500 disabled:cursor-progress flex gap-x-3 items-center justify-center text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 my-3"
          >
            Submit {uploadingSignedLease && <ActivityIndicator size="4" />}
          </button>
        </form>
      </Modal>
    </>
  );
};

export default UploadSignedLease;
