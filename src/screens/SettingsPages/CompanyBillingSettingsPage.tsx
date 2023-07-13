import SettingsWrapper from "../../components/settings/SettingsWrapper";

import { SubscriptionCard } from "../../components/billing/SubscriptionCard";
import { RenewProPlanCard } from "../../components/billing/RenewProPlanCard";
import { PaymentCardDetails } from "../../components/billing/PaymentCardDetails";
import { UpgradeToProComponent } from "../../components/billing/UpgradeToProComponent";
import { selectSelectedCompany } from "../../app/features/companySlice";
import { useAppSelector } from "../../app/hooks";
import { UpdateCardDetails } from "./UpdateCardDetails";
import ActivityIndicator from "../../components/shared/ActivityIndicator";
import useSubscription from "../../hooks/useSubscription";

const CompanyBillingSettingsPage = () => {
  const { fetchingSubscribtion, subscription } = useSubscription();
  const selectedCompany = useAppSelector(selectSelectedCompany);

  const isUsingFreePlan = !selectedCompany?.subscriptionCode;
  const subIsActive = subscription && subscription.status === "active";
  const subIsNonRenewing =
    subscription && subscription.status === "non-renewing";
  const subNeedsAttention = subscription && subscription.status === "attention";
  const subIsCompleted = subscription && subscription.status === "completed";
  const subIsCancelled = subscription && subscription.status === "cancelled";

  return (
    <SettingsWrapper>
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-4">Billing</h2>
        {fetchingSubscribtion && <ActivityIndicator />}

        {isUsingFreePlan && <UpgradeToProComponent />}
        {subIsActive && (
          <>
            {/* Subscription card component */}
            <SubscriptionCard subscription={subscription} />

            {/* Billing information component */}
            <PaymentCardDetails
              expiryDate={`${
                subscription.authorization.exp_month
              }/${subscription.authorization.exp_year.slice(2, 4)}`}
              cardHolderName={subscription.authorization.account_name || "--"}
              lastFourDigits={subscription.authorization.last4}
              brand={subscription.authorization.brand}
            />

            {/* Button to cancel subscription */}
            {/* <button className="bg-red-500 text-white px-4 py-2 rounded-lg my-5">
              Cancel Subscription
            </button> */}
          </>
        )}
        {(subIsNonRenewing || subIsCompleted || subIsCancelled) && (
          <RenewProPlanCard planName={subscription?.plan.name || ""} />
        )}

        {subNeedsAttention && <UpdateCardDetails subscription={subscription} />}
      </div>
    </SettingsWrapper>
  );
};

export default CompanyBillingSettingsPage;
