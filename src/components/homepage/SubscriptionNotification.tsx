import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { selectSelectedCompany } from "../../app/features/companySlice";
import { useAppSelector } from "../../app/hooks";
import useSubscription from "../../hooks/useSubscription";

export function SubscriptionNotification({ closable }: { closable?: boolean }) {
  const selectedCompany = useAppSelector(selectSelectedCompany);

  const { subscription } = useSubscription();
  const isUsingFreePlan = !selectedCompany?.subscriptionCode;
  const subIsNonRenewing =
    subscription && subscription.status === "non-renewing";
  const subNeedsAttention = subscription && subscription.status === "attention";
  const subIsCompleted = subscription && subscription.status === "completed";
  const subIsCancelled = subscription && subscription.status === "cancelled";

  const text = isUsingFreePlan
    ? "Your team is on a free trial"
    : subNeedsAttention
    ? "There was an issue while trying to charge your card"
    : subIsNonRenewing || subIsCompleted || subIsCancelled
    ? `Renew Your ${subscription.plan.name} Subscription Today`
    : "";

  const actionText = isUsingFreePlan
    ? "Upgrade to Pro"
    : subNeedsAttention
    ? "Update card"
    : subIsNonRenewing || subIsCompleted || subIsCancelled
    ? `Renew`
    : "";

  useEffect(() => {
    if (
      selectedCompany &&
      (isUsingFreePlan ||
        subIsNonRenewing ||
        subNeedsAttention ||
        subIsCompleted ||
        subIsCancelled)
    ) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [subscription, selectedCompany]);

  const [show, setShow] = useState(false);
  if (!show) return null;
  return (
    <div
      id="dropdown-cta"
      className="p-4 mt-6 rounded-lg bg-blue-50 dark:bg-blue-900"
      role="alert"
    >
      <div className="flex items-center mb-3">
        <span className="bg-orange-100 text-orange-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-orange-200 dark:text-orange-900">
          Upgrade
        </span>

        {closable && (
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 bg-blue-50 text-blue-900 rounded-lg focus:ring-2 focus:ring-blue-400 p-1 hover:bg-blue-200 inline-flex h-6 w-6 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800"
            data-dismiss-target="#dropdown-cta"
            aria-label="Close"
            onClick={() => setShow(false)}
          >
            <span className="sr-only">Close</span>
            <svg
              aria-hidden="true"
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        )}
      </div>
      <p className="mb-3 text-sm text-blue-800 dark:text-blue-400">{text}</p>

      <Link
        to="/select-plans"
        className="text-sm text-blue-800 underline font-medium hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
      >
        {actionText}
      </Link>
    </div>
  );
}
