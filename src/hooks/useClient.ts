import { useEffect } from "react";
import { selectSelectedCompany } from "../app/features/companySlice";
import {
  selectCompanyUser,
  setCompanyUsers,
} from "../app/features/companyUserSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getCompanyUsersForCompany } from "../firebase/apis/companyUser";

const useClient = () => {
  const dispatch = useAppDispatch();
  const selectedCompany = useAppSelector(selectSelectedCompany);
  const { companyUsers } = useAppSelector(selectCompanyUser);

  useEffect(() => {
    if (!companyUsers.length) {
      loadCompanyClients();
    }
  }, [selectedCompany?.id]);

  const loadCompanyClients = async () => {
    if (selectedCompany?.id) {
      const users = await getCompanyUsersForCompany(selectedCompany?.id);
      dispatch(setCompanyUsers(users));
    }
  };

  return { loadCompanyClients };
};
export default useClient;
