import { Input, InputNumber, message } from "antd";
import { useState } from "react";
import { FaArrowCircleDown, FaArrowCircleUp, FaTimes } from "react-icons/fa";
import {
  selectInvoice,
  updateCurrentInvoice,
} from "../../app/features/invoiceSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { PaymentCurrency } from "../../models";
import { v4 as uuidv4 } from "uuid";

export function AddInvoiceItemModal({
  closeModal,
  isOpen,
}: {
  isOpen: boolean;
  closeModal: () => void;
}) {
  const { currentInvoice } = useAppSelector(selectInvoice);
  const dispatch = useAppDispatch();
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState(0);
  const [price, setPrice] = useState(0);
  const currency =
    currentInvoice.currency === PaymentCurrency.EUR
      ? "€"
      : currentInvoice.currency === PaymentCurrency.USD
      ? "$"
      : "₦";
  const resetForm = () => {
    setQuantity(1);
    setPrice(0);
    setAmount(0);
    closeModal();
  };
  if (!isOpen) return null;
  return (
    <div className="bg-black fixed z-40 top-0 right-0 left-0 bottom-0 h-full w-full bg-opacity-50">
      <div className="p-4 max-w-xl mx-auto absolute left-0 right-0 overflow-hidden mt-24">
        <div
          className="shadow absolute right-0 top-0 w-10 h-10 rounded-full bg-white text-gray-500 hover:text-gray-800 inline-flex items-center justify-center cursor-pointer"
          onClick={closeModal}
        >
          <FaTimes />
        </div>

        <form
          onReset={resetForm}
          onSubmit={(e) => {
            e.preventDefault();
            if (quantity === 0)
              return message.error("Quantity cannot be zero.");
            if (price === 0) return message.error("Price cannot be zero.");
            const lineItems = [...currentInvoice.lineItems];
            lineItems.unshift({
              key: uuidv4(),
              name: description,
              paid: false,
              price,
              quantity,
              amount,
            });
            dispatch(updateCurrentInvoice({ lineItems }));
            resetForm();
          }}
          className="shadow w-full  bg-white overflow-hidden block p-8"
        >
          <h2 className="font-bold text-2xl mb-6 text-gray-800 border-b pb-2">
            Add invoice items
          </h2>

          <div className="mb-4">
            <label className="text-gray-800 block mb-1 font-bold text-sm uppercase tracking-wide">
              Description
            </label>
            <Input
              size="small"
              required
              width="100%"
              className="w-full rounded border-coolGray-300"
              placeholder="Item description"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="mb-4 col-span-1">
              <label className="text-gray-800 block mb-1 font-bold text-sm uppercase tracking-wide">
                Units
              </label>

              <InputNumber
                controls={{
                  downIcon: <FaArrowCircleDown size={15} />,
                  upIcon: <FaArrowCircleUp size={15} />,
                }}
                onChange={(value) => {
                  const valueAsNumber = value as number;
                  setQuantity(valueAsNumber);
                  setAmount(valueAsNumber * price);
                }}
                size="large"
                required
                width="100%"
                className="w-full"
                value={quantity}
              />
            </div>

            <div className="mb-4 col-span-1">
              <label className="text-gray-800 block mb-1 font-bold text-sm uppercase tracking-wide">
                Unit Price
              </label>
              <InputNumber
                required
                controls={{
                  downIcon: <FaArrowCircleDown size={15} />,
                  upIcon: <FaArrowCircleUp size={15} />,
                }}
                formatter={(value) =>
                  `${currency} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                width="100%"
                className="w-full"
                // parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                onChange={(value) => {
                  const valueAsNumber = value as number;
                  setPrice(valueAsNumber);
                  setAmount(valueAsNumber * quantity);
                }}
                defaultValue={price}
                size="large"
              />
            </div>

            <div className="mb-4 col-span-1">
              <label className="text-gray-800 block mb-1 font-bold text-sm uppercase tracking-wide">
                Amount
              </label>
              <InputNumber
                value={amount}
                required
                controls={{
                  downIcon: <FaArrowCircleDown size={15} />,
                  upIcon: <FaArrowCircleUp size={15} />,
                }}
                size="large"
                formatter={(value) =>
                  `${currency} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                width="100%"
                className="w-full"
                contentEditable={false}
                disabled
              />
            </div>
          </div>

          <div className="mt-8 text-right">
            <button
              type="reset"
              className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded shadow-sm mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 border border-gray-700 rounded shadow-sm"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
