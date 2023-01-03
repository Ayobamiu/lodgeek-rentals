import React from "react";
import CheckBoxGreenCTA from "../../assets/flex-ui-assets/elements/cta/checkbox-green.svg";
import { ReactComponent as Circle3yellow } from "../../assets/flex-ui-assets/elements/circle3-yellow.svg";
import { ReactComponent as Dots3blue } from "../../assets/flex-ui-assets/elements/dots3-blue.svg";
import PhotoLaptopPh from "../../assets/flex-ui-assets/elements/cta/photo-laptop-ph.png";
import { Link } from "react-router-dom";

export default function HomePageCTA() {
  return (
    <section className="py-24 bg-white overflow-hidden pattern-white-bg">
      <div className="container px-4 mx-auto">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/2 px-4 mb-20 lg:mb-0">
            <div className="max-w-md mx-auto">
              <h2 className="mb-8 text-4xl md:text-5xl font-heading font-bold text-coolGray-900 md:leading-15">
                Join 6,000+ startups growing with Flex
              </h2>
              <ul className="mb-8">
                <li className="flex items-center mb-4">
                  <img className="mr-3" src={CheckBoxGreenCTA} alt="" />
                  <span className="text-lg md:text-xl font-heading text-coolGray-500">
                    Mauris pellentesque congue libero nec
                  </span>
                </li>
                <li className="flex items-center mb-4">
                  <img className="mr-3" src={CheckBoxGreenCTA} alt="" />
                  <span className="text-lg md:text-xl font-heading text-coolGray-500">
                    Suspendisse mollis tincidunt
                  </span>
                </li>
                <li className="flex items-center">
                  <img className="mr-3" src={CheckBoxGreenCTA} alt="" />
                  <span className="text-lg md:text-xl font-heading text-coolGray-500">
                    Praesent varius justo vel justo pulvinar
                  </span>
                </li>
              </ul>
              <div className="flex flex-wrap items-center">
                <Link
                  className="inline-flex items-center justify-center px-7 py-3 h-14 w-full md:w-auto mb-2 md:mb-0 md:mr-4 md:w-auto text-lg leading-7 text-coolGray-800 bg-white hover:bg-coolGray-100 font-medium focus:ring-2 focus:ring-coolGray-200 focus:ring-opacity-50 border border-coolGray-200 border border-coolGray-100 rounded-md shadow-sm"
                  to="/"
                >
                  Learn More
                </Link>
                <Link
                  className="inline-flex items-center justify-center px-7 py-3 h-14 w-full md:w-auto text-lg leading-7 text-green-50 bg-green-500 hover:bg-green-600 font-medium focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 border border-transparent rounded-md shadow-sm"
                  to="/"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 px-4">
            <div className="relative max-w-max mx-auto">
              <Circle3yellow className="absolute top-0 right-0 -mt-6 lg:-mt-12 -mr-6 lg:-mr-12 w-20 lg:w-auto z-10" />
              <Dots3blue className="absolute bottom-0 left-0 -mb-6 lg:-mb-10-ml-6 lg:-ml-12 w-20 lg:w-auto" />
              <img className="relative" src={PhotoLaptopPh} alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
