import React from "react";
import DashboardWrapper from "../dashboard/DashboardWrapper";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { SettingsTab } from "../../models";
import { selectSelectedCompany } from "../../app/features/companySlice";
import { useAppSelector } from "../../app/hooks";

const SettingsWrapper = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  let { companyId } = useParams();
  const { pathname } = useLocation();
  const selectedCompany = useAppSelector(selectSelectedCompany);

  const switchSettingstab = (tab: SettingsTab) => {
    const newRoute = `/dashboard/${companyId}/settings/${tab}`;
    navigate(newRoute);
  };
  const tabs = [SettingsTab.profile, SettingsTab.billing, SettingsTab.team];
  return (
    <DashboardWrapper>
      <div className="max-w-5xl mx-auto py-10 px-5 xl:px-24 xl:pb-12">
        <h2 className="font-semibold text-black text-3xl">Settings</h2>
        <p className="text-black">
          Adjust workspace-wide settings and preferences here for{" "}
          {selectedCompany?.name}. You can also manage members and roles.
        </p>

        <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
          <ul
            className="flex flex-wrap -mb-px text-sm font-medium text-center"
            id="myTab"
            data-tabs-toggle="#myTabContent"
            role="tablist"
          >
            {tabs.map((tab, index) => (
              <li key={index} className="mr-2" role="presentation">
                <button
                  onClick={() => {
                    switchSettingstab(tab);
                  }}
                  className={`inline-block p-4  rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 capitalize ${
                    pathname.includes(tab) && "border-b-2"
                  }`}
                  id={tab}
                  data-tabs-target="#profile"
                  type="button"
                  role="tab"
                  aria-controls="profile"
                  aria-selected="false"
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {children}
      </div>
    </DashboardWrapper>
  );
};

export default SettingsWrapper;
