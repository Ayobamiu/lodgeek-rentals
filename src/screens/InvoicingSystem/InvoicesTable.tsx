import { Dropdown, MenuProps, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faSearch } from "@fortawesome/free-solid-svg-icons";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import moment from "moment";
import formatPrice from "../../utils/formatPrice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectSelectedCompany } from "../../app/features/companySlice";
import { Invoice, InvoiceStatus, InvoiceStatusColor } from "../../models/index";
import {
  selectInvoice,
  setCurrentInvoice,
} from "../../app/features/invoiceSlice";
import useInvoice from "../../hooks/useInvoice";
import { copyToClipboard } from "../../utils/copyToClipboard";
import FuzzySearch from "fuzzy-search";
import { useState } from "react";

type InvoiceSearchKey = keyof Invoice;

const invoiceSearchKeys: InvoiceSearchKey[] = [
  "amount",
  "amountPaid",
  "balanceDue",
  "customerName",
  "customerCompanyName",
  "customerCompanyAddress",
  "customerCompanyPhone",
  "customerCompanyEmail",
  "customerAdditionalInfo",
  "senderName",
  "senderCompanyName",
  "senderCompanyAddress",
  "senderCompanyPhone",
  "senderCompanyEmail",
  "senderAdditionalInfo",
  "description",
  "invoiceNumber",
  "notes",
  "propertyName",
  "status",
];
const InvoicesTable = () => {
  const selectedCompany = useAppSelector(selectSelectedCompany);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { deleteSavedInvoice } = useInvoice();
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
      title: "DATE",
      dataIndex: "date",
      key: "date",
      responsive: ["md"],
      render: (_, { date }) => (
        <div className="border-none" key={date}>
          {moment(date).format("ll")}
        </div>
      ),
    },
    {
      title: "BILLED",
      dataIndex: "amount",
      key: "amount",
      render: (_, { amount }) => (
        <div className="border-none" key={amount}>
          {formatPrice(amount)}
        </div>
      ),
    },
    {
      title: "AMOUNT PAID",
      dataIndex: "amountPaid",
      key: "amountPaid",
      render: (_, { amountPaid }) => (
        <div className="border-none" key={amountPaid}>
          {formatPrice(amountPaid)}
        </div>
      ),
    },
    {
      title: "BALANCE",
      dataIndex: "balanceDue",
      key: "balanceDue",
      render: (_, { balanceDue }) => (
        <div className="border-none" key={balanceDue}>
          {formatPrice(balanceDue)}
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (_, { status }) => {
        const statusColor = InvoiceStatusColor[status];
        return (
          <Tag className="border-none" color={statusColor} key={status}>
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
            disabled: record.status === InvoiceStatus.Paid,
          },
          {
            key: "3",
            label: <button>Payment link</button>,
            icon: <CopyOutlined />,
            onClick: () => {
              const paymentLink = `${process.env.REACT_APP_BASE_URL}pay-for-invoice/${record.id}`;
              copyToClipboard(paymentLink);
            },
            disabled: record.status === InvoiceStatus.Paid,
          },
          // {
          //   key: "3",
          //   label: <button> Download</button>,
          //   icon: <DownloadOutlined />,
          //   disabled: !record.url,
          //   onClick: () => {
          //     downloadFile(record.url, `${record.invoiceNumber}.png`);
          //   },
          // },
          {
            type: "divider",
          },
          {
            key: "4",
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
  function sortByDate(invoices_: Invoice[]) {
    invoices_.sort((a, b) => b.date - a.date);
    return invoices_;
  }
  const sortedInvoices = sortByDate([...invoices]);

  const [searchQuery, setSearchQuery] = useState("");
  const searcher = new FuzzySearch(sortedInvoices, invoiceSearchKeys, {
    caseSensitive: false,
  });
  let searchResults = sortedInvoices;
  if (searchQuery) {
    searchResults = searcher.search(searchQuery);
  }

  return (
    <>
      <div className="flex justify-end mb-5">
        <div className="relative">
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
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
          />
        </div>
      </div>
      <Table
        size="large"
        columns={columns}
        dataSource={searchResults}
        //   pagination={{ defaultPageSize: 2 }}
        scroll={{ x: "100%" }}
      />
    </>
  );
};

export default InvoicesTable;
