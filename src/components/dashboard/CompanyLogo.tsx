import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { Popover } from "@headlessui/react";
import { Link } from "react-router-dom";
import { selectSelectedCompany } from "../../app/features/companySlice";
import { useAppSelector } from "../../app/hooks";

export function CompanyLogo(): JSX.Element {
  const selectedCompany = useAppSelector(selectSelectedCompany);

  return (
    <Popover className="relative">
      <Popover.Button>
        <div className="flex ml-2 md:mr-24">
          {selectedCompany?.logo ? (
            <img
              className="w-10 h-10 rounded-full mr-3"
              src={selectedCompany.logo}
              alt="Logo"
            />
          ) : (
            <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 mr-3">
              <span className="font-medium text-gray-600 dark:text-gray-300 uppercase">
                {selectedCompany?.name?.slice(0, 2)}
              </span>
            </div>
          )}

          <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
            {selectedCompany?.name}
          </span>
        </div>
      </Popover.Button>

      <Popover.Panel className="absolute z-40 w-80 dark:bg-[#222529] bg-white shadow-lg rounded-lg">
        <div className="p-4 border-b-[0.3px] flex items-center gap-3">
          <div className="rounded-lg bg-coolGray-400 w-10 h-10 flex justify-center items-center uppercase font-bold overflow-hidden">
            {selectedCompany?.logo ? (
              <img src={selectedCompany?.logo} alt="" />
            ) : (
              selectedCompany?.name?.slice(0, 2) || "-"
            )}
          </div>
          <div className="dark:text-white">
            <h1>{selectedCompany?.name}</h1>
            <small>{selectedCompany?.email}</small>
          </div>
        </div>
        {selectedCompany && (
          <Link
            to={`/dashboard/${selectedCompany?.id}/settings/reports`}
            className="p-4 border-b-[0.3px] flex items-center gap-3 cursor-pointer"
          >
            <div className="dark:text-white">
              <small>Financial reports </small>

              <span className="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">
                Pro
              </span>
            </div>
          </Link>
        )}
        {selectedCompany && (
          <Link
            to={`/dashboard/${selectedCompany?.id}/settings/team`}
            className="p-4 border-b-[0.3px] flex items-center gap-3 cursor-pointer"
          >
            <div className="dark:text-white">
              <small>Team management</small>
            </div>
          </Link>
        )}
        {selectedCompany && (
          <Link
            to={`/dashboard/${selectedCompany?.id}/settings/team`}
            className="p-4 border-b-[0.3px] flex items-center gap-3 cursor-pointer"
          >
            <div className="dark:text-white">
              <small>Invite people to {selectedCompany?.name}</small>
            </div>
          </Link>
        )}
        {selectedCompany && (
          <Link
            to={`/dashboard/${selectedCompany?.id}/settings/profile`}
            className="p-4 border-b-[0.3px] flex items-center gap-3 cursor-pointer"
          >
            <div className="dark:text-white">
              <small>Settings & Administration</small>
            </div>
          </Link>
        )}
        <Link
          to="/select-accounts"
          className="p-4 flex items-center gap-3 cursor-pointer"
        >
          <div className="dark:text-white">
            <small>Switch Workspaces</small>
          </div>
        </Link>

        <img src="/solutions.jpg" alt="" />
      </Popover.Panel>
    </Popover>
  );
}
