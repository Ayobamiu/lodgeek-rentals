import { NavigateFunction } from "react-router-dom";
import { User } from "../../models";
import { checkUserTypeAndCompanySettings } from "./checkUserTypeAndCompanySettings";

export function manageRedirectAndUserCompanies(
  loggedInUser: User | undefined,
  redirectFromQuery: string,
  navigate: NavigateFunction,
  emailFromQuery: string
) {
  return async () => {
    if (!loggedInUser?.email) {
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
    } else {
      await checkUserTypeAndCompanySettings(
        loggedInUser,
        navigate,
        redirectFromQuery
      );
    }
  };
}
