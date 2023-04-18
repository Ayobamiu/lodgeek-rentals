import { useState } from "react";
import { toast } from "react-toastify";
import { sendEmail } from "../../api/email";
import {
  selectSelectedCompany,
  setSelectedCompany,
  updateCompany,
} from "../../app/features/companySlice";
import { selectUser } from "../../app/features/userSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ActivityIndicator from "../../components/shared/ActivityIndicator";
import { updateCompanyInDatabase } from "../../firebase/apis/company";
import { Company, CompanyRole } from "../../models";
import { generateSimpleEmail } from "../../utils/generateSimpleEmail";
import base64 from "base-64";

type AddTeamMemberModalProp = {
  isOpen: boolean;
  closeModal: () => void;
};

export function AddTeamMemberModal(props: AddTeamMemberModalProp) {
  const { closeModal, isOpen } = props;
  const selectedCompany = useAppSelector(selectSelectedCompany);
  const loggedInUser = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [sendingInvite, setSendingInvite] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<CompanyRole>();

  const inviteTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCompany && role) {
      if (selectedCompany.team.find((i) => i === email)) {
        return toast.info(`User with email ${email} is already on the team.`);
      }
      const updatedCompany: Company = {
        ...selectedCompany,
        team: [...selectedCompany.team, email],
        members: [
          ...selectedCompany.members,
          { email, dateJoined: Date.now(), role },
        ],
      };
      setSendingInvite(true);
      await updateCompanyInDatabase(updatedCompany)
        .then(async () => {
          dispatch(updateCompany(updatedCompany));
          dispatch(setSelectedCompany(updatedCompany));
          const emailSubject = `${loggedInUser?.firstName} ${loggedInUser?.lastName} is inviting you to join ${selectedCompany.name}`;
          const redirectURL = `/dashboard/${selectedCompany.id}/rentalRecords`;
          const encodedRedirectUrl = base64.encode(redirectURL);
          const rentalRecordLink = `${process.env.REACT_APP_BASE_URL}dashboard/${selectedCompany.id}/rentalRecords?redirect=${encodedRedirectUrl}&email=${email}`;
          const paragraphs = [
            emailSubject,
            "Click the button below to join the team.",
          ];

          const generatedEmail = generateSimpleEmail({
            paragraphs,
            buttons: [{ link: rentalRecordLink, text: "Join Team" }],
          });
          await sendEmail(
            email,
            emailSubject,
            paragraphs.join(" \n"),
            generatedEmail
          ).then(() => {
            toast.success(`Invitation sent to ${email}`);
          });

          closeModal();
        })
        .finally(() => {
          setSendingInvite(false);
        });
    }
  };

  if (!isOpen) return null;

  const roleOptions = [
    CompanyRole.regular,
    CompanyRole.admin,
    CompanyRole.owner,
  ];
  return (
    <div
      id="authentication-modal"
      tabIndex={-1}
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50  w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div className="relative w-full h-full max-w-md md:h-auto">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <button
            type="button"
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
            data-modal-hide="authentication-modal"
            onClick={closeModal}
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
            <span className="sr-only">Close modal</span>
          </button>
          <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
              Invite people to {selectedCompany?.name}
            </h3>
            <form className="space-y-6" onSubmit={inviteTeamMember}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  To:
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="name@company.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="role"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Invite as:
                </label>
                <select
                  name="role"
                  placeholder="Select role"
                  id="role"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  required
                  onChange={(e) => setRole(e.target.value as CompanyRole)}
                >
                  <option value="" unselectable="on">
                    -- Select role --
                  </option>
                  {roleOptions.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>

              <button
                disabled={sendingInvite}
                type="submit"
                className="flex justify-center items-center gap-3 w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Send Invite {sendingInvite && <ActivityIndicator />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
