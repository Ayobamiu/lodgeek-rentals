import { Link } from "react-router-dom";

export function RenewProPlanCard({ planName }: { planName: string }) {
  return (
    <div className="w-full p-4 text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 mb-5">
      <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
        Renew Your {planName} Subscription Today
      </h5>
      <p className="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">
        Your {planName} subscription has expired. Don't miss out on the benefits
        of our most popular plan. Renew now to continue enjoying up to 50
        properties, financial reports, rent reminders, and team management
        features. Upgrade to {planName} today and stay ahead of the competition.
      </p>
      <div className="items-center justify-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
        <Link
          to="/select-plans"
          className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
        >
          Renew your {planName}
        </Link>
      </div>
    </div>
  );
}
