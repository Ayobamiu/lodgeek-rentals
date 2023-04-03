import { useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { selectSelectedCompany } from "../../app/features/companySlice";
import { useAppSelector } from "../../app/hooks";
import useAuth from "../../hooks/useAuth";
import { BankRecord } from "../../models";
import ActivityIndicator from "./ActivityIndicator";

type RentalRecordItemProp = {
  bankRecordData: BankRecord;
};

export default function BankRecordItem(props: RentalRecordItemProp) {
  const selectedCompany = useAppSelector(selectSelectedCompany);
  const { bankRecordData } = props;
  const { updateDefaultRemittanceAccount } = useAuth();
  const [updatingDefault, setUpdatingDefault] = useState(false);
  const onClickRecord = () => {
    if (selectedCompany?.remittanceAccount === bankRecordData.id) return;
    confirmAlert({
      title: `Set default account to ${bankRecordData.accountNumber} - ${bankRecordData.bankName} - ${bankRecordData.accountName}`,
      message: "",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            setUpdatingDefault(true);
            updateDefaultRemittanceAccount(bankRecordData.id).finally(() => {
              setUpdatingDefault(false);
            });
          },
        },
        {
          label: "No",
        },
      ],

      closeOnClickOutside: false,
      closeOnEscape: false,
    });
  };
  return (
    <div
      className="w-full p-2 hover:shadow-lg border-b border-coolGray-400 cursor-pointer"
      onClick={onClickRecord}
    >
      {selectedCompany?.remittanceAccount === bankRecordData.id && (
        <small className="bg-green-500 p-1 text-white rounded">
          Default account
        </small>
      )}
      <h3 className="mb-1 font-medium text-lg text-coolGray-900 flex">
        {bankRecordData.accountName}{" "}
        {updatingDefault && <ActivityIndicator color="black" />}
      </h3>
      <div className="flex gap-x-3 items-center flex-wrap lg:gap-3 gap-2">
        <h3 className="mb-1 font-medium text-lg text-coolGray-900 flex">
          {bankRecordData.bankName}
        </h3>
      </div>
      <p className="text-xs font-medium text-coolGray-500 mb-2">
        {bankRecordData.accountNumber}
      </p>
    </div>
  );
}
