import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardWrapper from "../components/dashboard/DashboardWrapper";
import CompanyProfileEditPage from "./CompanyProfileEditPage";

const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <DashboardWrapper>
      <div className="max-w-5xl mx-auto py-10">
        <h2 className="font-semibold text-black text-3xl">Settings</h2>

        <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
          <ul
            className="flex flex-wrap -mb-px text-sm font-medium text-center"
            id="myTab"
            data-tabs-toggle="#myTabContent"
            role="tablist"
          >
            <li className="mr-2" role="presentation">
              <button
                className="inline-block p-4 border-b-2 rounded-t-lg"
                id="profile-tab"
                data-tabs-target="#profile"
                type="button"
                role="tab"
                aria-controls="profile"
                aria-selected="false"
              >
                Profile
              </button>
            </li>
            <li className="mr-2" role="presentation">
              <button
                className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                id="dashboard-tab"
                data-tabs-target="#dashboard"
                type="button"
                role="tab"
                aria-controls="dashboard"
                aria-selected="false"
              >
                Dashboard
              </button>
            </li>
            <li className="mr-2" role="presentation">
              <button
                className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                id="settings-tab"
                data-tabs-target="#settings"
                type="button"
                role="tab"
                aria-controls="settings"
                aria-selected="false"
              >
                Settings
              </button>
            </li>
            <li role="presentation">
              <button
                className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                id="contacts-tab"
                data-tabs-target="#contacts"
                type="button"
                role="tab"
                aria-controls="contacts"
                aria-selected="false"
              >
                Contacts
              </button>
            </li>
          </ul>
        </div>
        <CompanyProfileEditPage />
      </div>
    </DashboardWrapper>
  );
};

export default SettingsPage;
