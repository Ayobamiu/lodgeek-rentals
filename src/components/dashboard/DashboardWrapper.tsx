import React from "react";
import { useEffect } from "react";
import useQuery from "../../hooks/useQuery";
import useAuth from "../../hooks/useAuth";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../app/features/userSlice";
import { User } from "../../models";
import { useNavigate } from "react-router-dom";
import { manageRedirectAndUserCompanies } from "../../firebase/apis/manageRedirectAndUserCompanies";
import { CompanyLogo } from "./CompanyLogo";
import { DashboradMobileNavigationDropDown } from "./DashboradMobileNavigationDropDown";
import DashboardDesktopNavigation from "./DashboardDesktopNavigation";

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  let query = useQuery();
  const navigate = useNavigate();
  const loggedInUser = useAppSelector(selectUser);
  const { signingOut, handleSignOutUser } = useAuth();
  const redirectFromQuery = query.get("redirect") as string;
  const emailFromQuery = query.get("email") as string;

  useEffect(() => {
    manageRedirectAndUserCompanies(
      loggedInUser,
      redirectFromQuery,
      navigate,
      emailFromQuery
    )();
  }, [loggedInUser, navigate]);

  function ProfilePhoto({ user }: { user: User | undefined }): JSX.Element {
    const initials = `${user?.firstName[0] || "-"}${user?.lastName[0] || "-"}`;

    return (
      <div className="p-2 rounded-full bg-coolGray-500 w-10 h-10 flex justify-center items-center">
        {user?.photoURL ? <img src={user?.photoURL} alt="" /> : initials}
      </div>
    );
  }

  return (
    <div className="">
      <section className="">
        <div>
          <div className="px-8 py-6 xl:py-0 bg-coolGray-900 border-b border-coolGray-100">
            <div className="flex items-center justify-between -m-2">
              <div className="flex flex-wrap items-center w-auto p-2">
                <div className="block max-w-max xl:mr-14">
                  <CompanyLogo />
                </div>
                <DashboardDesktopNavigation />
              </div>
              <div className="w-auto p-2 flex flex-wrap items-center">
                <div className="hidden xl:flex flex-wrap items-center -m-3">
                  <div className="w-auto p-3">
                    <div className="flex flex-wrap items-center -m-2">
                      <div className="w-auto p-2">
                        <div className="flex flex-wrap -m-2 items-center">
                          <ProfilePhoto user={loggedInUser} />
                          <div className="w-auto p-2">
                            <h2 className="text-sm font-semibold text-white">
                              {loggedInUser?.firstName || "-"}{" "}
                              {loggedInUser?.lastName || "-"}
                            </h2>
                            <p className="text-sm font-medium text-coolGray-500">
                              {loggedInUser?.email || "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="w-auto p-2">
                        <div className="block max-w-max text-coolGray-500 hover:text-coolGray-600">
                          <button
                            className="text-coolGray-500 hover:text-coolGray-600"
                            about="Log Out"
                            title="Log Out"
                            onClick={handleSignOutUser}
                          >
                            {signingOut ? (
                              <svg
                                className="animate-spin h-5 w-5 mr-3 rounded-full border-t-2 border-r-2 border-white ml-2"
                                viewBox="0 0 24 24"
                              ></svg>
                            ) : (
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M16.29 8.71L18.59 11L9.00001 11C8.7348 11 8.48044 11.1054 8.29291 11.2929C8.10537 11.4804 8.00001 11.7348 8.00001 12C8.00001 12.2652 8.10537 12.5196 8.29291 12.7071C8.48044 12.8946 8.7348 13 9.00001 13L18.59 13L16.29 15.29C16.1963 15.383 16.1219 15.4936 16.0711 15.6154C16.0204 15.7373 15.9942 15.868 15.9942 16C15.9942 16.132 16.0204 16.2627 16.0711 16.3846C16.1219 16.5064 16.1963 16.617 16.29 16.71C16.383 16.8037 16.4936 16.8781 16.6154 16.9289C16.7373 16.9797 16.868 17.0058 17 17.0058C17.132 17.0058 17.2627 16.9797 17.3846 16.9289C17.5064 16.8781 17.617 16.8037 17.71 16.71L21.71 12.71C21.8011 12.6149 21.8724 12.5028 21.92 12.38C22.02 12.1365 22.02 11.8635 21.92 11.62C21.8724 11.4972 21.8011 11.3851 21.71 11.29L17.71 7.29C17.6168 7.19676 17.5061 7.1228 17.3843 7.07234C17.2624 7.02188 17.1319 6.99591 17 6.99591C16.8682 6.99591 16.7376 7.02188 16.6158 7.07234C16.4939 7.1228 16.3833 7.19676 16.29 7.29C16.1968 7.38324 16.1228 7.49393 16.0724 7.61575C16.0219 7.73757 15.9959 7.86814 15.9959 8C15.9959 8.13186 16.0219 8.26243 16.0724 8.38425C16.1228 8.50607 16.1968 8.61676 16.29 8.71ZM10 21C10 20.7348 9.89465 20.4804 9.70712 20.2929C9.51958 20.1054 9.26523 20 9.00001 20L5.00001 20C4.73479 20 4.48044 19.8946 4.2929 19.7071C4.10537 19.5196 4.00001 19.2652 4.00001 19L4.00001 5C4.00001 4.73478 4.10537 4.48043 4.2929 4.29289C4.48044 4.10536 4.73479 4 5.00001 4L9.00001 4C9.26523 4 9.51958 3.89464 9.70712 3.70711C9.89466 3.51957 10 3.26522 10 3C10 2.73478 9.89466 2.48043 9.70712 2.29289C9.51958 2.10536 9.26523 2 9.00001 2L5.00001 2C4.20436 2 3.4413 2.31607 2.87869 2.87868C2.31608 3.44129 2.00001 4.20435 2.00001 5L2.00001 19C2.00001 19.7956 2.31608 20.5587 2.87869 21.1213C3.4413 21.6839 4.20436 22 5.00001 22L9.00001 22C9.26523 22 9.51958 21.8946 9.70712 21.7071C9.89465 21.5196 10 21.2652 10 21Z"
                                  fill="currentColor"
                                ></path>
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <DashboradMobileNavigationDropDown />
              </div>
            </div>
          </div>
        </div>
      </section>
      {children}
    </div>
  );
};

export default DashboardWrapper;
