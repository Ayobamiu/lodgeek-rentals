import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as FlexUIGreenLight } from "../../assets/logo-no-background.svg";
export default function Footer() {
  return (
    <section className="bg-white pattern-white-bg">
      <div className="container px-4 mx-auto">
        <div className="pt-24 pb-11 mx-auto max-w-4xl">
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
        <div className="mx-auto">
          <div className="text-xs font-medium text-coolGray-500 lg:text-center text-justify my-2">
            Lodgeek is an intermediary that provides a range of rental
            management services to property owners. These services include, but
            are not limited to, marketing and advertising properties for rent,
            screening and selecting tenants, managing the lease process,
            collecting rent, managing repairs and maintenance, and facilitating
            communication between property owners and tenants.
          </div>

          <div className="text-xs font-medium text-coolGray-500 lg:text-center text-justify my-2">
            Lodgeek is not a party to the rental agreements entered into between
            property owners and tenants, and its role is limited to that of an
            intermediary facilitating the rental process. Lodgeek does not own
            or control any of the properties listed on its platform, and its
            relationship with property owners and tenants is limited to
            facilitating the rental process and providing rental management
            services.
          </div>

          <div className="text-xs font-medium text-coolGray-500 lg:text-center text-justify my-2">
            Lodgeek does not discriminate against any person based on their
            race, color, religion, sex, national origin, familial status, or
            disability. Lodgeek is committed to ensuring that all properties
            listed on its platform comply with applicable laws and regulations.
          </div>

          <div className="text-xs font-medium text-coolGray-500 lg:text-center text-justify my-2">
            Property owners and tenants are responsible for their own actions
            and decisions related to the rental process. They acknowledge that
            Lodgeek is not responsible for any disputes, damages, or losses that
            may arise from the use of its platform or the rental process, and
            that Lodgeek is not liable for any damages or losses incurred by
            them as a result of their use of the platform or the services
            provided by Lodgeek.
          </div>

          <div className="text-xs font-medium text-coolGray-500 lg:text-center text-justify my-2">
            By using Lodgeek's platform and services, property owners and
            tenants agree to be bound by the terms and conditions set out in
            this declaration.
          </div>
        </div>
        <p className="py-10 md:pb-20 text-xs text-coolGray-400 font-medium lg:text-center text-justify">
          © 2023 Lodgeek. All rights reserved.
        </p>
      </div>
    </section>
  );
}
