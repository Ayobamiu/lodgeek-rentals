import {
  faExternalLink,
  faFileDownload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { selectRentalRecord } from "../../app/features/rentalRecordSlice";
import { useAppSelector } from "../../app/hooks";
import { KYCPreview } from "../../components/shared/KYCPreview";
import { SignedAgreementPreview } from "../../components/shared/SignedAgreementPreview";

export function RentalRecordDocuments() {
  const {
    currentRentalRecord,
    currentRentalRecordProperty,
    currentRentalRecordOwner,
    currentRentalRecordTenant,
  } = useAppSelector(selectRentalRecord);

  const ownerFullName = currentRentalRecordOwner
    ? `${currentRentalRecordOwner?.firstName || "-"} ${
        currentRentalRecordOwner?.lastName || "-"
      }`
    : currentRentalRecord?.owner;

  const tenantFullName = currentRentalRecordTenant
    ? `${currentRentalRecordTenant?.firstName || "-"} ${
        currentRentalRecordTenant?.lastName || "-"
      }`
    : currentRentalRecord?.tenant;

  const [showKYCPreview, setShowKYCPreview] = useState(false);
  const [showSignedAgreement, setShowSignedAgreement] = useState(false);

  return (
    <>
      {currentRentalRecord?.userKYC && currentRentalRecordProperty && (
        <div className="mb-5">
          <button
            onClick={() => {
              setShowKYCPreview(true);
            }}
            className="text-blue-500 underline underline-offset-4"
          >
            View tenant's KYC <FontAwesomeIcon icon={faExternalLink} />
          </button>
        </div>
      )}
      {currentRentalRecord?.userKYC && currentRentalRecordProperty && (
        <div className="mb-5">
          <button
            onClick={() => {
              setShowSignedAgreement(true);
            }}
            className="text-blue-500 underline underline-offset-4"
          >
            View signed agreement <FontAwesomeIcon icon={faExternalLink} />
          </button>
        </div>
      )}
      {currentRentalRecord?.signedTenancyAgreementFile && (
        <div className="mb-5">
          <a
            href={currentRentalRecord.signedTenancyAgreementFile}
            target="_blank"
            download="Lease agreement"
            className="text-blue-500 underline underline-offset-4 my-2 block"
          >
            Download signed lease <FontAwesomeIcon icon={faFileDownload} />
          </a>
        </div>
      )}

      {currentRentalRecord?.userKYC && currentRentalRecordProperty && (
        <KYCPreview
          openAgreementForm={showKYCPreview}
          setOpenAgreementForm={setShowKYCPreview}
          rentalRecordData={currentRentalRecord}
          userKYC={currentRentalRecord?.userKYC}
          tenantFullName={tenantFullName || ""}
          property={currentRentalRecordProperty}
          ownerFullName={ownerFullName || ""}
        />
      )}
      {currentRentalRecord?.userKYC && currentRentalRecordProperty && (
        <SignedAgreementPreview
          openAgreementForm={showSignedAgreement}
          setOpenAgreementForm={setShowSignedAgreement}
          rentalRecordData={currentRentalRecord}
          userKYC={currentRentalRecord?.userKYC}
          tenantFullName={tenantFullName || ""}
          property={currentRentalRecordProperty}
          ownerFullName={ownerFullName || ""}
        />
      )}
    </>
  );
}
