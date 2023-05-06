import { useMemo, useState } from "react";
import { message, Modal, ModalFuncProps } from "antd";
import CurrencyInput from "react-currency-input-field";
import {
  Company,
  CompanyUser,
  FirebaseCollections,
  InvoiceItem,
  Payment,
  PaymentCategories,
  PaymentCurrency,
  PaymentMethod,
  PaymentStatus,
} from "../../models";
import { selectCompanyUser } from "../../app/features/companyUserSlice";
import { useAppSelector } from "../../app/hooks";
import { selectSelectedCompany } from "../../app/features/companySlice";
import { generateFirebaseId } from "../../firebase/config";
import { v4 as uuidv4 } from "uuid";
import { generateReceiptNumber } from "../../utils/generateInvoiceNumber";
import usePayments from "../../hooks/usePayments";
import ActivityIndicator from "../../components/shared/ActivityIndicator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import formatPrice from "../../utils/formatPrice";
import { summarizeList } from "../../utils/summarizeList";
import { updateCompanyInDatabase } from "../../firebase/apis/company";

const AddPaymentModal = ({
  closeModal,
  isModalOpen,
}: {
  isModalOpen: boolean;
  closeModal: () => void;
}) => {
  const { companyUsers } = useAppSelector(selectCompanyUser);
  const selectedCompany = useAppSelector(selectSelectedCompany);
  const { addPaymentToDatabaseAndStore, addingPayment } = usePayments();
  const [client, setClient] = useState<CompanyUser>();
  const [type, setType] = useState<PaymentMethod>();
  const [category, setCategory] = useState<PaymentCategories>();
  const [itemsPaid, setItemsPaid] = useState<InvoiceItem[]>([]);
  const [currency, setCurrency] = useState<PaymentCurrency>(
    PaymentCurrency.NGN
  );

  const [newDescription, setNewDescription] = useState("");
  const [newQty, setNewQty] = useState(1);
  const [newPrice, setNewPrice] = useState(0);
  const [newAmount, setNewAmount] = useState(0);
  const [transactionFee, setTransactionFee] = useState(0);
  const paymentCategoriesArray = Object.values(PaymentCategories);

  const { total } = useMemo(() => {
    const subTotal = itemsPaid.reduce(
      (n, { price, quantity }) => n + price * quantity,
      0
    );
    return { subTotal, total: subTotal + transactionFee };
  }, [itemsPaid]);

  const payMethods = Object.values(PaymentMethod);
  const currencyOptions = [
    { value: PaymentCurrency.NGN, label: PaymentCurrency.NGN },
    // { value: PaymentCurrency.USD, label: PaymentCurrency.USD },
    // { value: PaymentCurrency.EUR, label: PaymentCurrency.EUR },
  ];
  const addNewPayment = async () => {
    if (!selectedCompany) {
      return message.error(
        "Error getting your account info, Reload and try again!"
      );
    }
    if (!client) {
      return message.error("Select a client");
    }
    if (!type) {
      return message.error("Select Payment Type");
    }
    if (!category) {
      return message.error("Select Payment Category");
    }
    if (!itemsPaid.length) {
      return message.error("Add at least one item.");
    }
    const paymentId = generateFirebaseId(FirebaseCollections.payment);
    const receiptNumber = generateReceiptNumber(
      selectedCompany?.name || "",
      selectedCompany?.numberOfReceipts || 0
    );

    const updatedCompany: Company = {
      ...selectedCompany,
      numberOfReceipts: (selectedCompany.numberOfReceipts || 0) + 1,
    };

    const payment: Payment = {
      amount: total,
      forRent: false,
      client: client.name,
      clientEmail: client.email,
      companyId: selectedCompany.id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      currency,
      details: summarizeList(
        itemsPaid.map((i) => i.name),
        50
      ),
      id: paymentId,
      invoiceId: "",
      method: type,
      receiptUrl: "",
      status: PaymentStatus.Paid,
      completedAt: Date.now(),
      category,
      receiptData: {
        amountPaid: total,
        balanceDue: 0,
        datePaid: Date.now(),
        itemsDue: [],
        itemsPaid,
        paymentId,
        receiptNumber,
        paymentMethod: type,
        currency,
        customerCompanyName: client.name,
        senderCompanyLogo: selectedCompany.logo,
        senderCompanyName: selectedCompany.name,
      },
    };
    await addPaymentToDatabaseAndStore(payment)
      .then(async () => {
        await updateCompanyInDatabase(updatedCompany);
      })
      .finally(() => {
        closeModal();
      });
  };
  const addNewLineItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newDescription) {
      return message.error("Description is required.");
    }
    if (newQty === 0) {
      return message.error("Quantity can not be zero.");
    }
    if (newPrice === 0) {
      return message.error("Price can not be zero.");
    }
    const newItem: InvoiceItem = {
      amount: newAmount,
      key: uuidv4(),
      name: newDescription,
      paid: true,
      price: newPrice,
      quantity: newQty,
    };
    setItemsPaid((v) => [...v, newItem]);
    setNewAmount(0);
    setNewDescription("");
    setNewPrice(0);
    setNewQty(1);
    e.currentTarget.reset();
  };
  return (
    <Modal
      title="Add Payment"
      open={isModalOpen}
      onOk={closeModal}
      onCancel={closeModal}
      footer={null}
      width={800}
    >
      <div>
        <div className="mb-3">
          <label
            htmlFor="client"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Client
          </label>
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            id="inline-full-name"
            placeholder="Select Client"
            onChange={(e) => {
              const value = companyUsers.find((i) => i.id === e.target.value);
              setClient(value);
            }}
          >
            <option selected>Select Client</option>
            {companyUsers.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <div className="my-3 grid grid-cols-2 gap-3">
            <div className="col-span-1">
              <label
                htmlFor="paymentType"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Payment Type
              </label>
              <select
                required
                id="paymentType"
                onChange={(e) => {
                  setType(e.target.value as PaymentMethod);
                }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option selected>Select Payment Type</option>
                {payMethods.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-1">
              <label
                htmlFor="currency"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Currency
              </label>
              <select
                id="currency"
                required
                defaultValue={currency}
                onChange={(e) => {
                  setCurrency(e.target.value as PaymentCurrency);
                }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option selected>Select Currency</option>
                {currencyOptions.map((i, index) => (
                  <option key={index} value={i.value}>
                    {i.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-1">
              <label
                htmlFor="paymentType"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Payment Category
              </label>
              <select
                required
                id="paymentCategory"
                onChange={(e) => {
                  setCategory(e.target.value as PaymentCategories);
                }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option selected>Select Payment Category</option>
                {paymentCategoriesArray.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-5 mb-10">
            <label
              htmlFor="Items"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Items
            </label>
            <div className="grid grid-cols-9  gap-3 border-b">
              <div className="col-span-3  ">Description</div>
              <div className="col-span-2  ">Qty</div>
              <div className="col-span-2  ">Price</div>
              <div className="col-span-2  ">Total</div>
            </div>
            {itemsPaid.map((i) => (
              <div
                key={i.key}
                className="grid grid-cols-9 mt-5 gap-3 border-b pb-2 relative"
              >
                <button
                  type="button"
                  onClick={deleteLineItem(itemsPaid, i, setItemsPaid)}
                  className="absolute h-5 w-5  -right-5"
                >
                  <FontAwesomeIcon icon={faTimesCircle} color={"red"} />
                </button>

                <div className="col-span-3  ">{i.name}</div>
                <div className="col-span-2  ">{i.quantity}</div>
                <div className="col-span-2  ">{formatPrice(i.price)}</div>
                <div className="col-span-2  ">{formatPrice(i.amount)}</div>
              </div>
            ))}
            {!itemsPaid.length && (
              <div className="border p-2 rounded bg-gray-200 flex justify-center items-center my-3 w-full">
                No items added yet.
              </div>
            )}
            <div className="flex justify-end items-center flex-wrap gap-3 mt-3">
              <div className="h-10 block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <strong>Total</strong>: {formatPrice(total)}
              </div>
            </div>
            <form onSubmit={addNewLineItem}>
              <div className="grid grid-cols-9 mt-5  mb-3 gap-3 relative">
                <div className="col-span-3 h-10 ">
                  <textarea
                    id="newDescription"
                    placeholder="Description"
                    className="h-full block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={(e) => {
                      setNewDescription(e.target.value);
                    }}
                    defaultValue={newDescription}
                    required
                  ></textarea>
                </div>
                <div className="col-span-2 h-10 ">
                  <input
                    type="number"
                    name=""
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-full appearance-none"
                    onChange={(e) => {
                      setNewQty(e.target.valueAsNumber || 0);
                      setNewAmount((e.target.valueAsNumber || 0) * newPrice);
                    }}
                    defaultValue={newQty}
                    id="newQty"
                    required
                  />
                </div>
                <div className="col-span-2 h-10 ">
                  <CurrencyInput
                    id="newPrice"
                    name="newPrice"
                    decimalsLimit={2}
                    prefix="₦ "
                    value={newPrice}
                    className="input_without_button block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-full"
                    onValueChange={(e) => {
                      setNewPrice(Number(e || 0));
                      setNewAmount(Number(e || 0) * newQty);
                    }}
                  />
                </div>
                <div className="col-span-2 h-10 ">
                  <CurrencyInput
                    id="newAmount"
                    name="newAmount"
                    decimalsLimit={2}
                    prefix="₦ "
                    value={newAmount}
                    className="input_without_button block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-full"
                    contentEditable={false}
                    disabled
                  />
                </div>
              </div>
              <div className="flex justify-between items-center flex-wrap gap-3">
                <button
                  type="submit"
                  className="flex justify-center items-center gap-x-3 disabled:bg-gray-400 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <FontAwesomeIcon icon={faPlus} /> Add item{" "}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="w-full flex justify-end gap-3">
          <button
            onClick={closeModal}
            className=" bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
          >
            Cancel
          </button>
          <button
            disabled={addingPayment}
            onClick={addNewPayment}
            className="flex justify-center items-center  gap-x-3 disabled:bg-gray-400 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit {addingPayment && <ActivityIndicator size="4" />}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddPaymentModal;
function deleteLineItem(
  itemsPaid: InvoiceItem[],
  i: InvoiceItem,
  setItemsPaid: React.Dispatch<React.SetStateAction<InvoiceItem[]>>
) {
  return () => {
    const config: ModalFuncProps = {
      title: "Delete item!",
      content: "All data about this item will be lost.",
      okButtonProps: {
        className: "bg-blue-500",
        type: "primary",
      },
      onOk: () => {
        const v = [...itemsPaid].filter((x) => x.key !== i.key);
        setItemsPaid(v);
      },
    };
    Modal.confirm(config);
  };
}
