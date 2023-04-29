import { useEffect } from "react";
import {
  selectCurrentRentalRecord,
  setCurrentRentalRecordMembers,
} from "../app/features/rentalRecordSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getDocumentsFromListOfIds } from "../firebase/apis";
import { FirebaseCollections, TeamMemberData, User } from "../models";

const useRentalRecorCollaborator = () => {
  const dispatch = useAppDispatch();
  const currentRentalRecord = useAppSelector(selectCurrentRentalRecord);

  useEffect(() => {
    if (currentRentalRecord) {
      loadCollaborators();
    }
  }, [currentRentalRecord.members]);

  const loadCollaborators = async () => {
    const users = (await getDocumentsFromListOfIds(
      FirebaseCollections.users,
      "email",
      "in",
      currentRentalRecord?.members?.map((i) => i.email) || []
    )) as User[];

    const currentRentalRecordMembers: TeamMemberData[] =
      currentRentalRecord?.members?.map((i) => {
        return {
          memberData: i,
          userData: users.find((x) => x.email === i.email),
        };
      }) || [];

    dispatch(setCurrentRentalRecordMembers(currentRentalRecordMembers));
  };
  return { loadCollaborators };
};
export default useRentalRecorCollaborator;
