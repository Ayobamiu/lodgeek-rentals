import { Popover } from "@headlessui/react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../app/features/userSlice";
import useAuth from "../../hooks/useAuth";
import ActivityIndicator from "../shared/ActivityIndicator";
import { selectSelectedCompany } from "../../app/features/companySlice";
import { ProfilePhoto } from "./ProfilePhoto";

export function DashboradMobileNavigationDropDown(): JSX.Element {
  const loggedInUser = useAppSelector(selectUser);
  const selectedCompany = useAppSelector(selectSelectedCompany);
  const { signingOut, handleSignOutUser } = useAuth();
  const ownerAccess = loggedInUser?.email === selectedCompany?.primaryOwner;

  return (
    <Popover className="relative">
      <Popover.Button>
        <button className="navbar-burger self-center ml-auto block xl:hidden">
          <svg
            width="35"
            height="35"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              className="text-coolGray-800"
              width="32"
              height="32"
              rx="6"
              fill="currentColor"
            ></rect>
            <path
              className="text-coolGray-400"
              d="M7 12H25C25.2652 12 25.5196 11.8946 25.7071 11.7071C25.8946 11.5196 26 11.2652 26 11C26 10.7348 25.8946 10.4804 25.7071 10.2929C25.5196 10.1054 25.2652 10 25 10H7C6.73478 10 6.48043 10.1054 6.29289 10.2929C6.10536 10.4804 6 10.7348 6 11C6 11.2652 6.10536 11.5196 6.29289 11.7071C6.48043 11.8946 6.73478 12 7 12ZM25 15H7C6.73478 15 6.48043 15.1054 6.29289 15.2929C6.10536 15.4804 6 15.7348 6 16C6 16.2652 6.10536 16.5196 6.29289 16.7071C6.48043 16.8946 6.73478 17 7 17H25C25.2652 17 25.5196 16.8946 25.7071 16.7071C25.8946 16.5196 26 16.2652 26 16C26 15.7348 25.8946 15.4804 25.7071 15.2929C25.5196 15.1054 25.2652 15 25 15ZM25 20H7C6.73478 20 6.48043 20.1054 6.29289 20.2929C6.10536 20.4804 6 20.7348 6 21C6 21.2652 6.10536 21.5196 6.29289 21.7071C6.48043 21.8946 6.73478 22 7 22H25C25.2652 22 25.5196 21.8946 25.7071 21.7071C25.8946 21.5196 26 21.2652 26 21C26 20.7348 25.8946 20.4804 25.7071 20.2929C25.5196 20.1054 25.2652 20 25 20Z"
              fill="currentColor"
            ></path>
          </svg>
        </button>
      </Popover.Button>

      <Popover.Panel className="absolute z-40 w-80 bg-[#222529] rounded-lg right-0">
        <div className="w-full border-b-[0.3px] flex flex-wrap items-center justify-between p-4">
          <ProfilePhoto
            name={`${loggedInUser?.firstName || "-"}${
              loggedInUser?.lastName || "-"
            }`}
            photoURL={loggedInUser?.photoURL}
          />
          <div className="w-auto p-2">
            <h2 className="text-sm font-semibold text-white">
              {loggedInUser?.firstName || "-"} {loggedInUser?.lastName || "-"}
            </h2>
            <p className="text-sm font-medium text-coolGray-500">
              {loggedInUser?.email || "--"}
            </p>
          </div>
          <button
            className="text-coolGray-500 hover:text-coolGray-600 ml-auto"
            about="Log Out"
            title="Log Out"
            onClick={handleSignOutUser}
          >
            {signingOut ? (
              <ActivityIndicator />
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.29 8.71L18.59 11L9.00001 11C8.7348 11 8.48044 11.1054 8.29291 11.2929C8.10537 11.4804 8.00001 11.7348 8.00001 12C8.00001 12.2652 8.10537 12.5196 8.29291 12.7071C8.48044 12.8946 8.7348 13 9.00001 13L18.59 13L16.29 15.29C16.1963 15.383 16.1219 15.4936 16.0711 15.6154C16.0204 15.7373 15.9942 15.868 15.9942 16C15.9942 16.132 16.0204 16.2627 16.0711 16.3846C16.1219 16.5064 16.1963 16.617 16.29 16.71C16.383 16.8037 16.4936 16.8781 16.6154 16.9289C16.7373 16.9797 16.868 17.0058 17 17.0058C17.132 17.0058 17.2627 16.9797 17.3846 16.9289C17.5064 16.8781 17.617 16.8037 17.71 16.71L21.71 12.71C21.8011 12.6149 21.8724 12.5028 21.92 12.38C22.02 12.1365 22.02 11.8635 21.92 11.62C21.8724 11.4972 21.8011 11.3851 21.71 11.29L17.71 7.29C17.6168 7.19676 17.5061 7.1228 17.3843 7.07234C17.2624 7.02188 17.1319 6.99591 17 6.99591C16.8682 6.99591 16.7376 7.02188 16.6158 7.07234C16.4939 7.1228 16.3833 7.19676 16.29 7.29C16.1968 7.38324 16.1228 7.49393 16.0724 7.61575C16.0219 7.73757 15.9959 7.86814 15.9959 8C15.9959 8.13186 16.0219 8.26243 16.0724 8.38425C16.1228 8.50607 16.1968 8.61676 16.29 8.71ZM10 21C10 20.7348 9.89465 20.4804 9.70712 20.2929C9.51958 20.1054 9.26523 20 9.00001 20L5.00001 20C4.73479 20 4.48044 19.8946 4.2929 19.7071C4.10537 19.5196 4.00001 19.2652 4.00001 19L4.00001 5C4.00001 4.73478 4.10537 4.48043 4.2929 4.29289C4.48044 4.10536 4.73479 4 5.00001 4L9.00001 4C9.26523 4 9.51958 3.89464 9.70712 3.70711C9.89466 3.51957 10 3.26522 10 3C10 2.73478 9.89466 2.48043 9.70712 2.29289C9.51958 2.10536 9.26523 2 9.00001 2L5.00001 2C4.20436 2 3.4413 2.31607 2.87869 2.87868C2.31608 3.44129 2.00001 4.20435 2.00001 5L2.00001 19C2.00001 19.7956 2.31608 20.5587 2.87869 21.1213C3.4413 21.6839 4.20436 22 5.00001 22L9.00001 22C9.26523 22 9.51958 21.8946 9.70712 21.7071C9.89465 21.5196 10 21.2652 10 21Z"
                  fill="currentColor"
                ></path>
              </svg>
            )}
          </button>
        </div>
        {selectedCompany && (
          <Link
            to={`/dashboard/${selectedCompany?.id}/rentalRecords`}
            className="p-4 border-b-[0.3px] flex items-center gap-3 cursor-pointer"
          >
            <small className="text-white">Rental Records</small>
          </Link>
        )}
        {selectedCompany && (
          <Link
            to={`/dashboard/${selectedCompany?.id}/properties`}
            className="p-4 border-b-[0.3px] flex items-center gap-3 cursor-pointer"
          >
            <small className="text-white">Properties</small>
          </Link>
        )}
        {selectedCompany && ownerAccess && (
          <Link
            to={`/dashboard/${selectedCompany?.id}/bankRecords`}
            className="p-4 flex items-center gap-3 cursor-pointer"
          >
            <small className="text-white">Wallet</small>
          </Link>
        )}
      </Popover.Panel>
    </Popover>
  );
}
