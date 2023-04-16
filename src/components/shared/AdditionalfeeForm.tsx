import { useState } from "react";
import CurrencyInput from "react-currency-input-field";
import {
  selectNewRentalRecord,
  updateNewRentalRecord,
} from "../../app/features/rentalRecordSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { AdditionalFee } from "../../models";
import { v4 as uuidv4 } from "uuid";

const AdditionalfeeForm = () => {
  const [feeTitle, setFeeTitle] = useState("");
  const [feeAmount, setFeeAmount] = useState(0);
  const [feeIsRequired, setFeeIsRequired] = useState(false);

  const dispatch = useAppDispatch();
  const newRentalRecord = useAppSelector(selectNewRentalRecord);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newFee: AdditionalFee = {
      feeTitle,
      feeAmount,
      feeIsRequired,
      id: uuidv4(),
      paid: false,
      paidOn: -1,
    };
    const updatedFees: AdditionalFee[] = [...newRentalRecord.fees, newFee];
    dispatch(updateNewRentalRecord({ fees: updatedFees }));
    setFeeAmount(0);
    setFeeIsRequired(false);
    setFeeTitle("");
    e.currentTarget.reset();
  };

  return (
    <form
      id="additionalFeeForm"
      onSubmit={onSubmit}
      className="grid grid-cols-6 gap-2 items-end"
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
          onValueChange={(value, name) => {
            setFeeAmount(Number(value));
          }}
          required
          prefix="₦ "
          value={feeAmount}
          className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
        />
      </div>

      <div className="col-span-1 flex  py-2.5 gap-x-2">
        <label htmlFor="feeIsRequired">Required?</label>
        <input
          type="checkbox"
          placeholder="johndoe@flex.co"
          id="feeIsRequired"
          name="feeIsRequired"
          onClick={(e) => {
            setFeeIsRequired(e.currentTarget.checked);
          }}
          defaultChecked={feeIsRequired}
        />
      </div>
      <div className="lg:col-span-1 col-span-6 flex  gap-x-2">
        <button className="w-full px-4 py-3 text-sm text-white font-medium bg-green-500 hover:bg-green-600 border border-green-600 rounded-md shadow-button flex items-center justify-center">
          Add
        </button>
      </div>
    </form>
  );
};
export default AdditionalfeeForm;
