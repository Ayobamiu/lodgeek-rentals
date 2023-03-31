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
