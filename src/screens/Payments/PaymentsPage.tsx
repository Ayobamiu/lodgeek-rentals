import { useState } from "react";
import DashboardWrapper from "../../components/dashboard/DashboardWrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import PaymentsTable from "./PaymentsTable";
import AddPaymentModal from "./AddPaymentModal";
import {
  resetSelectedPayment,
  selectPayment,
} from "../../app/features/paymentSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ExportOutlined } from "@ant-design/icons";
import { convertPaymentDataToExcel } from "../../functions/convertToExcel";
import { Payment } from "../../models";
import moment from "moment";

// const items: MenuProps["items"] = [
//   {
//     key: "1",
//     label: <button>All</button>,
//   },
//   {
//     key: "2",
//     label: <button>Last Week</button>,
//   },
//   {
//     key: "3",
//     label: <button>Last Month</button>,
//   },
//   {
//     key: "4",
//     label: <button>Last Year</button>,
//   },
// ];

const PaymentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { payments } = useAppSelector(selectPayment);

  function sortByDate(payments_: Payment[]) {
    payments_.sort((a, b) => b.createdAt - a.createdAt);
    return payments_;
  }
  const sortedPayments = sortByDate([...payments]);

  const paymentToExport = [...sortedPayments].map((i) => {
    const pay = {
      id: i.id,
      client: i.client,
      amount: i.amount,
      clientEmail: i.clientEmail,
      createdAt: moment(i.createdAt).format("ll"),
      currency: i.currency,
      details: i.details,
      method: i.method,
      status: i.status,
      updatedAt: i.updatedAt,
      propertyName: i.propertyName,
    };
    return pay;
  });

  function handleExport() {
    const excelBuffer = convertPaymentDataToExcel(paymentToExport);
    const fileName = "payments.xlsx";
    const blob = new Blob([excelBuffer], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
  }

  return (
    <DashboardWrapper className="px-0">
      <AddPaymentModal
        isModalOpen={isModalOpen}
        closeModal={() => {
          setIsModalOpen(false);
        }}
      />
      <div className="p-4 bg-coolGray-50">
        <h2 className="mb-5 text-xl font-bold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white">
          Payments
        </h2>
        <div className="flex items-center mb-5 gap-x-3">
          <button
            type="button"
            onClick={() => {
              setIsModalOpen(true);
              dispatch(resetSelectedPayment());
            }}
            className="inline-flex gap-x-3 items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-green-700 rounded hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>
              Add <div className="hidden lg:inline-block">Payments</div>
            </span>
          </button>
          <div className="ml-auto flex items-center gap-x-3">
            {/* <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="  text-gray-500 dark:text-gray-400"
                />
              </div>
              <input
                type="search"
                id="search"
                className="block w-full pl-10 text-sm text-gray-900 border border-gray-300 rounded bg-gray-50 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                placeholder="Search"
                required
              />
            </div> */}

            {/* <Dropdown menu={{ items }}>
              <button
                type="button"
                className="text-green-500 justify-center w-9 bg-green-100 hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                <FontAwesomeIcon icon={faEllipsisV} />
                <span className="sr-only">Icon description</span>
              </button>
            </Dropdown> */}
            <button
              type="button"
              onClick={handleExport}
              title="Export to Excel"
              className="text-green-500 justify-center gap-3 bg-green-100 hover:bg-green-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              <span className="lg:block hidden">Export to Excel</span>
              <ExportOutlined />
              <span className="sr-only">Icon description</span>
            </button>
          </div>
        </div>

        {/* Summary metrics */}
        {/* <InvoicesStats /> */}
        <PaymentsTable />
      </div>
    </DashboardWrapper>
  );
};

export default PaymentsPage;
