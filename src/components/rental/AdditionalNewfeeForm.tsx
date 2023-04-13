import { useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { selectRentalRecord } from "../../app/features/rentalRecordSlice";
import { useAppSelector } from "../../app/hooks";
import { AdditionalFee, RentalRecord } from "../../models";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import ActivityIndicator from "../shared/ActivityIndicator";
import useRentalRecords from "../../hooks/useRentalRecords";

const AdditionalNewfeeForm = () => {
  const { currentRentalRecord } = useAppSelector(selectRentalRecord);
  const { handleUpdateRentalRecord } = useRentalRecords();

  const [feeTitle, setFeeTitle] = useState("");
  const [feeAmount, setFeeAmount] = useState(0);
  const [feeIsRequired, setFeeIsRequired] = useState(false);
  const [addingNewFee, setAddingNewFee] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (feeAmount === 0) {
      return toast.warning("Amount can not be zero!");
    }
    const newFee: AdditionalFee = {
      feeTitle,
      feeAmount,
      feeIsRequired,
      id: uuidv4(),
      paid: false,
      paidOn: -1,
    };

    const updatedFees: AdditionalFee[] = [...currentRentalRecord.fees, newFee];
    const updatedRentalRecord: RentalRecord = {
      ...currentRentalRecord,
      fees: updatedFees,
    };

    setAddingNewFee(true);
    await handleUpdateRentalRecord(updatedRentalRecord).finally(() => {
      setAddingNewFee(false);
    });
    setFeeAmount(0);
    setFeeIsRequired(false);
    setFeeTitle("");
    if (e.currentTarget) {
      e.currentTarget.reset();
    }
  };

  return (
    <div className="mb-5 lg:p-6 p-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <form
        id="additionalFeeForm"
        onSubmit={onSubmit}
        className="grid lg:grid-cols-5 grid-cols-4 gap-2 items-end"
      >
        <div className="col-span-2">
          <label htmlFor="feeTitle">Fee Title</label>
          <input
            required
            className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
            type="text"
            placeholder="Additional Fee"
            id="feeTitle"
            name="feeTitle"
            value={feeTitle}
            onChange={(e) => {
              setFeeTitle(e.target.value);
            }}
            list="feesFortenant"
          />
          <datalist id="feesFortenant">
            <option value="Service fee">Service fee</option>
            <option value="Security deposit">Security deposit</option>
            <option value="Application fee">Application fee</option>
            <option value="Move-in fee">Move-in fee</option>
            <option value="Pet fee">Pet fee</option>
            <option value="Late payment fee">Late payment fee</option>
            <option value="Parking fee">Parking fee</option>
            <option value="Utility fees">Utility fees</option>
          </datalist>
        </div>
        <div className="col-span-2">
          <label htmlFor="feeAmount">Amount</label>
          <CurrencyInput
            id="feeAmount"
            name="feeAmount"
            placeholder="₦ 500,000.00"
            decimalsLimit={2}
            onValueChange={(value) => {
              setFeeAmount(Number(value));
            }}
            required
            prefix="₦ "
            value={feeAmount}
            className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
          />
        </div>

        <div className="lg:col-span-1 col-span-4 flex  gap-x-2">
          <button
            type="submit"
            disabled={addingNewFee}
            className="w-full px-4 py-3 text-sm text-white font-medium bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 rounded-md shadow-button flex items-center justify-center gap-x-3"
          >
            Add {addingNewFee && <ActivityIndicator size="4" />}
          </button>
        </div>
      </form>
    </div>
  );
};
export default AdditionalNewfeeForm;
