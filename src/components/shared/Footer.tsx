import React from "react";
import { ReactComponent as FlexUIGreenLight } from "../../assets/logo-no-background.svg";
export default function Footer() {
  return (
    <section className="bg-white pattern-white-bg">
      <div className="container px-4 mx-auto">
        <div className="pt-24 pb-11 mx-auto max-w-4xl">
          <a className="block md:mx-auto mb-5 max-w-max" href="#">
            <FlexUIGreenLight className="h-8 w-[95px]" />
          </a>
          <div className="flex flex-wrap justify-center -mx-3 lg:-mx-6">
            <div className="w-full md:w-auto p-3 md:px-6">
              <a
                className="inline-block text-lg md:text-xl text-coolGray-500 hover:text-coolGray-600 font-medium"
                href="#"
              >
                Product
              </a>
            </div>
            <div className="w-full md:w-auto p-3 md:px-6">
              <a
                className="inline-block text-lg md:text-xl text-coolGray-500 hover:text-coolGray-600 font-medium"
                href="#"
              >
                Features
              </a>
            </div>
            <div className="w-full md:w-auto p-3 md:px-6">
              <a
                className="inline-block text-lg md:text-xl text-coolGray-500 hover:text-coolGray-600 font-medium"
                href="#"
              >
                Pricing
              </a>
            </div>
            <div className="w-full md:w-auto p-3 md:px-6">
              <a
                className="inline-block text-lg md:text-xl text-coolGray-500 hover:text-coolGray-600 font-medium"
                href="#"
              >
                Resources
              </a>
            </div>
            <div className="w-full md:w-auto p-3 md:px-6">
              <a
                className="inline-block text-lg md:text-xl text-coolGray-500 hover:text-coolGray-600 font-medium"
                href="#"
              >
                Careers
              </a>
            </div>
            <div className="w-full md:w-auto p-3 md:px-6">
              <a
                className="inline-block text-lg md:text-xl text-coolGray-500 hover:text-coolGray-600 font-medium"
                href="#"
              >
                Help
              </a>
            </div>
            <div className="w-full md:w-auto p-3 md:px-6">
              <a
                className="inline-block text-lg md:text-xl text-coolGray-500 hover:text-coolGray-600 font-medium"
                href="#"
              >
                Privacy
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-b border-coolGray-100"></div>
      <div className="container px-4 mx-auto">
        <p className="py-10 md:pb-20 text-lg md:text-xl text-coolGray-400 font-medium text-center">
          © 2021 Flex. All rights reserved.
        </p>
      </div>
    </section>
  );
}
