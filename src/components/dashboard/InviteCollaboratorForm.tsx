import { FormEvent, useMemo, useState } from "react";
import { CompanyMember, CompanyRole, RentalRecord } from "../../models";
import { Menu } from "@headlessui/react";
import ActivityIndicator from "../shared/ActivityIndicator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import useRentalRecords from "../../hooks/useRentalRecords";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { generateSimpleEmail } from "../../utils/generateSimpleEmail";
import { sendEmail } from "../../api/email";
import {
  selectRentalRecord,
  setCurrentRentalRecord,
} from "../../app/features/rentalRecordSlice";
import { roleOptions } from "../../app/initialValues";

export function InviteCollaboratorForm() {
  const {
    currentRentalRecord,
    currentRentalRecordCompany,
    currentRentalRecordProperty,
  } = useAppSelector(selectRentalRecord);
  const { handleUpdateRentalRecord } = useRentalRecords();

  const dispatch = useAppDispatch();

  const [role, setRole] = useState(CompanyRole.regular);
  const [email, setEmail] = useState("");
  const [invitingGuest, setInvitingGuest] = useState(false);

  const details = useMemo(
    () => roleOptions.find((i) => i.role === role)?.details || "",
    [role]
  );

  const inviteCollaborator = async (e: FormEvent) => {
    e.preventDefault();
    const memberWithThisEmailExists = currentRentalRecord.members?.find(
      (i) => i.email === email
    );
    const asAccess =
      memberWithThisEmailExists ||
      currentRentalRecord.owner === email ||
      currentRentalRecord.tenant === email;
    if (asAccess) {
      return toast(`${email} already has access.`, { type: "warning" });
    }

    const members: CompanyMember[] = [
      ...(currentRentalRecord.members || []),
      {
        dateJoined: Date.now(),
        email,
        role,
      },
    ];

    const updatedRecord: RentalRecord = {
      ...currentRentalRecord,
      members,
    };

    setInvitingGuest(true);
    await handleUpdateRentalRecord(updatedRecord)
      .then(async () => {
        dispatch(setCurrentRentalRecord(updatedRecord));
        const rentalRecordLink = `${process.env.REACT_APP_BASE_URL}dashboard/rentalRecords/${currentRentalRecord.id}`;
        const paragraphs = [
          `Hello,`,
          `You have been granted access to a rental record on a property located in ${currentRentalRecordProperty?.location} by ${currentRentalRecordCompany?.name}.
               Your role on this record is **${role}**, as specified by ${currentRentalRecordCompany?.name}.`,
          `With this access, you ${details}`,
          `If you have any questions or concerns, please do not hesitate to reach out to ${currentRentalRecordCompany?.name} or Lodgeek for assistance.`,
          `Best regards,`,
          `Lodgeek Support Team`,
        ];

        const generatedEmail = generateSimpleEmail({
          paragraphs: paragraphs,
          buttons: [{ text: "View Rental Record", link: rentalRecordLink }],
        });

        await sendEmail(
          email,
          `Access to Rental Record`,
          paragraphs.join(" \n"),
          generatedEmail
        );

        toast.success("Invite sent.");
      })
      .catch(() => {
        toast.error("Error Accepting Invite, try again.");
      })
      .finally(() => {
        setInvitingGuest(false);
      });
  };
  return (
    <form onSubmit={inviteCollaborator} className="mb-6">
      <div className="mb-4">
        <label
          htmlFor="guests"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Invite guests
        </label>
        <div className="relative flex border border-gray-300 rounded-lg gap-x-2.5 pr-2.5">
          <input
            type="search"
            id="guests"
            className="block p-2.5 w-full text-sm text-gray-900 border-none rounded-lg focus:border-none focus:outline-none"
            placeholder="Add guest email"
            required
            defaultValue={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 gap-x-1">
            <Menu>
              <Menu.Button>
                <span className="bg-gray-200 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                  {role}
                </span>
              </Menu.Button>
              <Menu.Items className="absolute top-[110%] right-0 bg-white shadow-lg border w-60 z-20 rounded-lg">
                {roleOptions.map((roleItem) => (
                  <Menu.Item>
                    {({ active }) => (
                      <div
                        className={`${
                          active && "bg-green-500 "
                        }  p-4 cursor-pointer`}
                        onClick={() => {
                          setRole(roleItem.role);
                        }}
                      >
                        <h6
                          className={`tex-left ${
                            active ? "text-white" : "text-gray-600"
                          } font-semibold text-sm capitalize`}
                        >
                          {roleItem.role}{" "}
                          {role === roleItem.role && (
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              className={
                                active ? "text-white" : "text-green-500"
                              }
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

            <button
              type="submit"
              disabled={invitingGuest}
              className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-green-700 rounded-lg  hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 gap-x-1"
            >
              {invitingGuest ? (
                <ActivityIndicator size="4" />
              ) : (
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
                </svg>
              )}
              Invite
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
