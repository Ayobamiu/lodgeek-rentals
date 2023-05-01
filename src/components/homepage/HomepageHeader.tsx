import { Link } from "react-router-dom";
import { ReactComponent as FlexUIGreenLight } from "../../assets/logo-no-background.svg";

import { MenuOutlined } from "@ant-design/icons";
import { Dropdown, MenuProps } from "antd";

export default function HomepageHeader() {
  // set the dropdown menu element
  // set the element that trigger the dropdown menu on click
  // options with default values
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Link
          to="/auth"
          className="text-coolGray-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          Sign Up
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link
          to="/select-plans"
          className="text-coolGray-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          Pricing
        </Link>
      ),
    },
  ];
  return (
    <section className="relative bg-white overflow-hidden pattern-white-bg">
      <div className="bg-transparent">
        <nav className="flex justify-between p-6 px-4 items-center">
          <div className="flex justify-between items-center w-full">
            <div className="w-1/2 xl:w-1/3">
              <Link className="block max-w-max" to="/">
                <FlexUIGreenLight className="h-8 w-[120px]" />
              </Link>
            </div>

            <div className="w-1/2 xl:w-1/3">
              <div className="hidden xl:flex items-center justify-end">
                <Link
                  className="inline-block py-2 px-4 mr-2 leading-5 text-coolGray-500 hover:text-coolGray-900 bg-transparent font-medium rounded-md"
                  to="/select-plans"
                >
                  Pricing
                </Link>
                <Link
                  className="inline-block py-2 px-4 mr-2 leading-5 text-coolGray-500 hover:text-coolGray-900 bg-transparent font-medium rounded-md"
                  to="/auth"
                >
                  Log In
                </Link>
                <Link
                  to="/auth"
                  className="inline-block py-2 px-4 text-sm leading-5 text-green-50 bg-green-500 hover:bg-green-600 font-medium focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>

          <Dropdown menu={{ items }} placement="bottomRight" arrow>
            <button
              id="dropdownDefaultButton"
              data-dropdown-toggle="dropdownMenuHome"
              className="xl:hidden"
              type="button"
            >
              <MenuOutlined className="text-2xl" />
            </button>
          </Dropdown>
        </nav>
      </div>

      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            Simplified renting experience.
          </h1>
          <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">
            Make collecting rent simple, efficient, and professional. Simple
            tracking, a payment history, prompt notifications and late fines,
            receipts, and Autopay are all included.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            <Link
              to="/auth"
              className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-green-500 hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-900"
            >
              Get started
              <svg
                aria-hidden="true"
                className="ml-2 -mr-1 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </Link>
            <a
              href="#features"
              className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
            >
              Learn more
            </a>
          </div>
        </div>
      </section>
    </section>
  );
}
