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
import RegistrationPage from "./screens/RegistrationPage";
import CompanyRegistrationPage from "./screens/CompanyRegistrationPage";
import CompanySelector from "./screens/CompanySelector";
import IndividualRegistrationPage from "./screens/IndividualRegistrationPage";

function App() {
  useAuth();

  return (
    <div className="">
      <ToastContainer />
      <NotificationModal />
      <BrowserRouter>
        <Routes>
          <Route
            path="/individual-registration"
            element={<IndividualRegistrationPage />}
          />
          <Route
            path="/company-registration"
            element={<CompanyRegistrationPage />}
          />
          <Route path="/select-accounts" element={<CompanySelector />} />
          <Route path="/get-started" element={<RegistrationPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
