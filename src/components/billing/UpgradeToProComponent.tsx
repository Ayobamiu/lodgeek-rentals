import { Link } from "react-router-dom";

export function UpgradeToProComponent() {
  return (
    <div className="w-full p-4 text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 mb-5">
      <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
        Upgrade to Pro Plan and unlock more features
      </h5>
      <p className="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">
        As a free plan user, you're limited to only 5 properties. Upgrade to our
        Pro Plan and get access to up to 50 properties, team management, and
        financial reports. Try it today and take your property management to the
        next level!
      </p>
      <div className="items-center justify-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
        <Link
          to="/select-plans"
          className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
        >
          Upgrade to Pro
        </Link>
      </div>
    </div>
  );
}
