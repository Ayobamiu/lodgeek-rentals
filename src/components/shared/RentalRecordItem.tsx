import {
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { collection, getDocs, query, where } from "firebase/firestore";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { db, RENTAL_RECORD_PATH } from "../../firebase/config";
import useAuth from "../../hooks/useAuth";
import useProperties from "../../hooks/useProperties";
import useRentalRecords from "../../hooks/useRentalRecords";
import useRents from "../../hooks/useRents";
import { Property, Rent, RentalRecord, User } from "../../models";
import formatPrice from "../../utils/formatPrice";
import ActivityIndicator from "./ActivityIndicator";

type RentalRecordItemProp = {
  rentalRecordData: RentalRecord;
};

export default function RentalRecordItem(props: RentalRecordItemProp) {
  const { rentalRecordData } = props;
  const { getPropertyData, propertyLoading } = useProperties();
  const { getRentsForARentalRecord } = useRents();
  const { rentalRecordStatuses } = useRentalRecords();
  const { getUserData } = useAuth();
  const [property, setProperty] = useState<Property>();
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

  return (
    <Link
      to={`/dashboard?tab=rentalRecordDetails&rentalRecordId=${rentalRecordData.id}`}
      className="w-full p-2 hover:shadow-lg border-b border-coolGray-100"
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
              <button className="flex flex-col items-center bg-gray-300 lg:p-3 p-2 lg:gap-3 gap-2 rounded-xl lg:min-w-[70px] relative">
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
                {/* <div className="flex">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  size={"2xl"}
                  color={rent.status === "paid" ? "green" : "black"}
                />
              </div> */}
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
