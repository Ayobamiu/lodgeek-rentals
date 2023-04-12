import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useProperties from "../../hooks/useProperties";
import useRentalRecords from "../../hooks/useRentalRecords";
import useRents from "../../hooks/useRents";
import { IProperty, Rent, RentalRecord, User } from "../../models";
import formatPrice from "../../utils/formatPrice";
import ActivityIndicator from "./ActivityIndicator";

type RentalRecordItemProp = {
  rentalRecordData: RentalRecord;
};

export default function RentalRecordItem(props: RentalRecordItemProp) {
  const { rentalRecordData } = props;
  const { getPropertyData } = useProperties();
  const { getRentsForARentalRecord } = useRents();
  const { rentalRecordStatuses } = useRentalRecords();
  const { getUserData } = useAuth();
  const [property, setProperty] = useState<IProperty>();
  const [loadingProperty, setLoadingProperty] = useState(false);
  useEffect(() => {
    (async () => {
      setLoadingProperty(true);
      const propertyData = await getPropertyData(
        rentalRecordData.property
      ).finally(() => {
        setLoadingProperty(false);
      });
      setProperty(propertyData);
    })();
  }, [rentalRecordData.property]);

  const [tenant, setTenant] = useState<User>();
  const [loadingTenant, setLoadingTenant] = useState(false);
  useEffect(() => {
    (async () => {
      setLoadingTenant(true);
      const tenantData = await getUserData(rentalRecordData.tenant).finally(
        () => {
          setLoadingTenant(false);
        }
      );
      setTenant(tenantData);
    })();
  }, [rentalRecordData.tenant]);

  const [rents, setRents] = useState<Rent[]>([]);
  const [loadingRents, setLoadingRents] = useState(false);
  useEffect(() => {
    (async () => {
      setLoadingRents(true);
      const rentsData = await getRentsForARentalRecord(
        rentalRecordData.id
      ).finally(() => {
        setLoadingRents(false);
      });
      setRents(rentsData as Rent[]);
    })();
  }, [rentalRecordData.id]);

  const tenantFullName = tenant
    ? `${tenant?.firstName || "-"} ${tenant?.lastName || "-"}`
    : rentalRecordData.tenant;

  const itemBg = (rent: Rent) =>
    rent.status === "paid"
      ? "bg-green-200 text-green-500"
      : rent.status === "pending"
      ? "bg-yellow-200 text-yellow-500"
      : rent.status === "late"
      ? "bg-red-200 text-red-500"
      : "bg-gray-200 text-coolGray-500";
  return (
    <Link
      to={`/dashboard/rentalRecords/${rentalRecordData.id}`}
      className="w-full p-2 hover:shadow-lg border-b border-coolGray-400"
    >
      <h3 className="mb-1 font-medium text-lg text-coolGray-900">
        {loadingTenant ? <ActivityIndicator color="black" /> : tenantFullName}
      </h3>
      <div className="flex gap-x-3 items-center flex-wrap lg:gap-3 gap-2">
        <h3 className="mb-1 font-medium text-lg text-coolGray-900 flex">
          {loadingProperty ? (
            <ActivityIndicator color="black" />
          ) : (
            property?.title || "--"
          )}
        </h3>
        <p className="text-xs font-medium text-coolGray-500">
          {formatPrice(rentalRecordData.rent)}/{rentalRecordData.rentPer}
        </p>
      </div>
      <p className="text-xs font-medium text-coolGray-500 mb-2">Rents</p>
      <div className="flex gap-x-5 items-center mb-4 justify-start flex-wrap gap-3">
        {loadingRents ? (
          <ActivityIndicator color="black" />
        ) : (
          rents
            .sort((a: Rent, b: Rent) => a.dueDate - b.dueDate)
            .map((rent, index) => (
              <button
                key={index}
                className={`${itemBg(
                  rent
                )} flex flex-col items-center lg:p-3 p-2 lg:gap-3 gap-2 rounded-xl lg:min-w-[70px] relative`}
              >
                <p key={index} className="text-xs font-medium ">
                  {moment(rent.dueDate).format("MMM YYYY")}
                </p>
              </button>
            ))
        )}
      </div>
      <p className="text-xs font-medium text-coolGray-500 mb-2">
        Status: {rentalRecordStatuses[rentalRecordData.status]}
      </p>
    </Link>
  );
}
