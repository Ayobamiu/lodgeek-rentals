import { useEffect } from "react";
import { NavigateFunction } from "react-router-dom";
import useQuery from "../hooks/useQuery";
import { useAppSelector } from "../app/hooks";
import { selectUser } from "../app/features/userSlice";
import { useNavigate } from "react-router-dom";
import { manageRedirectAndUserCompanies } from "../firebase/apis/manageRedirectAndUserCompanies";
import DashboardWrapper from "../components/dashboard/DashboardWrapper";
import CompanySelector from "./CompanySelector";

export default function Dashboard() {
  let query = useQuery();
  const navigate = useNavigate();
  const loggedInUser = useAppSelector(selectUser);
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

  return (
    <DashboardWrapper>
      <CompanySelector />
    </DashboardWrapper>
  );
}
