import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TeamMemberData } from "../../models";

type Props = {
  member: TeamMemberData;
};

export function CompanyMemberComponent(props: Props): JSX.Element {
  const { member } = props;
  return (
    <li key={member.memberData.email}>
      <a href="#" className="block hover:bg-gray-50">
        <div className="flex items-center px-4 py-4 sm:px-6">
          <div className="min-w-0 flex-1 flex items-center">
            <div className="flex-shrink-0">
              <img
                className="h-12 w-12 rounded-full"
                src={
                  member.userData?.photoURL ||
                  `https://ui-avatars.com/api/?name=${member.memberData.email}&background=random`
                }
                alt={`${
                  member.userData
                    ? member.userData?.firstName
                    : member.memberData.email
                }'s profile picture`}
              />
            </div>
            <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
              <div>
                <div className="text-sm font-medium text-blue-600 truncate">
                  {member.userData
                    ? `${member.userData.firstName} ${member.userData.lastName}`
                    : member.memberData.email}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <span className="truncate">{member.memberData.role}</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <FontAwesomeIcon
              icon={faChevronRight}
              className="h-5 w-5 text-gray-400"
            />
          </div>
        </div>
      </a>
    </li>
  );
}
