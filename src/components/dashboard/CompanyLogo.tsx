import React from "react";
import { Company } from "../../models";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { Popover } from "@headlessui/react";
import { Link } from "react-router-dom";

export function CompanyLogo({ company }: { company?: Company }): JSX.Element {
  return (
    <Popover className="relative">
      <Popover.Button>
        <div className="p-2 max-w-[120px] h-10 flex justify-center items-center font-bold uppercase truncate text-white gap-x-3">
          <p className="truncate">{company?.name}</p>{" "}
          <FontAwesomeIcon icon={faAngleDown} />
        </div>
      </Popover.Button>

      <Popover.Panel className="absolute z-40 h-80 w-80 bg-[#222529] rounded-lg">
        <div className="p-4 border-b-[0.3px] flex items-center gap-3">
          <div className="rounded-lg bg-coolGray-400 w-10 h-10 flex justify-center items-center uppercase font-bold overflow-hidden">
            {company?.logo ? (
              <img src={company?.logo} alt="" />
            ) : (
              company?.name?.slice(0, 2) || "-"
            )}
          </div>
          <div className="text-white">
            <h1>{company?.name}</h1>
            <small>{company?.email}</small>
          </div>
        </div>
        {company && (
          <Link
            to={`/dashboard/${company.id}/invites`}
            className="p-4 border-b-[0.3px] flex items-center gap-3 cursor-pointer"
          >
            <div className="text-white">
              <small>Invite people to {company.name}</small>
            </div>
          </Link>
        )}
        {company && (
          <Link
            to={`/dashboard/${company.id}/settings`}
            className="p-4 border-b-[0.3px] flex items-center gap-3 cursor-pointer"
          >
            <div className="text-white">
              <small>Settings & Administration</small>
            </div>
          </Link>
        )}
        <Link
          to="/dashboard"
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
