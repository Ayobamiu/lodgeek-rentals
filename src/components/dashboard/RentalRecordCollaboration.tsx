import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { useAppSelector } from "../../app/hooks";
import { User } from "../../models";
import { InviteCollaboratorForm } from "./InviteCollaboratorForm";
import { selectRentalRecord } from "../../app/features/rentalRecordSlice";
import useRentalRecorCollaborator from "../../hooks/useRentalRecorCollaborator";
import { ProfilePhoto } from "./ProfilePhoto";
import { RentalRecordMember } from "./RentalRecordMember";
import { useState } from "react";
import { Button, Drawer } from "antd";

export const RentalRecordCollaboration = () => {
  const {
    currentRentalRecordOwner,
    currentRentalRecordTenant,
    currentRentalRecordMembers,
    currentRentalRecord,
  } = useAppSelector(selectRentalRecord);

  useRentalRecorCollaborator();

  type OnwerOrTenantProps = {
    user: User | undefined;
    email: string;
  };

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
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
        <Button type="default" className="border-none" onClick={showDrawer}>
          <FontAwesomeIcon icon={faUserPlus} size="2x" />
        </Button>
      </div>

      <Drawer
        title="Share rental record"
        placement="left"
        onClose={onClose}
        open={open}
      >
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
                <RentalRecordMember
                  key={member.memberData.email}
                  member={member}
                />
              ))}
            </ul>
          </div>
        </div>
      </Drawer>
    </div>
  );
};
