import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import {
  CompanyMember,
  CompanyRole,
  RentalRecord,
  TeamMemberData,
} from "../../models";
import { Menu, Popover } from "@headlessui/react";
import { ProfilePhoto } from "./ProfilePhoto";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUser } from "../../app/features/userSlice";
import {
  selectRentalRecord,
  setCurrentRentalRecord,
} from "../../app/features/rentalRecordSlice";
import { useMemo, useState } from "react";
import { roleOptions } from "../../app/initialValues";
import useRentalRecords from "../../hooks/useRentalRecords";
import { toast } from "react-toastify";
import ActivityIndicator from "../shared/ActivityIndicator";

type Props = {
  member: TeamMemberData;
};

export function RentalRecordMember(props: Props): JSX.Element {
  const { member } = props;
  const loggedInUser = useAppSelector(selectUser);
  const { currentRentalRecord, currentRentalRecordMembers } =
    useAppSelector(selectRentalRecord);
  const dispatch = useAppDispatch();

  const { handleUpdateRentalRecord } = useRentalRecords();

  const details = (role: CompanyRole) =>
    roleOptions.find((i) => i.role === role)?.details || "";

  const hasAdminRole = useMemo(() => {
    const myMemberObject = currentRentalRecordMembers.find(
      (i) => i.memberData.email === loggedInUser?.email
    );
    return myMemberObject?.memberData.role === CompanyRole.admin ?? false;
  }, [currentRentalRecordMembers, loggedInUser]);

  const hasOwnersRole = useMemo(() => {
    const myMemberObject = currentRentalRecordMembers.find(
      (i) => i.memberData.email === loggedInUser?.email
    );
    return (
      myMemberObject?.memberData.role === CompanyRole.admin ||
      loggedInUser?.email === currentRentalRecord.owner
    );
  }, [currentRentalRecordMembers, currentRentalRecord, loggedInUser]);

  const [updatingmembers, setUpdatingmembers] = useState(false);
  const [deletingAccess, setDeletingAccess] = useState(false);

  const updateMembers = async (
    members: CompanyMember[],
    type: "updaterole" | "deleteaccess"
  ) => {
    const updatedRecord: RentalRecord = {
      ...currentRentalRecord,
      members,
      team: members.map((i) => i.email),
    };
    if (type === "deleteaccess") {
      setDeletingAccess(true);
    } else {
      setUpdatingmembers(true);
    }
    await handleUpdateRentalRecord(updatedRecord)
      .then(async () => {
        dispatch(setCurrentRentalRecord(updatedRecord));
        if (type === "deleteaccess") {
          toast.success("Member's access deleted.");
        } else {
          toast.success("Member's access updated.");
        }
      })
      .catch(() => {
        if (type === "deleteaccess") {
          toast.error("Error deleting member's access, try again.");
        } else {
          toast.error("Error updating member's access, try again.");
        }
      })
      .finally(() => {
        if (type === "deleteaccess") {
          setDeletingAccess(false);
        } else {
          setUpdatingmembers(false);
        }
      });
  };

  const canNotEditRole =
    (!hasAdminRole && !hasOwnersRole) || updatingmembers || deletingAccess;
  return (
    <li key={member.memberData.email} className="py-3 sm:py-4">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <ProfilePhoto
            name={
              member.userData
                ? `${member.userData?.firstName}${member.userData?.lastName}`
                : member.memberData.email
            }
            photoURL={member.userData?.photoURL}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
            {member.userData
              ? `${member.userData?.firstName} ${member.userData?.lastName}`
              : member.memberData.email}
          </p>
          <p className="text-sm text-gray-500 truncate dark:text-gray-400">
            {member.memberData?.email}
          </p>
        </div>
        <div className="flex-col items-end inline-flex text-sm text-gray-500 dark:text-gray-400 relative">
          <Menu>
            <Menu.Button disabled={canNotEditRole}>
              <span
                className="flex gap-x-2"
                title={details(member.memberData.role)}
              >
                {updatingmembers ? (
                  <ActivityIndicator size="4" />
                ) : (
                  <>
                    {member.memberData.role}
                    {(hasAdminRole || hasOwnersRole) && (
                      <FontAwesomeIcon icon={faAngleDown} />
                    )}
                  </>
                )}
              </span>
            </Menu.Button>
            <Menu.Items className="absolute top-full right-0 bg-white shadow-lg border w-60">
              {roleOptions.map((roleItem) => (
                <Menu.Item key={roleItem.role}>
                  {({ active }) => (
                    <div
                      className={`${
                        active && "bg-green-500 "
                      }  p-4 cursor-pointer`}
                      onClick={onChangeRole(roleItem)}
                    >
                      <h6
                        className={`tex-left ${
                          active ? "text-white" : "text-gray-600"
                        } font-semibold text-sm capitalize`}
                      >
                        {roleItem.role}{" "}
                        {member.memberData.role === roleItem.role && (
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className={active ? "text-white" : "text-green-500"}
                          />
                        )}
                      </h6>
                      <p
                        className={`text-xs ${
                          active ? "text-white" : "text-gray-400"
                        }`}
                      >
                        {roleItem.details}
                      </p>
                    </div>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Menu>

          {hasOwnersRole && (
            <Popover className="relative">
              <Popover.Button
                disabled={!hasOwnersRole || updatingmembers || deletingAccess}
              >
                {deletingAccess ? (
                  <ActivityIndicator size="4" />
                ) : (
                  <span className="text-red-500 cursor-pointer">remove</span>
                )}
              </Popover.Button>

              <Popover.Panel className="absolute z-10 bg-white w-60 border shadow-lg p-4 right-0 rounded-lg">
                <p className="text-xs">
                  This action will remove user's access from this rental record.
                </p>
                <br />
                <button
                  disabled={!hasOwnersRole || updatingmembers || deletingAccess}
                  onClick={onDeleteMember()}
                  className="bg-red-500 text-white p-2 rounded-lg cursor-pointer text-xs flex gap-x-2 justify-center"
                >
                  Yes remove access.{" "}
                  {deletingAccess && <ActivityIndicator size="4" />}
                </button>
              </Popover.Panel>
            </Popover>
          )}
        </div>
      </div>
    </li>
  );

  function onDeleteMember() {
    return () => {
      const members: CompanyMember[] = [...(currentRentalRecord.members || [])];
      const memberIndex = members.findIndex(
        (i) => i.email === member.memberData.email
      );
      members.splice(memberIndex, 1);
      updateMembers(members, "deleteaccess");
    };
  }

  function onChangeRole(roleItem: { role: CompanyRole; details: string }) {
    return () => {
      if (roleItem.role !== member.memberData.role) {
        const members: CompanyMember[] = [
          ...(currentRentalRecord.members || []),
        ];

        const memberIndex = members.findIndex(
          (i) => i.email === member.memberData.email
        );

        members.splice(memberIndex, 1, {
          ...member.memberData,
          role: roleItem.role,
        });

        updateMembers(members, "updaterole");
      }
    };
  }
}
