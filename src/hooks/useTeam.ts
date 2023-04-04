import { useEffect } from "react";
import {
  selectSelectedCompany,
  setSelectedCompanyMembers,
} from "../app/features/companySlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getDocumentsFromListOfIds } from "../firebase/apis";
import { FirebaseCollections, TeamMemberData, User } from "../models";

const useTeam = () => {
  const dispatch = useAppDispatch();
  const selectedCompany = useAppSelector(selectSelectedCompany);

  useEffect(() => {
    if (selectedCompany) {
      loadTeamMembers();
    }
  }, [selectedCompany]);

  const loadTeamMembers = async () => {
    const users = (await getDocumentsFromListOfIds(
      FirebaseCollections.users,
      "email",
      "in",
      selectedCompany?.team || []
    )) as User[];

    const selectedCompanyTeamMembers: TeamMemberData[] =
      selectedCompany?.members?.map((i) => {
        return {
          memberData: i,
          userData: users.find((x) => x.email === i.email),
        };
      }) || [];
    dispatch(setSelectedCompanyMembers(selectedCompanyTeamMembers));
  };
  return { loadTeamMembers };
};
export default useTeam;
