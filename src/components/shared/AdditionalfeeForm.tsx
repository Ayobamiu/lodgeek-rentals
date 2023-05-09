import { useState } from "react";
import CurrencyInput from "react-currency-input-field";
import {
  selectNewRentalRecord,
  updateNewRentalRecord,
} from "../../app/features/rentalRecordSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { AdditionalFee } from "../../models";
import { v4 as uuidv4 } from "uuid";
import { roundUpTo2Decimals } from "../../utils/roundUpTo2Decimals";

const AdditionalfeeForm = () => {
  const [feeTitle, setFeeTitle] = useState("");
  const [feeAmount, setFeeAmount] = useState(0);
  const [percent, setPercent] = useState(0);
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
    setPercent(0);
    setFeeIsRequired(false);
    setFeeTitle("");
    e.currentTarget.reset();
  };

  return (
    <div className="my-5 w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
      <form className="space-y-6" id="additionalFeeForm" onSubmit={onSubmit}>
        <h5 className="text-xl font-medium text-gray-900 dark:text-white">
          Add Additional fee
        </h5>
        <div>
          <label
            htmlFor="feeTitle"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Fee Title
          </label>
          <input
            type="text"
            name="feeTitle"
            id="feeTitle"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder="Fee Title"
            required
            list="feesFortenant"
            onChange={(e) => {
              setFeeTitle(e.target.value);
            }}
            value={feeTitle}
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
        <div className="grid grid-cols-2 gap-x-3">
          <div className="col-span-1">
            <label
              htmlFor="feeAmount"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Amount
            </label>

            <CurrencyInput
              id="feeAmount"
              name="feeAmount"
              placeholder="₦ 500,000.00"
              decimalsLimit={2}
              onValueChange={(value, name) => {
                const valueToNumber = Number(value || 0);
                setFeeAmount(valueToNumber);
                const percentEq =
                  (valueToNumber / Number(newRentalRecord.rent)) * 100;
                setPercent(roundUpTo2Decimals(percentEq));
              }}
              required
              prefix="₦ "
              value={feeAmount}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            />
          </div>
          <div className="col-span-1">
            <label
              htmlFor="feePercent"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Percentage
            </label>

            <CurrencyInput
              id="feePercent"
              name="feePercent"
              placeholder="0%"
              decimalsLimit={2}
              onValueChange={(value, name) => {
                const valueToNumber = Number(value || 0);

                setPercent(roundUpTo2Decimals(valueToNumber));
                const amountEq =
                  (valueToNumber * Number(newRentalRecord.rent)) / 100;
                setFeeAmount(amountEq);
              }}
              required
              suffix="%"
              value={percent}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            />
          </div>
        </div>
        <div className="flex items-start">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="feeIsRequired"
                type="checkbox"
                value=""
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                onClick={(e) => {
                  setFeeIsRequired(e.currentTarget.checked);
                }}
                defaultChecked={feeIsRequired}
              />
            </div>
            <label
              htmlFor="feeIsRequired"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Required?
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          Add fee
        </button>
      </form>
    </div>
  );
};
export default AdditionalfeeForm;
