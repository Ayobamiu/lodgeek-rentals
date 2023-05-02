import { Dropdown, MenuProps, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PauseOutlined,
  StopOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import formatPrice from "../../utils/formatPrice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectSelectedCompany } from "../../app/features/companySlice";
import {
  Invoice,
  RecurringInvoiceStatusColor,
  RecurringInvoiceStatus,
} from "../../models/index";
import {
  selectInvoice,
  setCurrentInvoice,
} from "../../app/features/invoiceSlice";
import useInvoice from "../../hooks/useInvoice";

const RecurringInvoicesTable = () => {
  const selectedCompany = useAppSelector(selectSelectedCompany);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { deleteSavedInvoice, updateRecurringInvoiceStatus } = useInvoice();

  const columns: ColumnsType<Invoice> = [
    {
      title: "INV NO",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "CLIENT",
      dataIndex: "customer",
      key: "customer",
      responsive: ["md"],
      render: (_, { customer }) => (
        <div className="border-none" key={customer.email}>
          {customer.name}
        </div>
      ),
    },
    // {
    //   title: "EMAIL",
    //   dataIndex: "customer",
    //   key: "customer",
    //   responsive: ["md"],
    //   render: (_, { customer }) => (
    //     <div className="border-none" key={customer.email}>
    //       {customer.email}
    //     </div>
    //   ),
    // },
    {
      title: "Frequency",
      dataIndex: "frequency",
      key: "frequency",
      responsive: ["md"],
      render: (_, { frequency }) => (
        <div className="border-none" key={frequency}>
          {frequency}
        </div>
      ),
    },
    {
      title: "Start date",
      dataIndex: "startDate",
      key: "startDate",
      responsive: ["md"],
      render: (_, { startDate }) => (
        <div className="border-none" key={startDate}>
          {moment(startDate).format("ll")}
        </div>
      ),
    },
    {
      title: "End date",
      dataIndex: "endDate",
      key: "endDate",
      responsive: ["md"],
      render: (_, { endDate }) => (
        <div className="border-none" key={endDate}>
          {moment(endDate).format("ll")}
        </div>
      ),
    },
    {
      title: "Amount due",
      dataIndex: "amount",
      key: "amount",
      render: (_, { amount }) => (
        <div className="border-none" key={amount}>
          {formatPrice(amount)}
        </div>
      ),
    },

    {
      title: "Status",
      key: "recurringInvoiceStatus",
      dataIndex: "recurringInvoiceStatus",
      render: (_, { recurringInvoiceStatus }) => {
        const statusColor =
          RecurringInvoiceStatusColor[recurringInvoiceStatus!];
        return (
          <Tag
            className="border-none"
            color={statusColor}
            key={recurringInvoiceStatus}
          >
            {recurringInvoiceStatus?.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Next payment date",
      dataIndex: "nextPaymentDate",
      key: "nextPaymentDate",
      responsive: ["md"],
      render: (_, { nextPaymentDate }) => (
        <div className="border-none" key={nextPaymentDate}>
          {moment(nextPaymentDate).format("ll")}
        </div>
      ),
    },
    {
      title: "ACTION",
      key: "action",
      render: (_, record) => {
        const items: MenuProps["items"] = [
          {
            key: "1",
            label: <button>View</button>,
            icon: <EyeOutlined />,
            onClick: () => {
              dispatch(setCurrentInvoice(record));
              navigate(`/dashboard/invoices/${record.id}`);
            },
          },
          {
            key: "2",
            label: <button>Edit</button>,
            icon: <EditOutlined />,
            onClick: () => {
              dispatch(setCurrentInvoice(record));
              navigate(
                `/dashboard/${selectedCompany?.id}/invoices/edit/${record.id}`
              );
            },
          },
          {
            key: "3",
            label: <button>Pause</button>,
            icon: <PauseOutlined />,
            onClick: () => {
              updateRecurringInvoiceStatus(
                record,
                RecurringInvoiceStatus.Paused
              );
            },
            disabled:
              record.recurringInvoiceStatus !== RecurringInvoiceStatus.Active,
          },
          {
            key: "4",
            label: <button>Resume</button>,
            icon: <PlayCircleOutlined />,
            onClick: () => {
              updateRecurringInvoiceStatus(
                record,
                RecurringInvoiceStatus.Active
              );
            },
            disabled:
              record.recurringInvoiceStatus !== RecurringInvoiceStatus.Paused,
          },
          {
            key: "5",
            label: <button>Stop</button>,
            icon: <StopOutlined />,
            danger: true,
            onClick: () => {
              updateRecurringInvoiceStatus(
                record,
                RecurringInvoiceStatus.Cancelled
              );
            },
            disabled:
              record.recurringInvoiceStatus &&
              [
                RecurringInvoiceStatus.Cancelled,
                RecurringInvoiceStatus.Completed,
              ].includes(record.recurringInvoiceStatus),
          },
          {
            type: "divider",
          },
          {
            key: "6",
            label: <button>Delete</button>,
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => {
              deleteSavedInvoice(record.id);
            },
          },
        ];
        return (
          <Dropdown trigger={["click"]} menu={{ items }}>
            <div className="flex justify-center">
              <button
                type="button"
                className="text-green-500 justify-center w-9 bg-green-100 hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                <FontAwesomeIcon icon={faEllipsisV} />
                <span className="sr-only">Icon description</span>
              </button>
            </div>
          </Dropdown>
        );
      },
    },
  ];
  const { invoices } = useAppSelector(selectInvoice);
  const recurringInvoices = invoices.filter((i) => i.recurring);
  return (
    <Table
      size="large"
      columns={columns}
      dataSource={recurringInvoices}
      //   pagination={{ defaultPageSize: 2 }}
      scroll={{ x: "100%" }}
    />
  );
};

export default RecurringInvoicesTable;
