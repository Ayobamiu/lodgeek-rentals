import "./App.css";
import HomePage from "./screens/HomePage";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "./hooks/useAuth";
import Dashboard from "./screens/Dashboard";
import AuthPage from "./screens/AuthPage";
import "react-confirm-alert/src/react-confirm-alert.css";
import NotificationModal from "./components/shared/NotificationModal";
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
import SettingsPage from "./screens/SettingsPage";
import InviteTeamMembersPage from "./screens/InviteTeamMembersPage";

function App() {
  useAuth();

  return (
    <div className="">
      <ToastContainer />
      <NotificationModal />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
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
          <Route path="dashboard" element={<Dashboard />}>
            <Route path="new" element={<NewPost />} /> {/*A nested route!*/}
            <Route path=":postId" element={<Post />} /> {/*A nested route!*/}
          </Route>
          <Route path="dashboard/rentalRecords" element={<RentalRecords />} />
          <Route
            path="dashboard/rentalRecords/:id"
            element={<RentalRecordDetails />}
          />
          <Route
            path="dashboard/rentalRecords/new"
            element={<AddRentalRecords />}
          />
          <Route path="dashboard/paymentHistory" element={<PaymentHistory />} />
          <Route path="dashboard/properties" element={<Properties />} />
          <Route path="dashboard/properties/new" element={<AddProperty />} />
          <Route path="dashboard/rents" element={<Rents />} />
          <Route path="dashboard/bankRecords" element={<BankRecords />} />
          <Route path="dashboard/withdraw" element={<Wallet />} />
          <Route path="dashboard/settings" element={<SettingsPage />} />
          <Route path="dashboard/invites" element={<InviteTeamMembersPage />} />
          <Route path="auth" element={<AuthPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

//NewPost.jsx, the child

const NewPost = () => {
  // const [currentUser] = useOutletContext()

  return (
    <div>
      <h1>Welcome , write a new post!</h1>
      <form />
    </div>
  );
};
function Post() {
  let params = useParams();

  return <h1>{params.postId}</h1>;
}
