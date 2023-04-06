import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { selectSelectedCompanyMembers } from "../../app/features/companySlice";
import { useAppSelector } from "../../app/hooks";
import SettingsWrapper from "../../components/settings/SettingsWrapper";
import useTeam from "../../hooks/useTeam";
import { AddTeamMemberModal } from "./AddTeamMemberModal";
import { CompanyMemberComponent } from "./CompanyMemberComponent";
import { UpgradeToUseCollaborationTool } from "./UpgradeToUseCollaborationTool";

const TeamCollaboration = () => {
  const [isOpen, setIsOpen] = useState(false);
  const members = useAppSelector(selectSelectedCompanyMembers);
  useTeam();

  return (
    <SettingsWrapper>
      <div className="flex flex-col max-w-5xl mx-auto relative">
        <UpgradeToUseCollaborationTool />
        <AddTeamMemberModal
          isOpen={isOpen}
          closeModal={() => {
            setIsOpen(false);
          }}
        />
        <div className="mt-8 mb-4 flex items-center justify-between flex-wrap gap-5">
          <h1 className="text-2xl font-bold">Team Members</h1>
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none gap-x-2"
          >
            <FontAwesomeIcon
              icon={faPlus}
              className="h-5 w-5 hidden lg:block"
            />
            Add Member
          </button>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {members?.map((member) => (
              <CompanyMemberComponent
                key={member.memberData.email}
                member={member}
              />
            ))}
          </ul>
        </div>
      </div>
    </SettingsWrapper>
  );
};

export default TeamCollaboration;
