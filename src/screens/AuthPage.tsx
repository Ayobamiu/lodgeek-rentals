import React, { useEffect } from "react";
import SignUpBoxForLoginPage from "../components/homepage/SignUpBoxForLoginPage";
import useQuery from "../hooks/useQuery";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectUser } from "../app/features/userSlice";
import base64 from "base-64";
import { getUserCompanies } from "../firebase/apis/company";
import { selectCompanies } from "../app/features/companySlice";
import { useDispatch } from "react-redux";
import { manageUserWithDefaultCompany } from "../firebase/apis/manageUserWithDefaultCompany";

export default function AuthPage() {
  let queryS = useQuery();
  const loggedInUser = useAppSelector(selectUser);
  const navigate = useNavigate();
  const redirectFromQuery = queryS.get("redirect") as string;
  const companies = useAppSelector(selectCompanies);
  const dispatch = useDispatch();
  useEffect(() => {
    if (loggedInUser?.email) {
      if (redirectFromQuery) {
        const decodedRedirectUrl = base64.decode(redirectFromQuery);
        navigate(decodedRedirectUrl);
      } else {
        manageUserWithDefaultCompany(
          loggedInUser,
          companies,
          dispatch,
          navigate
        );
      }
    }
  }, [loggedInUser, navigate]);

  return (
    <div className="lg:min-h-screen lg:w-screen lg:flex pt-20 justify-center items-center">
      <SignUpBoxForLoginPage />
    </div>
  );
}
