import { useState } from "react";
import { Modal } from "antd";
import CurrencyInput from "react-currency-input-field";
import {
  CompanyUser,
  FirebaseCollections,
  Payment,
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
  const [details, setDetails] = useState("");
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState<PaymentMethod>();
  const [status, setStatus] = useState<PaymentStatus>();
  const payMethods = [
    PaymentMethod.Bank,
    PaymentMethod.Cash,
    PaymentMethod.Card,
    PaymentMethod.Other,
  ];
  const payStatuses = [
    PaymentStatus.Paid,
    PaymentStatus.Failed,
    PaymentStatus.Pending,
  ];
  return (
    <Modal
      title="Add Payment"
      open={isModalOpen}
      onOk={closeModal}
      onCancel={closeModal}
      footer={null}
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!client || !type || !selectedCompany || !status) return;
          const paymentId = generateFirebaseId(FirebaseCollections.payment);
          const receiptNumber = generateReceiptNumber(
            selectedCompany?.name || "",
            selectedCompany?.numberOfReceipts || 0
          );

          const payment: Payment = {
            amount,
            forRent: false,
            client: client.name,
            clientEmail: client.email,
            companyId: selectedCompany.id,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            currency: PaymentCurrency.NGN,
            details,
            id: paymentId,
            invoiceId: "",
            method: type,
            receiptUrl: "",
            status,
            completedAt: Date.now(),
            receiptData: {
              amountPaid: amount,
              balanceDue: 0,
              datePaid: Date.now(),
              itemsDue: [],
              itemsPaid: [
                {
                  amount,
                  key: uuidv4(),
                  name: details,
                  paid: status === PaymentStatus.Paid,
                  price: amount,
                  quantity: 1,
                },
              ],
              paymentId,
              receiptNumber,
              paymentMethod: type,
              currency: PaymentCurrency.NGN,
              customerCompanyName: client.name,
              senderCompanyLogo: selectedCompany.logo,
              senderCompanyName: selectedCompany.name,
            },
          };
          await addPaymentToDatabaseAndStore(payment).finally(() => {
            closeModal();
          });
        }}
        onReset={() => {
          closeModal();
        }}
      >
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
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Payment Details
          </label>
          <textarea
            required
            id="description"
            rows={4}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter Payment Description"
            onChange={(e) => {
              setDetails(e.target.value);
            }}
          ></textarea>
        </div>
        <div className="mb-3">
          <label
            htmlFor="amount"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Amount
          </label>
          <CurrencyInput
            id="amount"
            name="amount"
            placeholder="Enter Amount"
            decimalsLimit={2}
            onValueChange={(value) => {
              setAmount(Number(value));
            }}
            required
            prefix="₦ "
            value={amount}
            className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
          />
        </div>
        <div className="mb-3 grid grid-cols-2 gap-3">
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
                <option value={i}>{i}</option>
              ))}
            </select>
          </div>
          <div className="col-span-1">
            <label
              htmlFor="status"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Status
            </label>
            <select
              id="status"
              required
              onChange={(e) => {
                setStatus(e.target.value as PaymentStatus);
              }}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option selected>Select Status</option>
              {payStatuses.map((i) => (
                <option value={i}>{i}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="w-full flex justify-end gap-3">
          <button
            type="reset"
            className=" bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={addingPayment}
            className="flex justify-center items-center  gap-x-3 disabled:bg-gray-400 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit {addingPayment && <ActivityIndicator size="4" />}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddPaymentModal;
