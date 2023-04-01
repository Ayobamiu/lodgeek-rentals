import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  selectCompanies,
  selectSelectedCompany,
  setCompanies,
  setSelectedCompany,
} from "../app/features/companySlice";
import { selectUser, updateUser } from "../app/features/userSlice";
import { useAppSelector } from "../app/hooks";
import ActivityIndicator from "../components/shared/ActivityIndicator";
import { getUserCompanies } from "../firebase/apis/company";
import { manageRedirectAndUserCompanies } from "../firebase/apis/manageRedirectAndUserCompanies";
import { updateUserInDatabase } from "../firebase/apis/user";
import useQuery from "../hooks/useQuery";
import { User } from "../models";

const CompanySelector = () => {
  const companies = useAppSelector(selectCompanies);
  const selectedCompany = useAppSelector(selectSelectedCompany);
  const loggedInUser = useAppSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let query = useQuery();
  const redirectFromQuery = query.get("redirect") as string;
  const emailFromQuery = query.get("email") as string;

  const [loading, setLoading] = useState(false);
  const [updatingUser, setUpdatingUser] = useState(false);

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
    <div className="lg:min-h-screen lg:w-screen lg:flex pt-20 justify-center items-center">
      <div className="w-full lg:w-1/2 ">
        <div className="flex flex-col items-center p-10 xl:px-24 xl:pb-12 bg-white lg:max-w-xl lg:mx-auto rounded-4xl shadow-2xl">
          <h2 className="mb-4 text-2xl md:text-3xl text-coolGray-900 font-bold text-center">
            Select Account
          </h2>
          {loading && (
            <svg
              className="  animate-spin h-5 w-5 rounded-full border-t-2 border-r-2 border-green-500 "
              viewBox="0 0 24 24"
            ></svg>
          )}
          <p className="text-xs text-coolGray-500   font-medium text-center">
            To get started, please select the company you wish to view from the
            list. Once you select a company, you will be taken to the dashboard
            for that company where you can see all the listings and data
            associated with it.
          </p>
          <div className="pt-10 w-full ">
            {companies.map((company) => (
              <button
                onClick={async () => {
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
                        toast(
                          "Error, try again! Contact Admin if error persists."
                        );
                      })
                      .finally(() => {
                        setUpdatingUser(false);
                      });
                  }
                }}
                disabled={updatingUser}
                key={company.id}
                className="w-full h-20 flex p-10 items-center shadow-lg rounded bg-gray-300 justify-between mb-5 relative"
              >
                <div className="text-left">
                  <span className="text-xl font-bold">{company.name}</span>
                  <p className="mx-0">
                    {company.team.length} member
                    {company.team.length > 1 ? "s" : ""}
                  </p>
                </div>
                {updatingUser && selectedCompany?.id === company.id && (
                  <div className="absolute top-1 right-1">
                    <ActivityIndicator />
                  </div>
                )}
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  size="2x"
                  color={selectedCompany?.id === company.id ? "" : "gray"}
                />
              </button>
            ))}
            {!companies.length && (
              <div className="text-center">No Company records found.</div>
            )}
          </div>

          <p className="text-xs text-coolGray-500   font-medium text-center">
            Please note that you must have the necessary permissions to access
            the data for a particular company. If you do not see the company you
            are looking for or are having trouble accessing its data, please
            contact your Lodgeek administrator for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanySelector;
