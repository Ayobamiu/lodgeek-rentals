import "./App.css";
import HomePage from "./screens/HomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "./hooks/useAuth";

import Dashboard from "./screens/Dashboard";
import FullScreenActivityIndicator from "./components/shared/FullScreenActivityIndicator";
import { useAppSelector } from "./app/hooks";
import { selectLoadingloggedInUser } from "./app/features/userSlice";

function App() {
  useAuth();
  const loadingloggedInUser = useAppSelector(selectLoadingloggedInUser);
  return (
    <div className="">
      {loadingloggedInUser && <FullScreenActivityIndicator />}
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
