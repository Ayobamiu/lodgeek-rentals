import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../app/features/userSlice";
import { Link } from "react-router-dom";
import { selectSelectedCompany } from "../../app/features/companySlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCity,
  faCog,
  faEnvelopeCircleCheck,
  faFileLines,
  faMoneyBillTransfer,
  faUserCog,
  faUsers,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { SubscriptionNotification } from "../homepage/SubscriptionNotification";
import { FaThLarge } from "react-icons/fa";

export function DashboardSideBar() {
  const loggedInUser = useAppSelector(selectUser);
  const selectedCompany = useAppSelector(selectSelectedCompany);

  const ownerAccess = loggedInUser?.email === selectedCompany?.primaryOwner;
  return (
    <aside
      id="logo-sidebar"
      aria-labelledby="logo-sidebar"
      className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
      aria-label="logo-sidebar"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          <li>
            <Link
              to={`/dashboard/${selectedCompany?.id}/rentalRecords`}
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaThLarge className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              <span className="ml-3">Rental Records</span>
            </Link>
          </li>
          <li>
            <Link
              to={`/dashboard/${selectedCompany?.id}/properties`}
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FontAwesomeIcon
                icon={faCity}
                className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
              />
              <span className="flex-1 ml-3 whitespace-nowrap">Properties</span>
            </Link>
          </li>
          <li>
            <Link
              to={`/dashboard/${selectedCompany?.id}/invoices`}
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FontAwesomeIcon
                icon={faFileLines}
                className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
              />
              <span className="flex-1 ml-3 whitespace-nowrap">Invoices</span>
            </Link>
          </li>
          <li>
            <Link
              to={`/dashboard/${selectedCompany?.id}/payments`}
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FontAwesomeIcon
                icon={faMoneyBillTransfer}
                className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
              />
              <span className="flex-1 ml-3 whitespace-nowrap">Payments</span>
            </Link>
          </li>
          <li>
            <Link
              to={`/dashboard/${selectedCompany?.id}/clients`}
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FontAwesomeIcon
                icon={faUsers}
                className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
              />
              <span className="flex-1 ml-3 whitespace-nowrap">Clients</span>
            </Link>
          </li>
          {ownerAccess && (
            <li>
              <Link
                to={`/dashboard/${selectedCompany?.id}/bankRecords`}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FontAwesomeIcon
                  icon={faWallet}
                  className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                />
                <span className="flex-1 ml-3 whitespace-nowrap">Wallet</span>
              </Link>
            </li>
          )}
          <li>
            <Link
              to={`/dashboard/${selectedCompany?.id}/settings/profile`}
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FontAwesomeIcon
                icon={faCog}
                className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
              />
              <span className="flex-1 ml-3 whitespace-nowrap">Settings</span>
            </Link>
          </li>
          <li>
            <Link
              to={`/dashboard/${selectedCompany?.id}/settings/team`}
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FontAwesomeIcon
                icon={faUserCog}
                className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
              />
              <span className="flex-1 ml-3 whitespace-nowrap">
                Team management
              </span>
            </Link>
          </li>
          <li>
            <Link
              to={`/dashboard/${selectedCompany?.id}/settings/team`}
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FontAwesomeIcon
                icon={faEnvelopeCircleCheck}
                className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
              />
              <span className="flex-1 ml-3 whitespace-nowrap">
                Invite collaborators
              </span>
            </Link>
          </li>
        </ul>
        <SubscriptionNotification closable />
      </div>
    </aside>
  );
}
