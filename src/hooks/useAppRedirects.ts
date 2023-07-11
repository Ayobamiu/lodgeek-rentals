import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { setSelectedCompany } from "../app/features/companySlice";
import { selectUser } from "../app/features/userSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getCompany, getUserDefaultCompany } from "../firebase/apis/company";
import useQuery from "./useQuery";

const useAppRedirects = () => {
  let query = useQuery();
  const navigate = useNavigate();
  const loggedInUser = useAppSelector(selectUser);
  const redirectFromQuery = query.get("redirect") as string;
  const emailFromQuery = query.get("email") as string;
  const dispatch = useAppDispatch();
  let { companyId } = useParams();

  useEffect(() => {
    resolveAuthAndLoadCompany();
  }, [loggedInUser?.email, companyId]);
  /* 
  fnct resolveAuthAndLoadCompany
    if no auth
      navigate to auth page
    else 
      if user has no userType
        send to Go to registration page
      else
        if companyId
          load company with companyId
          if user has access to the company
            setSelectedCompany
          else 
            show no-access indicator 
            send to select-account page 
        else 
          if defaultCompany
            setSelectedCompany
          else
            send to select-account page
  */

  /**
   * Evaluates user's auth status and companies to display company info on the dashboard
   */
  const resolveAuthAndLoadCompany = async () => {
    //if no auth
    if (!loggedInUser?.email) {
      //navigate to auth page
      gotoAuthPage();
    } else {
      //if user has no userType
      if (!loggedInUser.userType) {
        //Go to registration page.
        gotoRegistrationPage();
      } else {
        //if companyId
        if (companyId) {
          //load company with companyId
          const company = await getCompany(companyId);
          const userHasAccess = [
            company.primaryOwner,
            company.createdBy,
            ...company.team,
          ].includes(loggedInUser.email);

          //if user has access to the company
          if (userHasAccess) {
            //setSelectedCompany
            dispatch(setSelectedCompany(company));
          } else {
            //show no-access indicator
            toast.error("You don't have access to this account");
            //send to select-account page
            sendToSelectAccountPage();
          }
        } else {
          const defaultCompany = await getUserDefaultCompany(
            loggedInUser.email
          );
          //if defaultCompany
          if (defaultCompany) {
            //setSelectedCompany
            dispatch(setSelectedCompany(defaultCompany));
          } else {
            //send to select-account page
            sendToSelectAccountPage();
          }
        }
      }
    }

    function sendToSelectAccountPage() {
      //send to select-account page
      if (redirectFromQuery && redirectFromQuery !== "null") {
        return navigate(`/select-accounts?redirect=${redirectFromQuery || ""}`);
      } else {
        return navigate(`/select-accounts`);
      }
    }

    function gotoRegistrationPage() {
      //Go to registration page.
      if (redirectFromQuery && redirectFromQuery !== "null") {
        return navigate(`/get-started?redirect=${redirectFromQuery}`);
      } else {
        return navigate(`/get-started`);
      }
    }

    function gotoAuthPage() {
      if (redirectFromQuery) {
        navigate(
          `/auth?redirect=${
            redirectFromQuery && redirectFromQuery !== "null"
              ? redirectFromQuery
              : ""
          }&email=${emailFromQuery}`
        );
      } else {
        navigate("/auth");
      }
    }
  };

  return { resolveAuthAndLoadCompany };
};
export default useAppRedirects;
