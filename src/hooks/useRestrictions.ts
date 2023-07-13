import { useMemo } from "react";
import { selectSelectedCompany } from "../app/features/companySlice";
import { selectProperties } from "../app/features/propertySlice";
import { selectUser } from "../app/features/userSlice";
import { useAppSelector } from "../app/hooks";
import { CompanyRole, SubscriptionPlan } from "../models";
import useSubscription from "./useSubscription";

const useRestrictions = () => {
  const selectedCompany = useAppSelector(selectSelectedCompany);
  const loggedInUser = useAppSelector(selectUser);
  const properties = useAppSelector(selectProperties);
  const { subscription } = useSubscription();

  const getPropertiesRestriction = useMemo(() => {
    let showAddPropertyButton = true;
    let canUploadMoreProperties = true;
    let propertyRestrictionType: SubscriptionPlan =
      SubscriptionPlan["Free Plan"];

    const basicPlans = [
      process.env.REACT_APP_PAYSTACK_BASIC_PLAN_CODE,
      process.env.REACT_APP_PAYSTACK_BASIC_PLAN_BIANNUALLY_CODE,
      process.env.REACT_APP_PAYSTACK_BASIC_PLAN_YEARLY_CODE,
    ];
    const proPlans = [
      process.env.REACT_APP_PAYSTACK_PRO_PLAN_CODE,
      process.env.REACT_APP_PAYSTACK_PRO_PLAN_BIANNUALLY_CODE,
      process.env.REACT_APP_PAYSTACK_PRO_PLAN_YEARLY_CODE,
    ];
    // const premiumPlans = [
    //   process.env.REACT_APP_PAYSTACK_PREMIUM_PLAN_CODE,
    //   process.env.REACT_APP_PAYSTACK_PREMIUM_PLAN_BIANNUALLY_CODE,
    //   process.env.REACT_APP_PAYSTACK_PREMIUM_PLAN_YEARLY_CODE,
    // ];
    //Free plan
    if (!subscription && properties.length >= 5) {
      canUploadMoreProperties = false;
    }
    //Basic plan
    if (
      basicPlans.includes(subscription?.subscription_code) &&
      properties.length >= 20
    ) {
      canUploadMoreProperties = false;
      propertyRestrictionType = SubscriptionPlan["Basic Plan"];
    }
    //Pro plan
    if (
      proPlans.includes(subscription?.subscription_code) &&
      properties.length >= 50
    ) {
      canUploadMoreProperties = false;
      propertyRestrictionType = SubscriptionPlan["Pro Plan"];
    }
    const roleInTheCompany = selectedCompany?.members?.find(
      (i) => i.email === loggedInUser?.email
    )?.role;

    const isAdminOrOwner =
      roleInTheCompany &&
      (selectedCompany?.primaryOwner === loggedInUser?.email ||
        roleInTheCompany === CompanyRole.admin ||
        roleInTheCompany === CompanyRole.owner);
    //Only company's admins and owners can see the app property button.
    if (isAdminOrOwner) {
      showAddPropertyButton = true;
    } else {
      showAddPropertyButton = false;
    }
    return {
      canUploadMoreProperties,
      showAddPropertyButton,
      propertyRestrictionType,
    };
  }, [selectedCompany, loggedInUser]);

  return { getPropertiesRestriction };
};
export default useRestrictions;
