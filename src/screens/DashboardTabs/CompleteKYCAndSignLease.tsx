import { faFileDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  RentalRecord,
  SignedTenancyAgreementStatusHelpText,
  SignedTenancyAgreementStatusType,
  UserKYC,
} from "../../models";
import { Alert, Card } from "antd";
import { useState } from "react";
import UploadSignedLease from "../../components/dashboard/UploadSignedLease";

export function CompleteKYCAndSignLease({
  setOpenKYCForm,
  currentUserKYC,
  currentRentalRecord,
}: {
  setOpenKYCForm: React.Dispatch<React.SetStateAction<boolean>>;
  currentUserKYC: UserKYC;
  currentRentalRecord: RentalRecord;
}) {
  const [openMModal, setOpenMModal] = useState(false);
  const statusHelpText =
    SignedTenancyAgreementStatusHelpText[
      currentRentalRecord.signedTenancyAgreementStatus
    ];
  const statusHelpType =
    SignedTenancyAgreementStatusType[
      currentRentalRecord.signedTenancyAgreementStatus
    ];
  return (
    <>
      <UploadSignedLease
        closeModal={() => {
          setOpenMModal(false);
        }}
        isModalOpen={openMModal}
      />
      <Card title="Complete your KYC and sign lease." className="mb-5">
        <Card
          type="inner"
          title="Tenant information"
          extra={
            <button
              onClick={() => {
                setOpenKYCForm(true);
              }}
              className="text-blue-500 text-xs"
            >
              {!currentUserKYC ? "Update" : "Review"} KYC
            </button>
          }
        >
          Please review your KYC details to ensure that all information is up to
          date. These details will be reused for this rental record as well as
          others.
        </Card>
        <Card
          style={{ marginTop: 16 }}
          type="inner"
          title="Lease Agreement"
          extra={
            <button
              onClick={() => {
                setOpenMModal(true);
              }}
              className="text-blue-500 text-xs"
            >
              {currentRentalRecord.signedTenancyAgreementFile
                ? "Update"
                : "Upload"}{" "}
              Signed lease
            </button>
          }
        >
          <h2 className="mb-2 font-semibold text-gray-900 dark:text-white">
            Please follow the steps below to download and sign the lease
            agreement:
          </h2>
          <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
            <li>Download the lease agreement form.</li>
            <li>Print out the form and sign it.</li>
            <li>Scan or take a clear photo of the signed lease agreement.</li>
            <li>
              Upload the scanned copy or photo of the signed lease agreement to
              the website.
            </li>
          </ul>
          <p>
            Once we receive the signed copy, we will verify it and update our
            records accordingly. Please note that your tenancy is not complete
            until we receive your signed copy of the lease agreement.
          </p>
          {currentRentalRecord.tenancyAgreementFile && (
            <a
              href={currentRentalRecord.tenancyAgreementFile}
              target="_blank"
              download="Lease agreement"
              className="text-blue-500 underline underline-offset-4 my-2 inline-block"
            >
              Download lease <FontAwesomeIcon icon={faFileDownload} />
            </a>
          )}
          <br />
          {currentRentalRecord.signedTenancyAgreementFile && (
            <>
              <a
                href={currentRentalRecord.signedTenancyAgreementFile}
                target="_blank"
                download="Lease agreement"
                className="text-blue-500 underline underline-offset-4 my-2 inline-block"
              >
                Download signed lease <FontAwesomeIcon icon={faFileDownload} />
              </a>
              <br />
            </>
          )}
          <br />
          <Alert
            message={currentRentalRecord.signedTenancyAgreementStatus}
            description={statusHelpText}
            type={statusHelpType}
            banner
            showIcon
          />
        </Card>
      </Card>
    </>
  );
}
