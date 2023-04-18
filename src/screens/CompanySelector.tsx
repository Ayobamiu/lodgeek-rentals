import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { selectCompanies, setCompanies } from "../app/features/companySlice";
import { selectUser } from "../app/features/userSlice";
import { useAppSelector } from "../app/hooks";
import ActivityIndicator from "../components/shared/ActivityIndicator";
import { getUserCompanies } from "../firebase/apis/company";
import { manageRedirectAndUserCompanies } from "../firebase/apis/manageRedirectAndUserCompanies";
import useAuth from "../hooks/useAuth";
import useQuery from "../hooks/useQuery";
import { ReactComponent as FlexUIGreenLight } from "../assets/logo-no-background.svg";
import { AccountItem } from "./AccountItem";

const CompanySelector = () => {
  const companies = useAppSelector(selectCompanies);
  const loggedInUser = useAppSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { signingOut, handleSignOutUser } = useAuth();

  let query = useQuery();
  const redirectFromQuery = query.get("redirect") as string;
  const emailFromQuery = query.get("email") as string;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    manageRedirectAndUserCompanies(
      loggedInUser,
      redirectFromQuery,
      navigate,
      emailFromQuery
    )();
  }, [loggedInUser]);

  useEffect(() => {
    (async () => {
      if (loggedInUser) {
        setLoading(true);
        const userCompanies = await getUserCompanies(
          loggedInUser.email
        ).finally(() => {
          setLoading(false);
        });

        if (userCompanies) {
          dispatch(setCompanies(userCompanies));
        }
      }
    })();
  }, [loggedInUser]);

  return (
    <div className="lg:min-h-screen lg:w-screen md:flex pt-20 justify-center items-center px-5 lg:px-0">
      <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <FlexUIGreenLight className="relative lg:-top-2 top-1/2 -mt-16 mb-6 h-16 lg:w-auto left-1/2 -translate-x-1/2" />
        <div className="flex items-center justify-between mb-4">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
            Select Account
          </h5>

          <Link
            to="/get-started"
            className="text-sm font-medium text-blue-600 dark:text-blue-500"
          >
            Add new account
          </Link>
        </div>
        <p className="text-xs text-coolGray-500 font-medium mb-5">
          To get started, please select the account you wish to view from the
          list. Once you select an account, you will be taken to the dashboard
          for that account where you can see all the listings and data
          associated with it.
        </p>
        <div className="flow-root">
          {loading && <ActivityIndicator />}
          <ul
            role="list"
            className="divide-y divide-gray-200 dark:divide-gray-700"
          >
            {companies.map((account) => (
              <AccountItem account={account} />
            ))}
          </ul>
        </div>
        <p className="text-xs text-coolGray-500 font-medium mt-5">
          Please note that you must have the necessary permissions to access the
          data for a particular account. If you do not see the account you are
          looking for or are having trouble accessing its data, please contact
          your Lodgeek administrator for assistance.
        </p>
        <div className="flex flex-col w-full justify-center items-center mt-5">
          <div className="text-[8px] text-center">
            You are logged in as <strong>{loggedInUser?.email}</strong>.
          </div>
          <button
            onClick={handleSignOutUser}
            className="text-sm font-medium text-blue-600 dark:text-blue-500"
          >
            {signingOut ? <ActivityIndicator /> : "Log out"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanySelector;
