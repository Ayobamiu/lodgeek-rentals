import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  selectSelectedCompany,
  setSelectedCompany,
} from "../app/features/companySlice";
import { selectUser, updateUser } from "../app/features/userSlice";
import { useAppSelector } from "../app/hooks";
import ActivityIndicator from "../components/shared/ActivityIndicator";
import { updateUserInDatabase } from "../firebase/apis/user";
import useQuery from "../hooks/useQuery";
import { Company, User } from "../models";

export function AccountItem({ account }: { account: Company }): JSX.Element {
  const selectedCompany = useAppSelector(selectSelectedCompany);
  const loggedInUser = useAppSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updatingUser, setUpdatingUser] = useState(false);

  function onClickAccount(company: Company) {
    return async () => {
      if (loggedInUser) {
        const updatedUser: User = {
          ...loggedInUser,
          defaultCompany: company.id,
        };
        setUpdatingUser(true);
        await updateUserInDatabase(updatedUser)
          .then(() => {
            dispatch(updateUser(updatedUser));
            dispatch(setSelectedCompany(company));
            navigate(`/dashboard/${company.id}/rentalRecords`);
          })
          .catch(() => {
            toast("Error, try again! Contact Admin if error persists.");
          })
          .finally(() => {
            setUpdatingUser(false);
          });
      }
    };
  }
  return (
    <li
      className="py-3 sm:py-4 cursor-pointer"
      onClick={onClickAccount(account)}
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          {account.logo ? (
            <img className="w-8 h-8 rounded" src={account.logo} alt="Logo" />
          ) : (
            <div className="w-8 h-8 rounded dark:bg-gray-600 bg-gray-300 uppercase flex justify-center items-center text-base font-semibold text-gray-900 dark:text-white">
              {account.name.slice(0, 2)}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
            {account.name}
          </p>
          <p className="text-sm text-gray-500 truncate dark:text-gray-400">
            {account.primaryOwner}
          </p>
          <p className="text-sm text-gray-500 truncate dark:text-gray-400">
            {account.team.length} member
            {account.team.length > 1 ? "s" : ""}
          </p>
        </div>
        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
          {updatingUser && <ActivityIndicator color="white" />}

          {selectedCompany?.id === account.id && (
            <FontAwesomeIcon icon={faCheckCircle} size="2x" />
          )}
        </div>
      </div>
    </li>
  );
}
