import React from "react";

export default function Pricing() {
  return (
    <section className="py-20 xl:py-24 bg-white pattern-white-bg">
      <div className="container px-4 mx-auto">
        <div className="text-center">
          <span className="inline-block py-px px-2 mb-4 text-xs leading-5 text-green-500 bg-green-100 font-medium uppercase rounded-9xl">
            Pricing
          </span>
          <h3 className="mb-4 text-3xl md:text-5xl text-coolGray-900 font-bold tracking-tighter">
            Easy for landlords and renters
          </h3>
          <p className="mb-12 text-lg md:text-xl text-coolGray-500 font-medium">
            Lodgeek’s online payments are free for landlords. Tenants will pay
            rent with a credit or debit card for a small fee.
          </p>
        </div>
        <div className="flex flex-wrap justify-center -mx-4">
          <div className="w-full md:w-1/2 lg:w-1/3 p-4">
            <div className="flex flex-col pt-8 pb-8 bg-coolGray-50 rounded-md shadow-md hover:scale-105 transition duration-500">
              <div className="px-8 pb-8">
                <div className="flex flex-wrap items-center justify-between mb-6">
                  <h3 className="mr-3 text-lg md:text-xl text-coolGray-800 font-medium">
                    Transaction fee
                  </h3>
                </div>
                <div className="mb-6">
                  <span className="text-6xl md:text-7xl text-coolGray-900 font-semibold">
                    1.7%
                  </span>
                  <span className="inline-block ml-1 text-coolGray-500 font-semibold">
                    per transaction
                  </span>
                </div>
                <p className="mb-6 text-coolGray-400 font-medium">
                  Online rent collection is free for landlords. Tenants will pay
                  a 1.7% transaction fee. Local transaction fees are capped at
                  5,000 Naira, meaning that's the maximum you'll ever pay in
                  fees per transaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
