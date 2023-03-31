import { NavigateFunction } from "react-router-dom";
import { UserType } from "../../models";
import { getUserCompanies } from "./company";

export async function checkUserTypeAndCompanySettings(
  loggedInUser: any,
  navigate: NavigateFunction,
  redirectFromQuery: string
) {
  //If you are logged in but have not completed the registeration process
  if (!loggedInUser.userType) {
    //Go to registration page.
    if (redirectFromQuery && redirectFromQuery !== "null") {
      return navigate(`/get-started?redirect=${redirectFromQuery}`);
    } else {
      return navigate(`/get-started`);
    }
  } else {
    // Your userType is company, but you a not a member of any company yet
    const userCompanies = await getUserCompanies(loggedInUser.email);
    if (loggedInUser.userType === UserType.company && !userCompanies.length) {
      if (redirectFromQuery && redirectFromQuery !== "null") {
        return navigate(
          `/company-registration?redirect=${redirectFromQuery || ""}`
        );
      } else {
        return navigate(`/company-registration`);
      }
    }
    //Go to company settings page.
  }
}
