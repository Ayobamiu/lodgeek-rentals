import { Dropdown, DropdownOptions } from "flowbite";
import { Link } from "react-router-dom";
import { ReactComponent as FlexUIGreenLight } from "../../assets/logo-no-background.svg";
import SignUpBox from "./SignUpBox";

export default function HomepageHeader() {
  // set the dropdown menu element
  const $dropdownMenuHomeTargetEl = document.getElementById("dropdownMenuHome");
  // set the element that trigger the dropdown menu on click
  const $dropdownMenuHomeTriggerEl = document.getElementById("dropdownButton");
  // options with default values
  const dropdownMenuHomeOptions: DropdownOptions = {
    placement: "bottom",
    triggerType: "click",
    offsetSkidding: 0,
    offsetDistance: 10,
    delay: 300,
    onHide: () => {},
    onShow: () => {},
    onToggle: () => {},
  };
  const dropdown = new Dropdown(
    $dropdownMenuHomeTargetEl,
    $dropdownMenuHomeTriggerEl,
    dropdownMenuHomeOptions
  );
  return (
    <section className="relative bg-white overflow-hidden pattern-white-bg">
      <div className="bg-transparent">
        <nav className="flex justify-between p-6 px-4">
          <div className="flex justify-between items-center w-full">
            <div className="w-1/2 xl:w-1/3">
              <Link className="block max-w-max" to="/">
                <FlexUIGreenLight className="h-8 w-[120px]" />
              </Link>
            </div>
            <div className="w-1/2 xl:w-1/3">
              <ul className="hidden xl:flex xl:justify-center">
                <li className="mr-12">
                  <Link
                    to="/#features"
                    className="text-coolGray-500 hover:text-coolGray-900 font-medium"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    to="/select-plans"
                    className="text-coolGray-500 hover:text-coolGray-900 font-medium"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div className="w-1/2 xl:w-1/3">
              <div className="hidden xl:flex items-center justify-end">
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

          <button
            id="dropdownDefaultButton"
            data-dropdown-toggle="dropdownMenuHome"
            className="xl:hidden"
            type="button"
          >
            <svg
              width="35"
              height="35"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                className="text-coolGray-50"
                width="32"
                height="32"
                rx="6"
                fill="currentColor"
              ></rect>
              <path
                className="text-coolGray-500"
                d="M7 12H25C25.2652 12 25.5196 11.8946 25.7071 11.7071C25.8946 11.5196 26 11.2652 26 11C26 10.7348 25.8946 10.4804 25.7071 10.2929C25.5196 10.1054 25.2652 10 25 10H7C6.73478 10 6.48043 10.1054 6.29289 10.2929C6.10536 10.4804 6 10.7348 6 11C6 11.2652 6.10536 11.5196 6.29289 11.7071C6.48043 11.8946 6.73478 12 7 12ZM25 15H7C6.73478 15 6.48043 15.1054 6.29289 15.2929C6.10536 15.4804 6 15.7348 6 16C6 16.2652 6.10536 16.5196 6.29289 16.7071C6.48043 16.8946 6.73478 17 7 17H25C25.2652 17 25.5196 16.8946 25.7071 16.7071C25.8946 16.5196 26 16.2652 26 16C26 15.7348 25.8946 15.4804 25.7071 15.2929C25.5196 15.1054 25.2652 15 25 15ZM25 20H7C6.73478 20 6.48043 20.1054 6.29289 20.2929C6.10536 20.4804 6 20.7348 6 21C6 21.2652 6.10536 21.5196 6.29289 21.7071C6.48043 21.8946 6.73478 22 7 22H25C25.2652 22 25.5196 21.8946 25.7071 21.7071C25.8946 21.5196 26 21.2652 26 21C26 20.7348 25.8946 20.4804 25.7071 20.2929C25.5196 20.1054 25.2652 20 25 20Z"
                fill="currentColor"
              ></path>
            </svg>
          </button>
        </nav>

        <div
          id="dropdownMenuHome"
          className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
            <li>
              <Link
                to="/#features"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                to="/select-plans"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                to="/auth"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="relative py-20 xl:pt-16 xl:pb-24">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="w-full lg:w-1/2 mb-20 lg:mb-0">
              <span className="inline-block py-px px-2 mb-4 text-xs leading-5 text-white bg-green-500 font-medium uppercase rounded-9xl">
                Rental manager
              </span>
              <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl leading-tight text-coolGray-900 font-bold tracking-tight">
                Simplified renting experience.
              </h1>
              <p
                className="mb-8 text-lg md:text-xl leading-7 text-coolGray-500 font-medium"
                contentEditable={false}
                data-gramm="false"
                wt-ignore-input="true"
                data-quillbot-element="6iY1pHrNlWj7xVPOjuPiH"
              >
                Make collecting rent simple, efficient, and professional. Simple
                tracking, a payment history, prompt notifications and late
                fines, receipts, and Autopay are all included.
              </p>
            </div>
            <SignUpBox />
          </div>
        </div>
      </div>
    </section>
  );
}
