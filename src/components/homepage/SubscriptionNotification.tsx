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
      id="sticky-banner"
      tabIndex={-1}
      className="fixed bottom-0 left-0 z-50 flex justify-between w-full p-4 border-b "
    >
      <div className="flex items-center mx-auto">
        <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
          <span className="inline-flex p-1 mr-3 bg-gray-200 rounded-full dark:bg-gray-600">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"></path>
            </svg>
            <span className="sr-only">Light bulb</span>
          </span>
          <span>
            {text} &nbsp;
            <Link
              to="/select-accounts"
              className="inline font-medium text-blue-600 underline dark:text-blue-500 underline-offset-2 decoration-600 dark:decoration-500 decoration-solid hover:no-underline"
            >
              {actionText}
            </Link>
          </span>
        </p>
      </div>
      {closable && (
        <div className="flex items-center">
          <button
            data-dismiss-target="#sticky-banner"
            type="button"
            className="flex-shrink-0 inline-flex justify-center items-center text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={() => setShow(false)}
          >
            <svg
              aria-hidden="true"
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Close banner</span>
          </button>
        </div>
      )}
    </div>
  );
}
