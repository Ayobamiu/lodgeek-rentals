import { NavigateFunction } from "react-router-dom";
import { setSelectedCompany } from "../../app/features/companySlice";
import { Company, User } from "../../models";
import { AnyAction, Dispatch } from "redux";

export function manageUserWithDefaultCompany(
  loggedInUser: User,
  companies: Company[],
  dispatch: Dispatch<AnyAction>,
  navigate: NavigateFunction
) {
  if (loggedInUser.defaultCompany) {
    const targetCompany = companies.find(
      (i) => i.id === loggedInUser.defaultCompany
    );
    if (targetCompany) {
      dispatch(setSelectedCompany(targetCompany));
      navigate(`/dashboard/${loggedInUser.defaultCompany}/rentalRecords`);
    } else {
      navigate("/select-accounts");
    }
  } else {
    navigate("/select-accounts");
  }
}
