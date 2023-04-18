import {
  faExternalLink,
  faFileDownload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { selectUser } from "../../app/features/userSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ActivityIndicator from "../../components/shared/ActivityIndicator";
import useRentalRecords from "../../hooks/useRentalRecords";
import {
  AdditionalFee,
  RentalRecord,
  SignedTenancyAgreementStatus,
  UserKYC,
} from "../../models";
import { sendEmail } from "../../api/email";
import { generateSimpleEmail } from "../../utils/generateSimpleEmail";
import { AcceptInvitationForm } from "./AcceptInvitationForm";
import { KYCPreview } from "../../components/shared/KYCPreview";
import FullScreenActivityIndicator from "../../components/shared/FullScreenActivityIndicator";
import DashboardWrapper from "../../components/dashboard/DashboardWrapper";
import { setNotification } from "../../app/features/notificationSlice";
import { RentalRecordCollaboration } from "../../components/dashboard/RentalRecordCollaboration";
import {
  selectRentalRecord,
  selectUserKYC,
  setCurrentRentalRecord,
} from "../../app/features/rentalRecordSlice";
import useCurrentRentalRecord from "../../hooks/useCurrentRentalRecord";
import { ReviewsOnRentalRecord } from "./ReviewsOnRentalRecord";
import { UpaidRents } from "./UpaidRents";
import { PaidRents } from "./PaidRents";
import {
  selectRent,
  setOpenRentPayment,
  setSelectedAdditionalFees,
} from "../../app/features/rentSlice";
import { AdditionalFees } from "./AdditionalFees";
import { RentInvoiceTable } from "./RentInvoiceTable";
import { RentalRecordSimpleDetails } from "./RentalRecordSimpleDetails";
import { SignedAgreementPreview } from "../../components/shared/SignedAgreementPreview";
import { UserKYCForm } from "./UserKYCForm";
import { CompleteKYCAndSignLease } from "./CompleteKYCAndSignLease";
import { VerifySignedLease } from "./VerifySignedLease";

export default function RentalRecordDetails() {
  const { handleUpdateRentalRecord, sendEmailInvitationToTenant } =
    useRentalRecords();

  const dispatch = useAppDispatch();

  const loggedInUser = useAppSelector(selectUser);
  const { selectedRents, selectedAdditionalFees } = useAppSelector(selectRent);
  const currentUserKYC = useAppSelector(selectUserKYC);

  const {
    currentRentalRecord,
    currentRentalRecordCompany,
    currentRentalRecordProperty,
    currentRentalRecordOwner,
    currentRentalRecordTenant,
  } = useAppSelector(selectRentalRecord);

  const { loadingRentalRecord } = useCurrentRentalRecord();

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

  const updateSelectedAdditionalFees = (value: AdditionalFee[]) => {
    dispatch(setSelectedAdditionalFees(value));
  };

  useEffect(() => {
    const feesToPay = [...(currentRentalRecord?.fees || [])].filter(
      (i) => i.feeIsRequired && !i.paid
    );
    updateSelectedAdditionalFees(feesToPay);
  }, [currentRentalRecord]);

  useEffect(() => {
    if (!selectedRents.length) {
      dispatch(setOpenRentPayment(false));
    }
  }, [selectedRents]);

  const payRent = () => {
    if (!currentRentalRecordCompany) {
      return dispatch(
        setNotification({
          type: "default",
          title: `Rent and fees payment are disabled for now.`,
          description:
            "Contact us to enable payment. Email: contact@lodgeek.com",
          buttons: [
            {
              text: "Contact Admin on WhatsApp",
              onClick: () => {},
              type: "link",
              link: "https://wa.me/message/NDRVMWGUHUGVI1",
            },
            {
              text: "Send Email",
              type: "link",
              link: "mailto:contact@lodgeek.com",
            },
          ],
        })
      );
    }
    if (!selectedRents.length && !selectedAdditionalFees.length) {
      return toast.warn("Select Rents or Fee to pay for.");
    }

    dispatch(setOpenRentPayment(true));
  };

  const [updatingRents, setUpdatingRents] = useState(false);

  const PayRentButton = () => {
    const unpaidFees = currentRentalRecord?.fees?.filter((i) => !i.paid) || [];
    return (
      <button
        onClick={payRent}
        className="flex flex-wrap items-center justify-center py-3 px-4 w-full text-base text-white font-medium bg-green-500 hover:bg-green-600 rounded-md shadow-button"
      >
        <span>
          Pay Rent
          {unpaidFees.length ? " and Fees" : ""}
        </span>
      </button>
    );
  };

  const [acceptingInvite, setAcceptingInvite] = useState(false);
  const [openAgreementForm, setOpenAgreementForm] = useState(false);

  const acceptInvitation = async (userKYC: UserKYC) => {
    if (!userKYC) return toast.error("You need to complete your KYC.");
    if (!currentRentalRecord) return toast.error("Error Accepting Invite");
    setAcceptingInvite(true);
    const agreeedRecord: RentalRecord = {
      ...currentRentalRecord,
      status: "inviteAccepted",
      tenantAgreed: true,
      userKYC,
      tenantAgreedOn: Date.now(),
    };

    await handleUpdateRentalRecord(agreeedRecord)
      .then(async () => {
        const rentalRecordLink = `${process.env.REACT_APP_BASE_URL}dashboard/rentalRecords/${currentRentalRecord.id}`;
        const email = generateSimpleEmail({
          paragraphs: [
            `Click on the link below to manage your rent at ${currentRentalRecordProperty?.title}.`,
          ],
          buttons: [{ text: "View details", link: rentalRecordLink }],
        });
        await sendEmail(
          currentRentalRecord.owner,
          `${loggedInUser?.firstName} ${loggedInUser?.lastName} accepted your invitation to manage rent for ${currentRentalRecordProperty?.title}`,
          `Click on the link below to manage your rent at ${currentRentalRecordProperty?.title}.\n ${rentalRecordLink}`,
          email
        );
        dispatch(setCurrentRentalRecord(agreeedRecord));

        toast.success("Invite Accepted, you can now proceed to pay rents.");
      })
      .catch(() => {
        toast.error("Error Accepting Invite, try again.");
      })
      .finally(() => {
        setAcceptingInvite(false);
      });
  };

  const AcceptInvitationButton = () => {
    return (
      <button
        onClick={() => setOpenAgreementForm(true)}
        disabled={acceptingInvite}
        className="flex flex-wrap items-center justify-center py-3 px-4 w-full text-base text-white font-medium bg-green-500 hover:bg-green-600 rounded-md shadow-button"
      >
        {acceptingInvite ? (
          <ActivityIndicator />
        ) : (
          <span>Accept Invitation</span>
        )}
      </button>
    );
  };

  const EmailTenantButton = () => {
    return (
      <a
        href={`mailto:${currentRentalRecord?.tenant}`}
        className="flex flex-wrap items-center justify-center py-3 px-4 w-full text-base text-white font-medium bg-green-500 hover:bg-green-600 rounded-md shadow-button"
      >
        <span>Email Tenant</span>
      </a>
    );
  };

  const [resendingInvite, setResendingInvite] = useState(false);
  const ResendInviteButton = () => {
    return (
      <button
        onClick={async () => {
          if (loggedInUser && currentRentalRecord) {
            setResendingInvite(true);
            await sendEmailInvitationToTenant({
              loggedInUser,
              rentalRecordData: currentRentalRecord,
              property: currentRentalRecordProperty,
            }).finally(() => {
              setResendingInvite(false);
            });
          }
        }}
        className="flex flex-wrap items-center justify-center py-3 px-4 w-full text-base text-white font-medium bg-green-500 hover:bg-green-600 rounded-md shadow-button"
      >
        {resendingInvite ? <ActivityIndicator /> : <span>Resend Invite</span>}
      </button>
    );
  };

  const showPayRentButton =
    currentRentalRecord?.status === "inviteAccepted" &&
    loggedInUser?.email === currentRentalRecord.tenant;
  const showAcceptInvitationButton =
    currentRentalRecord?.status === "inviteSent" &&
    loggedInUser?.email === currentRentalRecord.tenant;
  const showResendInviteButton =
    currentRentalRecord?.status === "inviteSent" &&
    loggedInUser?.email === currentRentalRecord.owner;
  const showEmailTenantButton =
    currentRentalRecord?.status === "inviteAccepted" &&
    loggedInUser?.email === currentRentalRecord.owner;

  useEffect(() => {
    if (!selectedRents.length) {
      dispatch(setOpenRentPayment(false));
    }
  }, [selectedRents]);

  const [showKYCPreview, setShowKYCPreview] = useState(false);
  const [showSignedAgreement, setShowSignedAgreement] = useState(false);
  const [openKYCForm, setOpenKYCForm] = useState(false);
  const [showReviewSignedLeaseBox, setShowReviewSignedLeaseBox] =
    useState(false);

  return (
    <DashboardWrapper>
      <div>
        {updatingRents && <FullScreenActivityIndicator />}

        <UserKYCForm
          open={openKYCForm}
          closeForm={() => {
            setOpenKYCForm(false);
          }}
        />
        {/* Rent Invoice Table */}
        <RentInvoiceTable />
        {/* Rent Invoice Table */}
        {/* KYC and Agreement form */}
        {currentRentalRecord && (
          <AcceptInvitationForm
            openAgreementForm={openAgreementForm}
            setOpenAgreementForm={setOpenAgreementForm}
            rentalRecordData={currentRentalRecord}
            acceptInvitation={acceptInvitation}
          />
        )}
        {/* KYC and Agreement form */}
        <section className="container mx-auto bg-white p-8 border-b print:hidden relative">
          <div className="flex flex-wrap items-center -m-2">
            <div className="w-full md:w-1/2 p-2">
              <div className="flex flex-wrap items-center -m-2">
                <div className="flex-1 p-2">
                  <h2 className="font-semibold text-black text-3xl">
                    {currentRentalRecordProperty?.title || "Rental Record"}
                  </h2>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 p-2">
              <div className="flex flex-wrap justify-end -m-2 items-center">
                <div className="w-full md:w-auto p-2"></div>
                <div className="w-full md:w-auto p-2">
                  {showPayRentButton && <PayRentButton />}
                  {showAcceptInvitationButton && <AcceptInvitationButton />}
                  {showEmailTenantButton && <EmailTenantButton />}
                  {showResendInviteButton && <ResendInviteButton />}
                </div>
                <div className="w-full md:w-auto p-2">
                  <RentalRecordCollaboration />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto lg:p-8 p-3 print:hidden">
          {loadingRentalRecord && <ActivityIndicator color="black" />}

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
          {showAcceptInvitationButton && (
            <CompleteKYCAndSignLease
              setOpenKYCForm={setOpenKYCForm}
              currentUserKYC={currentUserKYC}
              setOpenAgreementForm={setOpenAgreementForm}
              currentRentalRecord={currentRentalRecord}
            />
          )}

          {showResendInviteButton &&
            currentRentalRecord.signedTenancyAgreementFile &&
            [
              SignedTenancyAgreementStatus.underReview,
              SignedTenancyAgreementStatus.rejected,
            ].includes(currentRentalRecord.signedTenancyAgreementStatus) && (
              <VerifySignedLease />
            )}

          <RentalRecordSimpleDetails />
          <PaidRents showPayRentButton={showPayRentButton} />
          <UpaidRents showPayRentButton={showPayRentButton} />
          <AdditionalFees showPayRentButton={showPayRentButton} />
          <ReviewsOnRentalRecord />
        </div>
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
      </div>
    </DashboardWrapper>
  );
}
