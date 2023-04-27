import { Dropdown, MenuProps, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import {
  EditOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import moment from "moment";
import formatPrice from "../../utils/formatPrice";
import { selectPayment } from "../../app/features/paymentSlice";
import { useAppSelector } from "../../app/hooks";
import { Payment } from "../../models";
import { useNavigate } from "react-router-dom";
import usePayments from "../../hooks/usePayments";

const PaymentsTable = () => {
  const navigate = useNavigate();
  const { deletePaymentFromDatabaseAndStore } = usePayments();
  const columns: ColumnsType<Payment> = [
    {
      title: "CLIENT",
      dataIndex: "client",
      key: "client",
      responsive: ["md"],
    },
    {
      title: "DATE",
      dataIndex: "date",
      key: "date",
      responsive: ["md"],
      render: (_, { createdAt }) => (
        <div className="border-none" key={createdAt}>
          {moment(createdAt).format("ll")}
        </div>
      ),
    },
    {
      title: "PAYMENT DETAILS",
      dataIndex: "details",
      key: "details",
      responsive: ["md"],
      render: (text) => (
        <div className="truncate max-w-[200px]">
          <a>{text}</a>
        </div>
      ),
    },
    {
      title: "PAYMENT TYPE",
      dataIndex: "method",
      key: "method",
      responsive: ["md"],
    },
    {
      title: "AMOUNT",
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
      key: "status",
      dataIndex: "status",
      render: (_, { status }) => {
        return (
          <Tag className="border-none" key={status}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "ACTION",
      key: "action",
      render: (_, record) => {
        const items: MenuProps["items"] = [
          {
            key: "2",
            label: <button>Edit</button>,
            icon: <EditOutlined />,
            disabled: true,
          },
          {
            key: "3",
            label: <button>Download</button>,
            icon: <DownloadOutlined />,
            onClick: () => {
              navigate(`/view-receipt/${record.id}`);
            },
          },
          {
            type: "divider",
          },
          {
            key: "4",
            label: <button>Delete</button>,
            icon: <DeleteOutlined />,
            danger: true,
            // disabled: record.method !== PaymentMethod.Cash,
            onClick: () => {
              deletePaymentFromDatabaseAndStore(record.id);
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
  const { payments } = useAppSelector(selectPayment);

  function sortByDate(payments_: Payment[]) {
    payments_.sort((a, b) => b.createdAt - a.createdAt);
    return payments_;
  }
  const sortedPayments = sortByDate([...payments]);

  return (
    <>
      <Table
        size="large"
        columns={columns}
        dataSource={sortedPayments}
        scroll={{ x: "100%" }}
      />
    </>
  );
};

export default PaymentsTable;
