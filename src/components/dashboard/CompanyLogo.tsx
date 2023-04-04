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
        <div className="p-2 max-w-[120px] h-10 flex justify-center items-center font-bold uppercase truncate text-white gap-x-3">
          <p className="truncate">{selectedCompany?.name}</p>{" "}
          <FontAwesomeIcon icon={faAngleDown} />
        </div>
      </Popover.Button>

      <Popover.Panel className="absolute z-40 h-80 w-80 bg-[#222529] rounded-lg">
        <div className="p-4 border-b-[0.3px] flex items-center gap-3">
          <div className="rounded-lg bg-coolGray-400 w-10 h-10 flex justify-center items-center uppercase font-bold overflow-hidden">
            {selectedCompany?.logo ? (
              <img src={selectedCompany?.logo} alt="" />
            ) : (
              selectedCompany?.name?.slice(0, 2) || "-"
            )}
          </div>
          <div className="text-white">
            <h1>{selectedCompany?.name}</h1>
            <small>{selectedCompany?.email}</small>
          </div>
        </div>
        {selectedCompany && (
          <Link
            to={`/dashboard/${selectedCompany?.id}/settings/team`}
            className="p-4 border-b-[0.3px] flex items-center gap-3 cursor-pointer"
          >
            <div className="text-white">
              <small>Team management</small>
            </div>
          </Link>
        )}
        {selectedCompany && (
          <Link
            to={`/dashboard/${selectedCompany?.id}/settings/team`}
            className="p-4 border-b-[0.3px] flex items-center gap-3 cursor-pointer"
          >
            <div className="text-white">
              <small>Invite people to {selectedCompany?.name}</small>
            </div>
          </Link>
        )}
        {selectedCompany && (
          <Link
            to={`/dashboard/${selectedCompany?.id}/settings/profile`}
            className="p-4 border-b-[0.3px] flex items-center gap-3 cursor-pointer"
          >
            <div className="text-white">
              <small>Settings & Administration</small>
            </div>
          </Link>
        )}
        <Link
          to="/select-accounts"
          className="p-4 border-b-[0.3px] flex items-center gap-3 cursor-pointer"
        >
          <div className="text-white">
            <small>Switch Workspaces</small>
          </div>
        </Link>

        <img src="/solutions.jpg" alt="" />
      </Popover.Panel>
    </Popover>
  );
}
