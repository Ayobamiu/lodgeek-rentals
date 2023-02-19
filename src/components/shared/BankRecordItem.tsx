import { BankRecord } from "../../models";

type RentalRecordItemProp = {
  bankRecordData: BankRecord;
};

export default function BankRecordItem(props: RentalRecordItemProp) {
  const { bankRecordData } = props;
  return (
    <div className="w-full p-2 hover:shadow-lg border-b border-coolGray-400">
      <h3 className="mb-1 font-medium text-lg text-coolGray-900">
        {bankRecordData.accountName}
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
