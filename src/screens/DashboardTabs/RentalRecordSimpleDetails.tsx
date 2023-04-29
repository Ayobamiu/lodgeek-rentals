import { selectRentalRecord } from "../../app/features/rentalRecordSlice";
import { useAppSelector } from "../../app/hooks";
import DetailsBox from "../../components/shared/DetailsBox";
import useCurrentRentalRecord from "../../hooks/useCurrentRentalRecord";
import useRentalRecords from "../../hooks/useRentalRecords";
import formatPrice from "../../utils/formatPrice";

export function RentalRecordSimpleDetails() {
  const {
    currentRentalRecord,
    currentRentalRecordProperty,
    currentRentalRecordOwner,
    currentRentalRecordTenant,
  } = useAppSelector(selectRentalRecord);
  const { rentalRecordStatuses } = useRentalRecords();
  const { loadingOwner, loadingProperty, loadingTenant } =
    useCurrentRentalRecord();

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

  return (
    <div className="grid grid-cols-2 w-full gap-1 mb-3">
      <div className="col-span-1">
        <DetailsBox
          label="Property"
          value={currentRentalRecordProperty?.title}
          loading={loadingProperty}
        />
      </div>
      <div className="col-span-1">
        <DetailsBox label="Unit" value={currentRentalRecord.unitNo} />
      </div>
      <div className="col-span-1">
        <DetailsBox
          label="Property Owner"
          value={ownerFullName}
          loading={loadingOwner}
        />
      </div>
      <div className="col-span-1">
        <DetailsBox
          label="Tenant"
          value={tenantFullName}
          loading={loadingTenant}
        />
      </div>
      <div className="col-span-1">
        <DetailsBox
          label="Property Location"
          value={currentRentalRecordProperty?.location}
          loading={loadingProperty}
        />
      </div>
      <div className="col-span-1">
        <DetailsBox
          label="Property Address"
          value={currentRentalRecordProperty?.address}
          loading={loadingProperty}
        />
      </div>
      <div className="col-span-1">
        <DetailsBox
          label="Rent"
          value={`${formatPrice(currentRentalRecord?.rent || 0)}/${
            currentRentalRecord?.rentPer
          }`}
        />
      </div>
      <div className="col-span-1">
        <DetailsBox
          label="Status"
          value={
            currentRentalRecord?.status
              ? rentalRecordStatuses[currentRentalRecord?.status]
              : "--"
          }
        />
      </div>
    </div>
  );
}
