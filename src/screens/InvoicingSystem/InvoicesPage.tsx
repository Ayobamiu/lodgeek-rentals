import { Tabs, TabsProps } from "antd";
import DashboardWrapper from "../../components/dashboard/DashboardWrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { InvoicesStats } from "./InvoicesStats";
import InvoicesTable from "./InvoicesTable";
import { useNavigate } from "react-router-dom";
import { selectSelectedCompany } from "../../app/features/companySlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { resetCurrentInvoice } from "../../app/features/invoiceSlice";
/* 

//TODOS: 
2. Reciept page for rent payment ✅
5. Email for company when invoice is paid ✅
6. Change email sent when rent is paid ✅
2. Reciept page for invoice paid ✅
3. Remit money after invoice is paid ✅
4. Add, and edit payments ✅
1. Write Cloud function to update invoices and generate recurring invoices. 
7. Update Add payment page.
*/
// const items: MenuProps["items"] = [
//   {
//     key: "1",
//     label: <button>Print</button>,
//     icon: <PrinterOutlined />,
//   },
//   {
//     key: "2",
//     label: <button>Export to Excel</button>,
//     icon: <ExportOutlined />,
//   },
// ];
const tabItems: TabsProps["items"] = [
  {
    key: "1",
    label: `All Invoices`,
    children: <InvoicesTable />,
  },
  // {
  //   key: "2",
  //   label: `Recurring Invoices`,
  //   children: <RecurringInvoicesTable />,
  // },
];

const InvoicesPage = () => {
  const selectedCompany = useAppSelector(selectSelectedCompany);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  return (
    <DashboardWrapper className="px-0">
      <div className="p-4 bg-coolGray-50">
        <h2 className="mb-5 text-xl font-bold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white">
          Invoices
        </h2>
        <div className="flex items-center mb-5 gap-x-3">
          <button
            onClick={() => {
              dispatch(resetCurrentInvoice());
              navigate(`/dashboard/${selectedCompany?.id}/invoices/new`);
            }}
            className="inline-flex gap-x-3 items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-green-700 rounded hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>
              Add <div className="hidden lg:inline-block">Invoices</div>
            </span>
          </button>
          <div className="ml-auto flex items-center gap-x-3">
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
              />
            </div>

            {/* <Dropdown menu={{ items }}>
              <button
                type="button"
                className="text-green-500 justify-center w-9 bg-green-100 hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                <FontAwesomeIcon icon={faEllipsisV} />
                <span className="sr-only">Icon description</span>
              </button>
            </Dropdown> */}
          </div>
        </div>

        {/* Summary metrics */}
        <InvoicesStats />
        <Tabs defaultActiveKey="1" items={tabItems} onChange={() => {}} />
      </div>
    </DashboardWrapper>
  );
};

export default InvoicesPage;
