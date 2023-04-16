import "./App.css";
import HomePage from "./screens/HomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "./hooks/useAuth";
import Dashboard from "./screens/Dashboard";
import AuthPage from "./screens/AuthPage";
import "react-confirm-alert/src/react-confirm-alert.css";
import NotificationModal from "./components/shared/NotificationModal";
import SupportFab from "./components/shared/button/SupportFab";
import { useState } from "react";
import SupportChannelModal from "./components/homepage/SupportChannelModal";
import RegistrationPage from "./screens/RegistrationPage";
import CompanyRegistrationPage from "./screens/CompanyRegistrationPage";
import CompanySelector from "./screens/CompanySelector";
import IndividualRegistrationPage from "./screens/IndividualRegistrationPage";
import RentalRecords from "./screens/DashboardTabs/RentalRecords";
import RentalRecordDetails from "./screens/DashboardTabs/RentalRecordDetails";
import AddRentalRecords from "./screens/DashboardTabs/AddRentalRecords";
import AddProperty from "./screens/DashboardTabs/AddProperty";
import PaymentHistory from "./screens/DashboardTabs/PaymentHistory";
import Properties from "./screens/DashboardTabs/Properties";
import Rents from "./screens/DashboardTabs/Rents";
import BankRecords from "./screens/DashboardTabs/BankRecords";
import Wallet from "./screens/DashboardTabs/Wallet";
import CompanyProfileSettingsPage from "./screens/SettingsPages/CompanyProfileSettingsPage";
import InviteTeamMembersPage from "./screens/InviteTeamMembersPage";
import CompanyProfileEditPage from "./screens/SettingsPages/CompanyProfileEditPage";
import CompanyBillingSettingsPage from "./screens/SettingsPages/CompanyBillingSettingsPage";
import SelectPlans from "./screens/SelectPlans";
import TeamCollaboration from "./screens/SettingsPages/TeamCollaboration";
import FinancialReport from "./screens/SettingsPages/FinancialReport";
import RentReviewpage from "./screens/DashboardTabs/RentReviewpage";

function App() {
  const [modal, setModal] = useState(false);
  useAuth();

  return (
    <div className="relative h-screen">
      <ToastContainer />
      <SupportFab onClick={() => setModal(!modal)} />
      <SupportChannelModal open={modal} onCancel={() => setModal(false)} />
      <NotificationModal />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="select-plans" element={<SelectPlans />} />
          <Route
            path="individual-registration"
            element={<IndividualRegistrationPage />}
          />
          <Route
            path="company-registration"
            element={<CompanyRegistrationPage />}
          />
          <Route path="select-accounts" element={<CompanySelector />} />
          <Route path="get-started" element={<RegistrationPage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route
            path="dashboard/:companyId/settings/reports"
            element={<FinancialReport />}
          />
          <Route
            path="dashboard/:companyId/rentalRecords"
            element={<RentalRecords />}
          />
          <Route
            path="dashboard/rentalRecords/:rentalRecordId"
            element={<RentalRecordDetails />}
          />
          <Route
            path="dashboard/rentalRecords/:rentalRecordId/rent-review/new"
            element={<RentReviewpage />}
          />
          <Route
            path="dashboard/rentalRecords/:rentalRecordId/rent-review/:reviewId"
            element={<RentReviewpage />}
          />
          <Route
            path="dashboard/:companyId/rentalRecords/new"
            element={<AddRentalRecords />}
          />
          <Route
            path="dashboard/:companyId/paymentHistory"
            element={<PaymentHistory />}
          />
          <Route
            path="dashboard/:companyId/properties"
            element={<Properties />}
          />
          <Route
            path="dashboard/:companyId/properties/new"
            element={<AddProperty />}
          />
          <Route path="dashboard/:companyId/rents" element={<Rents />} />
          <Route
            path="dashboard/:companyId/bankRecords"
            element={<BankRecords />}
          />
          <Route path="dashboard/:companyId/withdraw" element={<Wallet />} />
          <Route
            path="dashboard/:companyId/settings"
            element={<CompanyProfileSettingsPage />}
          />
          <Route
            path="dashboard/:companyId/settings/profile"
            element={<CompanyProfileEditPage />}
          />
          <Route
            path="dashboard/:companyId/settings/billing"
            element={<CompanyBillingSettingsPage />}
          />
          <Route
            path="dashboard/:companyId/settings/team"
            element={<TeamCollaboration />}
          />
          <Route
            path="dashboard/:companyId/invites"
            element={<InviteTeamMembersPage />}
          />
          <Route path="auth" element={<AuthPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
