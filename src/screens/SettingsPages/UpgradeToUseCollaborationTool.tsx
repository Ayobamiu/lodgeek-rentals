import { Link } from "react-router-dom";
import useSubscription from "../../hooks/useSubscription";

export function UpgradeToUseCollaborationTool() {
  const { subscription } = useSubscription();
  const onFreeOrBasicPlan =
    !subscription ||
    subscription?.subscription_code ===
      process.env.REACT_APP_PAYSTACK_BASIC_PLAN_CODE;

  if (!onFreeOrBasicPlan) return null;
  return (
    <div
      id="authentication-modal"
      tabIndex={-1}
      aria-hidden="true"
      className="rounded-lg backdrop-blur absolute top-0 left-0 right-0 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0  h-[500px] bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <svg
          className="w-10 h-10 mb-2 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z"
            clipRule="evenodd"
          ></path>
          <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z"></path>
        </svg>
        <a href="#">
          <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Upgrade to Pro Plan for Advanced Team Management
          </h5>
        </a>
        <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">
          Take your property management to the next level with Lodgeek's Pro
          Plan. In addition to up to 50 properties, financial reports, and rent
          reminders, you'll also get access to our advanced team management
          feature. Upgrade now and streamline your team's workflow, delegate
          tasks, and collaborate more efficiently.
        </p>
        <Link
          to="/select-plans"
          className="inline-flex items-center text-blue-600 hover:underline"
        >
          Upgrade to Pro
          <svg
            className="w-5 h-5 ml-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
          </svg>
        </Link>
      </div>

      {/* <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 text-center">
                <a href="#">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Upgrade to Pro Plan for Advanced Team Management
                  </h5>
                </a>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  Take your property management to the next level with Lodgeek's Pro
                  Plan. In addition to up to 50 properties, financial reports, and
                  rent reminders, you'll also get access to our advanced team
                  management feature. Upgrade now and streamline your team's
                  workflow, delegate tasks, and collaborate more efficiently.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Upgrade to Pro
                  <svg
                    aria-hidden="true"
                    className="w-4 h-4 ml-2 -mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
              </div> */}
    </div>
  );
}
