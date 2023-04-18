import { Drawer } from "flowbite";
import type { DrawerInterface } from "flowbite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { useAppSelector } from "../../app/hooks";
import { User } from "../../models";
import { InviteCollaboratorForm } from "./InviteCollaboratorForm";
import { selectRentalRecord } from "../../app/features/rentalRecordSlice";
import useRentalRecorCollaborator from "../../hooks/useRentalRecorCollaborator";
import { ProfilePhoto } from "./ProfilePhoto";
import { RentalRecordMember } from "./RentalRecordMember";

export const RentalRecordCollaboration = () => {
  const $targetEl: HTMLElement | null = document.getElementById("drawer-form");
  const {
    currentRentalRecordOwner,
    currentRentalRecordTenant,
    currentRentalRecordMembers,
    currentRentalRecord,
  } = useAppSelector(selectRentalRecord);

  useRentalRecorCollaborator();
  const options = {
    placement: "left",
    backdrop: true,
    bodyScrolling: false,
    edge: false,
    edgeOffset: "",
    backdropClasses:
      "bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-30",
    onHide: () => {},
    onShow: () => {},
    onToggle: () => {},
  };

  const drawer: DrawerInterface | null = $targetEl
    ? new Drawer($targetEl, options)
    : null;

  type OnwerOrTenantProps = {
    user: User | undefined;
    email: string;
  };

  function OnwerOrTenant(props: OnwerOrTenantProps) {
    const { user, email } = props;
    return (
      <li className="py-3 sm:py-4">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <ProfilePhoto
              name={user ? `${user?.firstName} ${user?.lastName}` : email}
              photoURL={user?.photoURL}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
              {user ? `${user?.firstName} ${user?.lastName}` : email}
            </p>
            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
              {email}
            </p>
          </div>
          <div className="flex-col items-start inline-flex text-sm text-gray-500 dark:text-gray-400 relative">
            {currentRentalRecord.owner === user?.email && "owner"}
            {currentRentalRecord.tenant === user?.email && "tenant"}
          </div>
        </div>
      </li>
    );
  }

  return (
    <div>
      <div className="text-center">
        <button
          className=""
          type="button"
          data-drawer-target="drawer-form"
          data-drawer-show="drawer-form"
          aria-controls="drawer-form"
          onClick={() => {
            drawer?.show();
          }}
          title="Share Rental record"
        >
          <FontAwesomeIcon icon={faUserPlus} size="2x" />
        </button>
      </div>

      <div
        id="drawer-form"
        className="fixed top-0 left-0 z-40 h-screen p-4 overflow-y-auto transition-transform -translate-x-full bg-white w-80 dark:bg-gray-800 mt-[70px]"
        tabIndex={-1}
        aria-labelledby="drawer-form-label"
      >
        <h5
          id="drawer-label"
          className="inline-flex items-center mb-6 text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
        >
          <svg
            className="w-5 h-5 mr-2"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            ></path>
          </svg>
          Share rental record
        </h5>
        <button
          type="button"
          data-drawer-hide="drawer-form"
          aria-controls="drawer-form"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={() => {
            drawer?.hide();
          }}
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span className="sr-only">Close menu</span>
        </button>
        <InviteCollaboratorForm />

        <div className="w-full max-w-md bg-white dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
              Collaborators
            </h5>
          </div>
          <div className="flow-root">
            <ul
              role="list"
              className="divide-y divide-gray-200 dark:divide-gray-700"
            >
              <OnwerOrTenant
                user={currentRentalRecordOwner}
                email={currentRentalRecord.owner}
              />
              <OnwerOrTenant
                user={currentRentalRecordTenant}
                email={currentRentalRecord.tenant}
              />
              {currentRentalRecordMembers?.map((member) => (
                <RentalRecordMember member={member} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
