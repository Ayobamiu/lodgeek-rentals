import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as FlexUIGreenLight } from "../../assets/logo-no-background.svg";
export default function Footer() {
  return (
    <section className="bg-white pattern-white-bg">
      <div className="container px-4 mx-auto">
        <div className="pt-24 pb-11 mx-auto max-w-4xl">
          <Link className="block md:mx-auto mb-5 max-w-max" to="/">
            <FlexUIGreenLight className="h-8 w-[95px]" />
          </Link>
          {/* <div className="flex flex-wrap justify-center -mx-3 lg:-mx-6">
            <div className="w-full md:w-auto p-3 md:px-6">
              <Link
                className="inline-block text-lg md:text-xl text-coolGray-500 hover:text-coolGray-600 font-medium"
                to="/"
              >
                Product
              </Link>
            </div>
            <div className="w-full md:w-auto p-3 md:px-6">
              <Link
                className="inline-block text-lg md:text-xl text-coolGray-500 hover:text-coolGray-600 font-medium"
                to="/"
              >
                Features
              </Link>
            </div>
            <div className="w-full md:w-auto p-3 md:px-6">
              <Link
                className="inline-block text-lg md:text-xl text-coolGray-500 hover:text-coolGray-600 font-medium"
                to="/"
              >
                Pricing
              </Link>
            </div>
            <div className="w-full md:w-auto p-3 md:px-6">
              <Link
                className="inline-block text-lg md:text-xl text-coolGray-500 hover:text-coolGray-600 font-medium"
                to="/"
              >
                Resources
              </Link>
            </div>
            <div className="w-full md:w-auto p-3 md:px-6">
              <Link
                className="inline-block text-lg md:text-xl text-coolGray-500 hover:text-coolGray-600 font-medium"
                to="/"
              >
                Careers
              </Link>
            </div>
            <div className="w-full md:w-auto p-3 md:px-6">
              <Link
                className="inline-block text-lg md:text-xl text-coolGray-500 hover:text-coolGray-600 font-medium"
                to="/"
              >
                Help
              </Link>
            </div>
            <div className="w-full md:w-auto p-3 md:px-6">
              <Link
                className="inline-block text-lg md:text-xl text-coolGray-500 hover:text-coolGray-600 font-medium"
                to="/"
              >
                Privacy
              </Link>
            </div>
          </div> */}
        </div>
      </div>
      <div className="border-b border-coolGray-100"></div>
      <div className="container px-4 mx-auto">
        <p className="py-10 md:pb-20 text-lg md:text-xl text-coolGray-400 font-medium text-center">
          © 2023 Lodgeek. All rights reserved.
        </p>
      </div>
    </section>
  );
}
