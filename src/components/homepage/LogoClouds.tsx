import React from "react";
import { ReactComponent as JiggleLogoGrey } from "../../assets/flex-ui-assets/brands/logo-clouds/jiggle-logo-grey.svg";
import { ReactComponent as SymtricLogoGrey } from "../../assets/flex-ui-assets/brands/logo-clouds/symtric-logo-grey.svg";
import { ReactComponent as WishelpLogoGrey } from "../../assets/flex-ui-assets/brands/logo-clouds/wishelp-logo-grey.svg";
import { ReactComponent as ResecurbLogoGrey } from "../../assets/flex-ui-assets/brands/logo-clouds/resecurb-logo-grey.svg";
import { ReactComponent as WelyticsLogoGrey } from "../../assets/flex-ui-assets/brands/logo-clouds/welytics-logo-grey.svg";
export default function LogoClouds() {
  return (
    <section className="py-20 xl:pt-24 bg-white">
      <div className="container px-4 mx-auto">
        <div className="mb-8 text-center">
          <span className="inline-block py-px px-2 mb-4 text-xs leading-5 text-green-500 bg-green-100 font-medium uppercase rounded-9xl">
            Our Clients
          </span>
          <h3 className="mb-4 text-4xl md:text-5xl text-coolGray-900 font-bold tracking-tighter">
            Trusted by the top companies in this industry
          </h3>
          <p className="text-lg md:text-xl text-coolGray-500 font-medium">
            The only SaaS business platform that combines CRM, marketing
            automation &amp; commerce.
          </p>
        </div>
        <div className="flex flex-wrap justify-center -mx-4">
          <div className="w-1/2 md:w-1/3 lg:w-1/5 px-4 mb-8 lg:mb-0">
            <div className="flex items-center h-32 md:h-36 px-4 md:px-8 rounded-md bg-coolGray-50 shadow-md">
              <JiggleLogoGrey className="mx-auto" />
            </div>
          </div>
          <div className="w-1/2 md:w-1/3 lg:w-1/5 px-4 mb-8 lg:mb-0">
            <div className="flex items-center h-32 md:h-36 px-4 md:px-8 rounded-md bg-coolGray-50 shadow-md">
              <SymtricLogoGrey className="mx-auto" />
            </div>
          </div>
          <div className="w-1/2 md:w-1/3 lg:w-1/5 px-4 mb-8 lg:mb-0">
            <div className="flex items-center h-32 md:h-36 px-4 md:px-8 rounded-md bg-coolGray-50 shadow-md">
              <WishelpLogoGrey className="mx-auto" />
            </div>
          </div>
          <div className="w-1/2 md:w-1/3 lg:w-1/5 px-4 mb-8 md:mb-0">
            <div className="flex items-center h-32 md:h-36 px-4 md:px-8 rounded-md bg-coolGray-50 shadow-md">
              <ResecurbLogoGrey className="mx-auto" />
            </div>
          </div>
          <div className="w-1/2 md:w-1/3 lg:w-1/5 px-4">
            <div className="flex items-center h-32 md:h-36 px-4 md:px-8 rounded-md bg-coolGray-50 shadow-md">
              <WelyticsLogoGrey className="mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
