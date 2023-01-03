import {
  faCheckCircle,
  faTimes,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { selectUser } from "../../app/features/userSlice";
import { useAppSelector } from "../../app/hooks";
import ActivityIndicator from "../../components/shared/ActivityIndicator";
import DetailsBox from "../../components/shared/DetailsBox";
import useAuth from "../../hooks/useAuth";
import useProperties from "../../hooks/useProperties";
import useQuery from "../../hooks/useQuery";
import useRentalRecords from "../../hooks/useRentalRecords";
import useRents from "../../hooks/useRents";
import { Property, Rent, RentalRecord, User } from "../../models";
import formatPrice from "../../utils/formatPrice";
import { Dialog, Transition } from "@headlessui/react";

export default function RentalRecordDetails() {
  let query = useQuery();
  const { search } = useLocation();

  const navigate = useNavigate();

  const {
    rentalRecordStatuses,
    getRentalRecordData,
    handleUpdateRentalRecord,
    updatePaidRents,
  } = useRentalRecords();
  const [rentalRecordData, setRentalRecordData] = useState<RentalRecord>();
  const [loadingRentalRecord, setLoadingRentalRecord] = useState(false);
  const loggedInUser = useAppSelector(selectUser);

  useEffect(() => {
    const rentalRecordId = query.get("rentalRecordId");
    if (!rentalRecordId) {
      navigate("/dashboard?tab=rentalRecords");
    }

    const loadRelatedRentalRecord = async () => {
      if (!rentalRecordId) return;
      setLoadingRentalRecord(true);
      const rentalRecordD = await getRentalRecordData(rentalRecordId).finally(
        () => {
          setLoadingRentalRecord(false);
        }
      );
      setRentalRecordData(rentalRecordD);
    };

    loadRelatedRentalRecord();
  }, [query.get("tab"), query.get("rentalRecordId")]);

  const { getPropertyData, propertyLoading } = useProperties();
  const { getRentsForARentalRecord } = useRents();
  const { getUserData } = useAuth();
  const [property, setProperty] = useState<Property>();
  const [loadingProperty, setLoadingProperty] = useState(false);

  useEffect(() => {
    const loadRelatedProperty = async () => {
      setLoadingProperty(true);
      const propertyData = await getPropertyData(
        rentalRecordData?.property!
      ).finally(() => {
        setLoadingProperty(false);
      });
      setProperty(propertyData);
    };
    if (rentalRecordData?.property) {
      loadRelatedProperty();
    }
  }, [rentalRecordData?.property]);

  const [owner, setOwner] = useState<User>();
  const [loadingOwner, setLoadingOwner] = useState(false);
  useEffect(() => {
    const loadRelatedOwner = async () => {
      if (!rentalRecordData?.owner) return;
      setLoadingOwner(true);
      const ownerData = await getUserData(rentalRecordData?.owner).finally(
        () => {
          setLoadingOwner(false);
        }
      );
      console.log({ ownerData });

      setOwner(ownerData);
    };
    loadRelatedOwner();
  }, [rentalRecordData?.owner]);

  const ownerFullName = owner
    ? `${owner?.firstName || "-"} ${owner?.lastName || "-"}`
    : rentalRecordData?.owner;

  const [tenant, setTenant] = useState<User>();
  const [loadingTenant, setLoadingTenant] = useState(false);
  useEffect(() => {
    const loadRelatedTenant = async () => {
      if (!rentalRecordData?.tenant) return;
      setLoadingTenant(true);
      const tenantData = await getUserData(rentalRecordData?.tenant).finally(
        () => {
          setLoadingTenant(false);
        }
      );
      setTenant(tenantData);
    };
    loadRelatedTenant();
  }, [rentalRecordData?.tenant]);

  const [rents, setRents] = useState<Rent[]>([]);
  const [loadingRents, setLoadingRents] = useState(false);
  useEffect(() => {
    const loadRelatedRents = async () => {
      if (!rentalRecordData?.id) return;
      setLoadingRents(true);
      const rentsData = await getRentsForARentalRecord(
        rentalRecordData?.id
      ).finally(() => {
        setLoadingRents(false);
      });
      setRents(rentsData as Rent[]);
    };
    loadRelatedRents();
  }, [rentalRecordData?.id]);

  const tenantFullName = tenant
    ? `${tenant?.firstName || "-"} ${tenant?.lastName || "-"}`
    : rentalRecordData?.tenant;

  const gotoAddRentalRecords = () => {};
  const [selectedRents, setSelectedRents] = useState<Rent[]>([]);
  console.log({ selectedRents });

  let [isOpen, setIsOpen] = useState(true);
  const payRent = () => {
    if (!selectedRents.length) return toast.error("Select Rents to pay for.");

    setIsOpen(true);
  };

  const [updatingRents, setUpdatingRents] = useState(false);

  const handlePaidRents = async () => {
    setUpdatingRents(true);

    await updatePaidRents(selectedRents)
      .finally(() => {
        setUpdatingRents(false);
      })
      .then(() => {
        const updatedRents = rents.map((i) => {
          const justPaid = selectedRents.findIndex((x) => x.id === i.id) > -1;
          if (justPaid) {
            const paidRent: Rent = { ...i, status: "paid" };
            return paidRent;
          } else {
            return i;
          }
        });
        setRents(updatedRents);
        setIsOpen(false);
      });
  };

  const PayRentButton = () => {
    return (
      <button
        onClick={payRent}
        className="flex flex-wrap items-center justify-center py-3 px-4 w-full text-base text-white font-medium bg-green-500 hover:bg-green-600 rounded-md shadow-button"
      >
        <span>Pay Rent</span>
      </button>
    );
  };

  const [acceptingInvite, setAcceptingInvite] = useState(false);

  const acceptInvitation = async () => {
    if (!rentalRecordData) return toast.error("Error Accepting Invite");
    setAcceptingInvite(true);
    await handleUpdateRentalRecord({
      ...rentalRecordData,
      status: "inviteAccepted",
    })
      .then(() => {
        setRentalRecordData({
          ...rentalRecordData,
          status: "inviteAccepted",
        });
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
        onClick={acceptInvitation}
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
        href={`mailto:${rentalRecordData?.tenant}`}
        className="flex flex-wrap items-center justify-center py-3 px-4 w-full text-base text-white font-medium bg-green-500 hover:bg-green-600 rounded-md shadow-button"
      >
        <span>Email Tenant</span>
      </a>
    );
  };

  const ResendInviteButton = () => {
    return (
      <button className="flex flex-wrap items-center justify-center py-3 px-4 w-full text-base text-white font-medium bg-green-500 hover:bg-green-600 rounded-md shadow-button">
        <span>Resend Invite</span>
      </button>
    );
  };

  const showPayRentButton =
    rentalRecordData?.status === "inviteAccepted" &&
    loggedInUser?.email === rentalRecordData.tenant;
  const showAcceptInvitationButton =
    rentalRecordData?.status === "inviteSent" &&
    loggedInUser?.email === rentalRecordData.tenant;
  const showResendInviteButton =
    rentalRecordData?.status === "inviteSent" &&
    loggedInUser?.email === rentalRecordData.owner;
  const showEmailTenantButton =
    rentalRecordData?.status === "inviteAccepted" &&
    loggedInUser?.email === rentalRecordData.owner;

  useEffect(() => {
    if (!selectedRents.length) {
      setIsOpen(false);
    }
  }, [selectedRents]);

  return (
    <div>
      <Transition
        show={isOpen}
        enter="transition-opacity duration-150"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="bg-black bg-opacity-50 absolute h-full w-full top-0 left-0 flex items-center justify-center z-50">
          <div className="lg:w-[600px] lg:min-h-[500px] bg-white rounded-3xl p-6 relative">
            <FontAwesomeIcon
              icon={faTimes}
              className="absolute right-4 top-3 cursor-pointer"
              size="1x"
              onClick={() => setIsOpen(false)}
            />

            <div className="p-3">
              <table
                className="w-full table-auto border-collapse border border-slate-500  ..."
                title="Rent Invoice"
              >
                <caption className="text-left mb-3">Rent Invoice</caption>
                <thead>
                  <tr>
                    <th className="p-3 border border-slate-600 text-left  ...">
                      Rent
                    </th>
                    <th className="p-3 border border-slate-600 text-left  ...">
                      Amount
                    </th>
                    <th className="p-3 border border-slate-600 text-left  ...">
                      Start Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRents.map((rent, rentIndex) => (
                    <tr key={rentIndex}>
                      <td className="p-3 border border-slate-700 ...">
                        {moment(rent.dueDate).format("MMM YYYY")}
                      </td>
                      <td className="p-3 border border-slate-700 ...">
                        {formatPrice(rent.rent)}
                      </td>
                      <td className="p-3 border border-slate-700 ...">
                        {moment(rent.dueDate).format("ll")}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th
                      className="p-3 border border-slate-600 text-left  ..."
                      colSpan={2}
                    >
                      Total
                    </th>
                    <th className="p-3 border border-slate-600 text-left  ...">
                      {formatPrice(
                        selectedRents
                          .map((i) => i.rent)
                          .reduce((partialSum, a) => partialSum + a, 0)
                      )}
                    </th>
                  </tr>
                </tfoot>
              </table>
              <button
                onClick={handlePaidRents}
                className="flex flex-wrap items-center justify-center py-3 px-4 w-full text-base text-white font-medium bg-green-500 hover:bg-green-600 rounded-md shadow-button my-3"
              >
                {updatingRents ? <ActivityIndicator /> : <span>Pay</span>}
              </button>
            </div>
          </div>
        </div>
      </Transition>
      <section className="container mx-auto bg-white p-8 border-b">
        <div className="flex flex-wrap items-center -m-2">
          <div className="w-full md:w-1/2 p-2">
            <div className="flex flex-wrap items-center -m-2">
              <div className="flex-1 p-2">
                <h2 className="font-semibold text-black text-3xl">
                  Rental Records
                </h2>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 p-2">
            <div className="flex flex-wrap justify-end -m-2">
              <div className="w-full md:w-auto p-2"></div>
              <div className="w-full md:w-auto p-2">
                {showPayRentButton && <PayRentButton />}
                {showAcceptInvitationButton && <AcceptInvitationButton />}
                {showEmailTenantButton && <EmailTenantButton />}
                {showResendInviteButton && <ResendInviteButton />}
              </div>
              <div className="w-full md:w-auto p-2"></div>
            </div>
          </div>
        </div>
      </section>
      <div className="container mx-auto p-8">
        {loadingRentalRecord && <ActivityIndicator color="black" />}
        <DetailsBox
          label="Property"
          value={property?.title}
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
          value={property?.location}
          loading={loadingProperty}
        />
        <DetailsBox
          label="Property Address"
          value={property?.address}
          loading={loadingProperty}
        />
        <DetailsBox
          label="Rent"
          value={`${formatPrice(rentalRecordData?.rent || 0)}/${
            rentalRecordData?.rentPer
          }`}
        />
        <p className="text-xs font-medium text-coolGray-500 mb-2">Rents</p>
        <div className="flex gap-x-5 items-center mb-4 justify-start flex-wrap gap-2">
          {loadingRents ? (
            <ActivityIndicator color="black" />
          ) : (
            rents
              .sort((a: Rent, b: Rent) => a.dueDate - b.dueDate)
              .map((rent, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const rentNotClickable =
                      !showPayRentButton || rent.status === "paid";
                    if (rentNotClickable) return;
                    if (rentSelected(selectedRents, rent)) {
                      setSelectedRents((v) =>
                        [...v].filter((i) => i.id !== rent.id)
                      );
                    } else {
                      setSelectedRents((v) => [...v, rent]);
                    }
                  }}
                  className="flex flex-col items-center bg-gray-300 lg:p-3 p-2 lg:gap-3 gap-2 rounded-xl lg:min-w-[70px] relative"
                >
                  {rent.status === "paid" && (
                    <div className="px-1 text-xs bg-[green] text-white font-bold shadow-sm rounded absolute -bottom-2">
                      Paid
                    </div>
                  )}
                  <p
                    key={index}
                    className="text-xs font-medium text-coolGray-500"
                  >
                    {moment(rent.dueDate).format("MMM YYYY")}
                  </p>
                  {rent.status === "upcoming" && (
                    <div className="px-1 text-xs bg-gray-500 text-white font-bold shadow-sm rounded">
                      Upcoming
                    </div>
                  )}
                  {rent.status === "pending" && (
                    <div className="px-1 text-xs bg-yellow-500 text-white font-bold shadow-sm rounded">
                      Pending
                    </div>
                  )}
                  {rent.status === "late" && (
                    <div className="px-1 text-xs bg-red-500 text-white font-bold shadow-sm rounded">
                      Late
                    </div>
                  )}

                  {!(!showPayRentButton || rent.status === "paid") && (
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      color={
                        rentSelected(selectedRents, rent) ? "green" : "black"
                      }
                      className="absolute -right-0.5 -top-0.5"
                    />
                  )}
                </button>
              ))
          )}
        </div>
        <DetailsBox
          label="Status"
          value={
            rentalRecordData?.status
              ? rentalRecordStatuses[rentalRecordData?.status]
              : "--"
          }
        />
      </div>
    </div>
  );
}
function rentSelected(selectedRents: Rent[], rent: Rent) {
  return selectedRents.findIndex((i) => i.id === rent.id) > -1;
}
