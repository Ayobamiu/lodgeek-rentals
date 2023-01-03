import React from "react";
import { Link } from "react-router-dom";
import CheckBoxGreen from "../../assets/flex-ui-assets/elements/pricing/checkbox-green.svg";

export default function Pricing() {
  return (
    <section className="py-20 xl:py-24 bg-white pattern-white-bg">
      <div className="container px-4 mx-auto">
        <div className="text-center">
          <span className="inline-block py-px px-2 mb-4 text-xs leading-5 text-green-500 bg-green-100 font-medium uppercase rounded-9xl">
            Pricing
          </span>
          <h3 className="mb-4 text-3xl md:text-5xl text-coolGray-900 font-bold tracking-tighter">
            Flexible pricing plan for your startup
          </h3>
          <p className="mb-12 text-lg md:text-xl text-coolGray-500 font-medium">
            Pricing that scales with your business immediately.
          </p>
        </div>
        <div className="flex flex-wrap justify-center -mx-4">
          <div className="w-full md:w-1/2 lg:w-1/3 p-4">
            <div className="flex flex-col pt-8 pb-8 bg-coolGray-50 rounded-md shadow-md hover:scale-105 transition duration-500">
              <div className="px-8 pb-8">
                <h3 className="mb-6 text-lg md:text-xl text-coolGray-800 font-medium">
                  Small
                </h3>
                <div className="mb-6">
                  <span className="relative -top-10 right-1 text-3xl text-coolGray-900 font-bold">
                    $
                  </span>
                  <span className="text-6xl md:text-7xl text-coolGray-900 font-semibold">
                    10
                  </span>
                  <span className="inline-block ml-1 text-coolGray-500 font-semibold">
                    per month
                  </span>
                </div>
                <p className="mb-6 text-coolGray-400 font-medium">
                  Basic features for up to 10 users.
                </p>
                <Link
                  className="inline-block py-4 px-7 mb-4 w-full text-base md:text-lg leading-6 text-green-50 font-medium text-center bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md shadow-sm"
                  to="/"
                >
                  Get Started
                </Link>
                <Link
                  className="inline-block py-3 px-7 w-full text-coolGray-500 font-medium text-center bg-white hover:bg-coolGray-100 focus:ring-2 focus:ring-coolGray-100 focus:ring-opacity-50 rounded-md shadow-sm"
                  to="/"
                >
                  Learn more
                </Link>
              </div>
              <div className="border-b border-coolGray-100"></div>
              <ul className="self-start px-8 pt-8">
                <li className="flex items-center mb-3 text-coolGray-500 font-medium">
                  <img
                    className="mr-3"
                    src={CheckBoxGreen}
                    alt="Complete documentation"
                  />
                  <span>Complete documentation</span>
                </li>
                <li className="flex items-center mb-3 text-coolGray-500 font-medium">
                  <img
                    className="mr-3"
                    src={CheckBoxGreen}
                    alt="Working materials in Figma"
                  />
                  <span>Working materials in Figma</span>
                </li>
                <li className="flex items-center mb-3 text-coolGray-500 font-medium">
                  <img
                    className="mr-3"
                    src={CheckBoxGreen}
                    alt="100GB cloud storage"
                  />
                  <span>100GB cloud storage</span>
                </li>
                <li className="flex items-center text-coolGray-500 font-medium">
                  <img
                    className="mr-3"
                    src={CheckBoxGreen}
                    alt="500 team members"
                  />
                  <span>500 team members</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3 p-4">
            <div className="flex flex-col pt-8 pb-8 bg-coolGray-50 rounded-md shadow-md hover:scale-105 transition duration-500">
              <div className="px-8 pb-8">
                <div className="flex flex-wrap items-center justify-between mb-6">
                  <h3 className="mr-3 text-lg md:text-xl text-coolGray-800 font-medium">
                    Medium
                  </h3>
                  <span className="inline-block py-px px-2 text-xs leading-5 text-white bg-yellow-500 font-medium uppercase rounded-9xl">
                    Popular
                  </span>
                </div>
                <div className="mb-6">
                  <span className="relative -top-10 right-1 text-3xl text-coolGray-900 font-bold">
                    $
                  </span>
                  <span className="text-6xl md:text-7xl text-coolGray-900 font-semibold">
                    99
                  </span>
                  <span className="inline-block ml-1 text-coolGray-500 font-semibold">
                    per month
                  </span>
                </div>
                <p className="mb-6 text-coolGray-400 font-medium">
                  Basic features for up to 30 users.
                </p>
                <Link
                  className="inline-block py-4 px-7 mb-4 w-full text-base md:text-lg leading-6 text-green-50 font-medium text-center bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md shadow-sm"
                  to="/"
                >
                  Get Started
                </Link>
                <Link
                  className="inline-block py-3 px-7 w-full text-coolGray-500 font-medium text-center bg-white hover:bg-coolGray-100 focus:ring-2 focus:ring-coolGray-100 focus:ring-opacity-50 rounded-md shadow-sm"
                  to="/"
                >
                  Learn more
                </Link>
              </div>
              <div className="border-b border-coolGray-100"></div>
              <ul className="self-start px-8 pt-8">
                <li className="flex items-center mb-3 text-coolGray-500 font-medium">
                  <img
                    className="mr-3"
                    src={CheckBoxGreen}
                    alt="Complete documentation"
                  />
                  <span>Complete documentation</span>
                </li>
                <li className="flex items-center mb-3 text-coolGray-500 font-medium">
                  <img
                    className="mr-3"
                    src={CheckBoxGreen}
                    alt="Working materials in Figma"
                  />
                  <span>Working materials in Figma</span>
                </li>
                <li className="flex items-center mb-3 text-coolGray-500 font-medium">
                  <img
                    className="mr-3"
                    src={CheckBoxGreen}
                    alt="100GB cloud storage"
                  />
                  <span>100GB cloud storage</span>
                </li>
                <li className="flex items-center text-coolGray-500 font-medium">
                  <img
                    className="mr-3"
                    src={CheckBoxGreen}
                    alt="500 team members"
                  />
                  <span>500 team members</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3 p-4">
            <div className="flex flex-col pt-8 pb-8 bg-coolGray-50 rounded-md shadow-md hover:scale-105 transition duration-500">
              <div className="px-8 pb-8">
                <h3 className="mb-6 text-lg md:text-xl text-coolGray-800 font-medium">
                  Large
                </h3>
                <div className="mb-6">
                  <span className="relative -top-10 right-1 text-3xl text-coolGray-900 font-bold">
                    $
                  </span>
                  <span className="text-6xl md:text-7xl text-coolGray-900 font-semibold">
                    799
                  </span>
                  <span className="inline-block ml-1 text-coolGray-500 font-semibold">
                    per month
                  </span>
                </div>
                <p className="mb-6 text-coolGray-400 font-medium">
                  Basic features for up to 100 users.
                </p>
                <Link
                  className="inline-block py-4 px-7 mb-4 w-full text-base md:text-lg leading-6 text-green-50 font-medium text-center bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md shadow-sm"
                  to="/"
                >
                  Get Started
                </Link>
                <Link
                  className="inline-block py-3 px-7 w-full text-coolGray-500 font-medium text-center bg-white hover:bg-coolGray-100 focus:ring-2 focus:ring-coolGray-100 focus:ring-opacity-50 rounded-md shadow-sm"
                  to="/"
                >
                  Learn more
                </Link>
              </div>
              <div className="border-b border-coolGray-100"></div>
              <ul className="self-start px-8 pt-8">
                <li className="flex items-center mb-3 text-coolGray-500 font-medium">
                  <img
                    className="mr-3"
                    src={CheckBoxGreen}
                    alt="Complete documentation"
                  />
                  <span>Complete documentation</span>
                </li>
                <li className="flex items-center mb-3 text-coolGray-500 font-medium">
                  <img
                    className="mr-3"
                    src={CheckBoxGreen}
                    alt="Working materials in Figma"
                  />
                  <span>Working materials in Figma</span>
                </li>
                <li className="flex items-center mb-3 text-coolGray-500 font-medium">
                  <img
                    className="mr-3"
                    src={CheckBoxGreen}
                    alt="100GB cloud storage"
                  />
                  <span>100GB cloud storage</span>
                </li>
                <li className="flex items-center text-coolGray-500 font-medium">
                  <img
                    className="mr-3"
                    src={CheckBoxGreen}
                    alt="500 team members"
                  />
                  <span>500 team members</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
