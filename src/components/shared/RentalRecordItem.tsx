import { Avatar, Badge, List, Skeleton } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useProperties from "../../hooks/useProperties";
import useRentalRecords from "../../hooks/useRentalRecords";
import useRents from "../../hooks/useRents";
import {
  Property,
  Rent,
  RentalRecord,
  RentalrecordStatusType,
  User,
} from "../../models";
import formatPrice from "../../utils/formatPrice";

type RentalRecordItemProp = {
  rentalRecordData: RentalRecord;
};

export default function RentalRecordItem(props: RentalRecordItemProp) {
  const { rentalRecordData } = props;
  const { getPropertyData } = useProperties();
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

  const itemBg = (rent: Rent) =>
    rent.status === "paid"
      ? "bg-green-200 text-green-500"
      : rent.status === "pending"
      ? "bg-yellow-200 text-yellow-500"
      : rent.status === "late"
      ? "bg-red-200 text-red-500"
      : "bg-gray-200 text-coolGray-500";

  const image = (property?.images && property?.images[0].url) || "";
  return (
    <List.Item
      actions={[
        <Link
          to={`/dashboard/rentalRecords/${rentalRecordData.id}`}
          key="list-loadmore-edit"
        >
          open
        </Link>,
      ]}
    >
      <Skeleton
        avatar
        title={false}
        loading={loadingTenant || loadingProperty || loadingRents}
        active
        round={false}
      >
        <List.Item.Meta
          avatar={
            image ? <Avatar size={64} src={image} shape="square" /> : null
          }
          title={`Tenant: ${tenantFullName}`}
          description={property?.title}
        />
        <div>
          {formatPrice(rentalRecordData.rent)}/{rentalRecordData.rentPer}
        </div>
        <Badge
          status={RentalrecordStatusType[rentalRecordData.status]}
          text={rentalRecordStatuses[rentalRecordData.status]}
        />

        <div className="flex gap-x-5 items-center my-4 justify-start flex-wrap gap-3">
          {rents
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
            ))}
        </div>
      </Skeleton>
    </List.Item>
  );
}
