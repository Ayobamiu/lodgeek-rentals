import {
  faCheckCircle,
  faExternalLink,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { selectUser } from "../../app/features/userSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ActivityIndicator from "../../components/shared/ActivityIndicator";
import DetailsBox from "../../components/shared/DetailsBox";
import useRentalRecords from "../../hooks/useRentalRecords";
import useRents from "../../hooks/useRents";
import {
  AdditionalFee,
  Rent,
  RentalRecord,
  RentStatus,
  UserKYC,
} from "../../models";
import formatPrice from "../../utils/formatPrice";
import { Transition } from "@headlessui/react";
import { sendEmail } from "../../api/email";
import { PaystackButton } from "react-paystack";
import { generateSimpleEmail } from "../../utils/generateSimpleEmail";
import { AgreementAndKYCForm } from "./AgreementAndKYCForm";
import { RentItem } from "./RentItem";
import { KYCPreview } from "../../components/shared/KYCPreview";
import { getRentsAndFees } from "./getRentsAndFees";
import FullScreenActivityIndicator from "../../components/shared/FullScreenActivityIndicator";
import DashboardWrapper from "../../components/dashboard/DashboardWrapper";
import { setNotification } from "../../app/features/notificationSlice";
import { RentalRecordCollaboration } from "../../components/dashboard/RentalRecordCollaboration";
import {
  selectRentalRecord,
  setCurrentRentalRecord,
  setCurrentRentalRecordRents,
} from "../../app/features/rentalRecordSlice";
import useCurrentRentalRecord from "../../hooks/useCurrentRentalRecord";
import Button from "../../components/shared/button/Button";

export default function RentalRecordDetails() {
  const {
    rentalRecordStatuses,
    handleUpdateRentalRecord,
    updatePaidRents,
    sendEmailInvitationToTenant,
  } = useRentalRecords();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const loggedInUser = useAppSelector(selectUser);
  const {
    currentRentalRecord,
    currentRentalRecordCompany,
    currentRentalRecordProperty,
    currentRentalRecordOwner,
    currentRentalRecordTenant,
    currentRentalRecordRents,
  } = useAppSelector(selectRentalRecord);

  let { id } = useParams();

  const {
    loadingOwner,
    loadingProperty,
    loadingRentalRecord,
    loadingTenant,
    loadingRents,
  } = useCurrentRentalRecord();

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

  const [selectedRents, setSelectedRents] = useState<Rent[]>([]);
  const [selectedAdditionalFees, setSelectedAdditionalFees] = useState<
    AdditionalFee[]
  >([]);

  useEffect(() => {
    const feesToPay = [...(currentRentalRecord?.fees || [])].filter(
      (i) => i.feeIsRequired && !i.paid
    );
    setSelectedAdditionalFees(feesToPay);
  }, [currentRentalRecord]);

  useEffect(() => {
    if (!selectedRents.length) {
      setIsOpen(false);
    }
  }, [selectedRents]);

  const [isOpen, setIsOpen] = useState(false);

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

    setIsOpen(true);
  };

  const [updatingRents, setUpdatingRents] = useState(false);

  const handlePaidRents = async () => {
    setUpdatingRents(true);

    await updatePaidRents({
      rents: selectedRents,
      rentalRecordId: id || "",
      owner: currentRentalRecordOwner?.email || "",
      propertyTitle: currentRentalRecordProperty?.title || "",
      tenantName: `${currentRentalRecordTenant?.firstName} ${currentRentalRecordTenant?.lastName}`,
      tenantEmail: currentRentalRecordTenant?.email || "",
      selectedAdditionalFees,
      rentalRecord: currentRentalRecord!,
    })
      .finally(() => {
        setSelectedRents([]);
        setUpdatingRents(false);
      })
      .then(() => {
        const updatedRents = currentRentalRecordRents.map((i) => {
          const justPaid = selectedRents.findIndex((x) => x.id === i.id) > -1;
          if (justPaid) {
            const paidRent: Rent = {
              ...i,
              status: RentStatus["Paid - Rent has been paid."],
            };
            return paidRent;
          } else {
            return i;
          }
        });
        const updateDfees: AdditionalFee[] =
          currentRentalRecord?.fees?.map((i) => {
            if (selectedAdditionalFees.findIndex((x) => x.id === i.id) > -1) {
              return { ...i, paid: true, paidOn: Date.now() };
            } else {
              return i;
            }
          }) || [];
        const updatedRentalRecord = {
          ...currentRentalRecord!,
          fees: updateDfees,
        };
        dispatch(setCurrentRentalRecord(updatedRentalRecord));

        dispatch(setCurrentRentalRecordRents(updatedRents));
        setIsOpen(false);
      });
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

  const [acceptingInvite, setAcceptingInvite] = useState(false);
  const [openAgreementForm, setOpenAgreementForm] = useState(false);
  const acceptInvitation = async (userKYC: UserKYC) => {
    if (!userKYC) return toast.error("You need to complete your tenancy form.");
    if (!currentRentalRecord) return toast.error("Error Accepting Invite");
    setAcceptingInvite(true);
    const agreeedRecord: RentalRecord = {
      ...currentRentalRecord,
      status: "inviteAccepted",
      tenantAgreed: true,
      userKYC,
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
      setIsOpen(false);
    }
  }, [selectedRents]);

  const totalAmountToPay = useMemo(() => {
    const { transactionFee, totalFeeMinusTransactionFee } = getRentsAndFees(
      selectedRents,
      selectedAdditionalFees,
      currentRentalRecordCompany
    );
    return transactionFee + totalFeeMinusTransactionFee;
  }, [selectedRents, selectedAdditionalFees]);

  const config = {
    reference: new Date().getTime().toString(),
    email: loggedInUser?.email || "",
    amount: totalAmountToPay * 100,
    publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || "",
  };

  const componentProps = {
    ...config,
    text: "Pay",
    onSuccess: () => handlePaidRents(),
    onClose: () => {},
  };

  const showAdditionalFeePayButton =
    loggedInUser?.email === currentRentalRecord?.tenant;

  const [showKYCPreview, setShowKYCPreview] = useState(false);
  const { transactionFee, totalFeeMinusTransactionFee } = getRentsAndFees(
    selectedRents,
    selectedAdditionalFees,
    currentRentalRecordCompany
  );
  return (
    <DashboardWrapper>
      <div>
        {updatingRents && <FullScreenActivityIndicator />}
        {/* Rent Invoice Table */}
        <Transition
          show={isOpen}
          enter="transition-opacity duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="bg-black bg-opacity-50 fixed h-full w-full top-0 left-0 flex items-center justify-center z-50">
            <div className="lg:w-[600px] w-full lg:h-auto h-screen overflow-y-scroll bg-white lg:rounded-3xl p-6 relative">
              <FontAwesomeIcon
                icon={faTimes}
                className="absolute right-4 top-3 cursor-pointer"
                size="1x"
                onClick={() => setIsOpen(false)}
              />
              <div className="p-3">
                <table
                  className="w-full table-auto border-collapse border border-slate-500  ..."
                  title="Payment Invoice"
                >
                  <caption className="text-left mb-3">Payment Invoice</caption>
                  <thead>
                    <tr>
                      <th className="p-3 border border-slate-600 text-left  ...">
                        Description
                      </th>
                      <th className="p-3 border border-slate-600 text-left  ...">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRents.map((rent, rentIndex) => (
                      <tr key={rentIndex}>
                        <td className="p-3 border border-slate-700 ...">
                          Rent for {moment(rent.dueDate).format("MMM YYYY")}
                        </td>
                        <td className="p-3 border border-slate-700 ...">
                          {formatPrice(rent.rent)}
                        </td>
                      </tr>
                    ))}
                    {selectedAdditionalFees.map((fee, feeIndex) => (
                      <tr key={feeIndex}>
                        <td className="p-3 border border-slate-700 ...">
                          fee for {fee.feeTitle}
                        </td>
                        <td className="p-3 border border-slate-700 ...">
                          {formatPrice(fee.feeAmount)}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td className="p-3 border border-slate-700 ...">
                        Transaction fee
                      </td>
                      <td className="p-3 border border-slate-700 ...">
                        {formatPrice(transactionFee)}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <th className="p-3 border border-slate-600 text-left  ...">
                        Total
                      </th>
                      <th className="p-3 border border-slate-600 text-left  ...">
                        {formatPrice(
                          totalFeeMinusTransactionFee + transactionFee
                        )}
                      </th>
                    </tr>
                  </tfoot>
                </table>
                {/* <button
                  onClick={handlePaidRents}
                  className="flex flex-wrap items-center justify-center py-3 px-4 w-full text-base text-white font-medium bg-green-500 hover:bg-green-600 rounded-md shadow-button my-3"
                >
                  Pay
                </button> */}
                <PaystackButton
                  className="flex flex-wrap items-center justify-center py-3 px-4 w-full text-base text-white font-medium bg-green-500 hover:bg-green-600 rounded-md shadow-button my-3"
                  {...componentProps}
                />
              </div>
            </div>
          </div>
        </Transition>
        {/* Rent Invoice Table */}
        {/* KYC and Agreement form */}
        {currentRentalRecord && (
          <AgreementAndKYCForm
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
                    Rental Record
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
        <div className="container mx-auto p-8 print:hidden">
          {loadingRentalRecord && <ActivityIndicator color="black" />}
          <div className="w-60 mb-5">
            <Button
              title="Start Rent Review"
              onClick={() => {
                navigate(`/dashboard/rentalRecords/${id}/rent-review`);
              }}
            />
          </div>
          {currentRentalRecord?.userKYC && currentRentalRecordProperty && (
            <div className="mb-5">
              <button
                onClick={() => {
                  setShowKYCPreview(true);
                }}
                className="text-blue-500 underline underline-offset-4"
              >
                View tenancy agreement and documents{" "}
                <FontAwesomeIcon icon={faExternalLink} />
              </button>
            </div>
          )}
          <DetailsBox
            label="Property"
            value={currentRentalRecordProperty?.title}
            loading={loadingProperty}
          />
          <DetailsBox
            label="Property Owner"
            value={ownerFullName}
            loading={loadingOwner}
          />
          <DetailsBox
            label="Tenant"
            value={tenantFullName}
            loading={loadingTenant}
          />
          <DetailsBox
            label="Property Location"
            value={currentRentalRecordProperty?.location}
            loading={loadingProperty}
          />
          <DetailsBox
            label="Property Address"
            value={currentRentalRecordProperty?.address}
            loading={loadingProperty}
          />
          <DetailsBox
            label="Rent"
            value={`${formatPrice(currentRentalRecord?.rent || 0)}/${
              currentRentalRecord?.rentPer
            }`}
          />
          <p className="text-xs font-medium text-coolGray-500 mb-2">Rents</p>
          <div className="flex gap-5 items-center mb-4 justify-start flex-wrap">
            {loadingRents ? (
              <ActivityIndicator color="black" />
            ) : (
              currentRentalRecordRents.map((rent, index) => (
                <RentItem
                  index={index}
                  showPayRentButton={showPayRentButton}
                  rent={rent}
                  selectedRents={selectedRents}
                  setSelectedRents={setSelectedRents}
                  key={index}
                />
              ))
            )}
          </div>
          <DetailsBox
            label="Status"
            value={
              currentRentalRecord?.status
                ? rentalRecordStatuses[currentRentalRecord?.status]
                : "--"
            }
          />
          <h1 className="text-3xl">Additional fees</h1>
          {currentRentalRecord?.fees?.map((i, feeIndex) => (
            <div
              key={feeIndex}
              className="flex gap-2 items-center py-2 flex-wrap border-b"
            >
              <p>{i.feeTitle}</p>
              <p>{formatPrice(i.feeAmount)}</p>{" "}
              {i.feeIsRequired ? (
                <div
                  className="bg-green-500 text-white rounded px-2 text-xs"
                  title="Tenant must pay this fee."
                >
                  Required
                </div>
              ) : (
                <div
                  className="bg-gray-500 text-white rounded px-2 text-xs"
                  title="Tenants are not required to pay this fee."
                >
                  Not required
                </div>
              )}
              {showAdditionalFeePayButton && (
                <button
                  type="button"
                  className={`ml-auto w-full disabled:border-gray-600 lg:w-auto p-2 text-sm text-white font-medium ${
                    i.paid
                      ? "disabled:bg-green-400 bg-green-500 hover:bg-green-600 border border-green-600"
                      : "disabled:bg-gray-400 bg-gray-500 hover:bg-gray-600 border border-gray-600"
                  } rounded-md shadow-button flex items-center justify-center gap-x-2`}
                  onClick={() => {
                    if (feeIsSelected(i)) {
                      setSelectedAdditionalFees((v) => [
                        ...v.filter((x) => x.id !== i.id),
                      ]);
                    } else {
                      setSelectedAdditionalFees((v) => [...v, i]);
                    }
                  }}
                  disabled={i.feeIsRequired || i.paid}
                >
                  {i.paid ? "Paid" : `Select${feeIsSelected(i) ? "ed" : ""}`}{" "}
                  {feeIsSelected(i) && (
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      color="white"
                      className=""
                    />
                  )}
                </button>
              )}
            </div>
          ))}
          {!currentRentalRecord?.fees?.length && (
            <div className="mb-3">No Additional fees</div>
          )}
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
      </div>
    </DashboardWrapper>
  );

  function feeIsSelected(i: AdditionalFee) {
    return selectedAdditionalFees.findIndex((x) => x.id === i.id) > -1;
  }
}

export function rentSelected(selectedRents: Rent[], rent: Rent) {
  return selectedRents.findIndex((i) => i.id === rent.id) > -1;
}
