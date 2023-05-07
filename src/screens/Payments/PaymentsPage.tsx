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
import { getPaymentsBetweenDates } from "../../utils/getPaymentsBetweenDates";
import { Button, DatePicker, Dropdown, MenuProps, message, Modal } from "antd";
import { dateRanges } from "../../utils/getDateRangeLabel";
import ActivityIndicator from "../../components/shared/ActivityIndicator";
import { RangePickerProps } from "antd/es/date-picker";

const PaymentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { payments } = useAppSelector(selectPayment);

  function sortByDate(payments_: Payment[]) {
    payments_.sort((a, b) => b.createdAt - a.createdAt);
    return payments_;
  }
  const sortedPayments = sortByDate([...payments]);

  function paymentToExport(_payments_: Payment[]): any[] {
    return [..._payments_].map((i) => {
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
  }

  const [exporting, setExporting] = useState(false);
  function handleExportByDate(startDate: number, endDate: number) {
    setExporting(true);
    const targetedPayments = getPaymentsBetweenDates(
      startDate,
      endDate,
      sortedPayments
    );
    const excelBuffer = convertPaymentDataToExcel(
      paymentToExport(targetedPayments)
    );
    const fileName = "payments.xlsx";
    const blob = new Blob([excelBuffer], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    setExporting(false);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
  }

  const items: MenuProps["items"] = [
    ...dateRanges.map((i, index) => {
      return {
        key: (index + 1).toString(),
        label: i.label,
        onClick: () => {
          handleExportByDate(i.startDate, i.endDate);
        },
      };
    }),
    {
      label: "Custom Date range",
      key: "0",
      onClick: () => showDateRangeModal(),
    },
  ];

  const [openDateRangeModal, setOpenDateRangeModal] = useState(false);
  const showDateRangeModal = () => {
    setOpenDateRangeModal(true);
  };
  const handleCancel = () => {
    setOpenDateRangeModal(false);
  };
  const { RangePicker } = DatePicker;
  const [startDate, setStartDate] = useState<number>();
  const [endDate, setEndDate] = useState<number>();
  const onChangeDateRange = (value: RangePickerProps["value"]) => {
    const startDate_ = value && value[0];
    const endDate_ = value && value[1];

    setStartDate(startDate_?.toDate().getTime());
    setEndDate(endDate_?.toDate().getTime());
  };

  return (
    <DashboardWrapper className="px-0">
      {/* Date range */}
      <Modal
        open={openDateRangeModal}
        title="Select date range"
        width={400}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,

          <Button
            type="primary"
            loading={exporting}
            className="bg-blue-500"
            onClick={() => {
              if (startDate && endDate) {
                handleExportByDate(startDate, endDate);
                handleCancel();
              } else {
                message.warning("Select start and end dates.");
              }
            }}
          >
            Export
          </Button>,
        ]}
      >
        <RangePicker onChange={onChangeDateRange} className="w-full" />
      </Modal>
      {/* Date range */}

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
            <Dropdown trigger={["click"]} menu={{ items }} disabled={exporting}>
              <button
                type="button"
                title="Export to Excel"
                className="text-green-500 disabled:text-gray-500 justify-center gap-3 bg-green-100 disabled:bg-gray-400 hover:bg-green-500 disabled:hover:bg-gray-500 hover:text-white disabled:hover:text-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                <span className="lg:block hidden">Export to Excel</span>
                <ExportOutlined /> {exporting && <ActivityIndicator size="4" />}
              </button>
            </Dropdown>
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
