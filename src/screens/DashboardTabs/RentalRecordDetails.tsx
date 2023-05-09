import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { selectUser } from "../../app/features/userSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ActivityIndicator from "../../components/shared/ActivityIndicator";
import useRentalRecords from "../../hooks/useRentalRecords";
import { AdditionalFee, SignedTenancyAgreementStatus } from "../../models";
import DashboardWrapper from "../../components/dashboard/DashboardWrapper";
import { setNotification } from "../../app/features/notificationSlice";
import { RentalRecordCollaboration } from "../../components/dashboard/RentalRecordCollaboration";
import {
  selectRentalRecord,
  selectUserKYC,
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
import { UserKYCForm } from "./UserKYCForm";
import { CompleteKYCAndSignLease } from "./CompleteKYCAndSignLease";
import { VerifySignedLease } from "./VerifySignedLease";
import { Tabs } from "antd";
import {
  BellOutlined,
  CreditCardOutlined,
  FileOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { RentalRecordDocuments } from "./RentalRecordDocuments";
import RentalRecordReminder from "../RentalRecords/RentalRecordReminder";

export default function RentalRecordDetails() {
  const { sendEmailInvitationToTenant } = useRentalRecords();

  const dispatch = useAppDispatch();

  const loggedInUser = useAppSelector(selectUser);
  const { selectedRents, selectedAdditionalFees } = useAppSelector(selectRent);
  const currentUserKYC = useAppSelector(selectUserKYC);

  const {
    currentRentalRecord,
    currentRentalRecordCompany,
    currentRentalRecordProperty,
  } = useAppSelector(selectRentalRecord);

  const { loadingRentalRecord } = useCurrentRentalRecord();

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

  const [openKYCForm, setOpenKYCForm] = useState(false);

  const tabItems = [
    {
      name: "Rents and Fees",
      icon: <CreditCardOutlined />,
      component: (
        <>
          <PaidRents showPayRentButton={showPayRentButton} />
          <UpaidRents showPayRentButton={showPayRentButton} />
          <AdditionalFees showPayRentButton={showPayRentButton} />
        </>
      ),
    },
    {
      name: "Documents",
      icon: <FileOutlined />,
      component: <RentalRecordDocuments />,
    },
    {
      name: "Reviews",
      icon: <EditOutlined />,
      component: (
        <>
          <ReviewsOnRentalRecord />
        </>
      ),
    },
    {
      name: "Reminder",
      icon: <BellOutlined />,
      component: <RentalRecordReminder />,
    },
  ];
  return (
    <DashboardWrapper>
      <div>
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
                  {/* {showAcceptInvitationButton && <AcceptInvitationButton />} */}
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

          {showAcceptInvitationButton && (
            <CompleteKYCAndSignLease
              setOpenKYCForm={setOpenKYCForm}
              currentUserKYC={currentUserKYC}
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
          <Tabs
            defaultActiveKey="1"
            items={tabItems.map((x, i) => {
              return {
                label: (
                  <span>
                    {x.icon}
                    {x.name}
                  </span>
                ),
                key: String(i + 1),
                children: x.component,
              };
            })}
          />
        </div>

        {/* Modals Section */}

        {/* {updatingRents && <FullScreenActivityIndicator />} */}

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
        {/* {currentRentalRecord && (
          <AcceptInvitationForm
            openAgreementForm={openAgreementForm}
            setOpenAgreementForm={setOpenAgreementForm}
            rentalRecordData={currentRentalRecord}
            acceptInvitation={acceptInvitation}
          />
        )} */}
        {/* KYC and Agreement form */}
      </div>
    </DashboardWrapper>
  );
}
