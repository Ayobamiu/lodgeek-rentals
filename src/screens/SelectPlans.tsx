import { PlanDuration, RentType } from "../models";
import { ReactComponent as FlexUIGreenLight } from "../assets/logo-no-background.svg";
import { SubScribeButton } from "./SubScribeButton";
import { selectSelectedCompany } from "../app/features/companySlice";
import { useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../app/features/userSlice";
import { useMemo, useState } from "react";
import { getPlanPriceAndCode } from "../functions/Payment/getPlanPriceAndCode";

const SelectPlans = () => {
  const [duration, setDuration] = useState(PlanDuration.Yearly);
  const {
    basicPlanPrice,
    premiumPlanPrice,
    proPlanPrice,
    basicPlanDiscountedPrice,
    premiumPlanDiscountedPrice,
    proPlanDiscountedPrice,
    basicPlanCode,
    premiumPlanCode,
    proPlanCode,
  } = useMemo(getPlanPriceAndCode(duration), [duration]);

  const plans = [
    {
      name: "Free Plan",
      properties: "Up to 5 properties",
      invoicing: "Invoicing System",
      rentCollection: true,
      leaseBuilder: true,
      rentReminders: true,
      financialReports: false,
      teamManagement: false,
      googleCalendarIntegration: false,
      price: 0,
      discountedPrice: 0,
      planCode: "",
    },
    {
      name: "Basic Plan",
      properties: "Up to 20 properties",
      invoicing: "Invoicing System",
      rentCollection: true,
      leaseBuilder: true,
      rentReminders: true,
      financialReports: true,
      teamManagement: false,
      googleCalendarIntegration: false,
      price: basicPlanPrice,
      discountedPrice: basicPlanDiscountedPrice,
      planCode: basicPlanCode,
    },
    {
      name: "Pro Plan",
      properties: "Up to 50 properties",
      invoicing: "Invoicing System",
      rentCollection: true,
      leaseBuilder: true,
      rentReminders: true,
      financialReports: true,
      teamManagement: true,
      googleCalendarIntegration: false,
      price: proPlanPrice,
      discountedPrice: proPlanDiscountedPrice,
      planCode: proPlanCode,
    },
    {
      name: "Premium Plan",
      properties: "Unlimited properties",
      invoicing: "Invoicing System",
      rentCollection: true,
      leaseBuilder: true,
      rentReminders: true,
      financialReports: true,
      teamManagement: true,
      googleCalendarIntegration: true,
      price: premiumPlanPrice,
      discountedPrice: premiumPlanDiscountedPrice,
      planCode: premiumPlanCode,
    },
  ];

  const getButtonStyle = (d: PlanDuration) => {
    const selectedButtonStyle =
      "hover:text-blue-700 z-10 ring-2 ring-blue-700 text-blue-700 dark:ring-blue-500 dark:text-white";
    return `px-4 py-2 text-sm lg:px-6 lg:py-3.5 lg:text-base font-medium text-gray-900 bg-white border-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 ${
      d === duration ? selectedButtonStyle : ""
    }`;
  };

  return (
    <section className="py-20 xl:py-24 bg-white pattern-white-bg px-5">
      <div className="container px-4 mx-auto">
        <div className="text-center">
          <FlexUIGreenLight className="relative -top-2 left-1/2 -translate-x-1/2 -mt-16 mb-6 h-16 lg:w-auto w-24" />

          <span className="inline-block py-px px-2 mb-4 text-xs leading-5 text-green-500 bg-green-100 font-medium uppercase rounded-9xl">
            Pricing
          </span>
          <h3 className="mb-4 text-3xl md:text-5xl text-coolGray-900 font-bold tracking-tighter">
            Choose the Plan That's Right for You
          </h3>
          <p className="mb-12 text-lg md:text-xl text-coolGray-500 font-medium">
            Select from our range of flexible plans to help you manage your
            properties and tenants. Whether you're just starting out or looking
            to expand your portfolio, we have a plan that suits your needs and
            budget.
          </p>
        </div>
        <div className="flex justify-center w-full">
          <div
            className="inline-flex rounded-md shadow-sm justify-center my-5"
            role="group"
          >
            <button
              type="button"
              onClick={() => setDuration(PlanDuration.Monthly)}
              className={`border ${getButtonStyle(
                PlanDuration.Monthly
              )} rounded-l-lg`}
            >
              {PlanDuration.Monthly}
            </button>
            <button
              type="button"
              onClick={() => setDuration(PlanDuration["Bi-Annually"])}
              className={`border-t border-b ${getButtonStyle(
                PlanDuration["Bi-Annually"]
              )}`}
            >
              {PlanDuration["Bi-Annually"]}
            </button>
            <button
              type="button"
              onClick={() => setDuration(PlanDuration.Yearly)}
              className={`border ${getButtonStyle(
                PlanDuration.Yearly
              )} rounded-r-md`}
            >
              {PlanDuration.Yearly}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center -mx-4 gap-5">
          {plans.map((plan) => (
            <LodgeekPlan
              key={plan.planCode}
              name={plan.name}
              amount={plan.price}
              rentPer={RentType.month}
              duration={duration}
              discountedAmount={plan.discountedPrice}
              details={[
                { text: plan.properties },
                {
                  text: "Auto-rent collection",
                  notAllowed: !plan.rentCollection,
                },
                { text: "Lease builder", notAllowed: !plan.leaseBuilder },
                {
                  text: "Rent reminders for tenants and managers",
                  notAllowed: !plan.rentReminders,
                },
                { text: plan.invoicing },
                {
                  text: "Financial reports",
                  notAllowed: !plan.financialReports,
                },
                { text: "Team management", notAllowed: !plan.teamManagement },
                {
                  text: "Google Calendar integration",
                  notAllowed: !plan.googleCalendarIntegration,
                },
              ]}
              planCode={plan.planCode || ""}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SelectPlans;

type LodgeekPlanProp = {
  name: string;
  rentPer: RentType;
  amount: number;
  discountedAmount: number;
  details: {
    text: string;
    notAllowed?: boolean;
  }[];
  planCode: string;
  duration: PlanDuration;
};

function LodgeekPlan(props: LodgeekPlanProp) {
  const { amount, details, name, planCode, duration, discountedAmount } = props;
  const selectedCompany = useAppSelector(selectSelectedCompany);
  const loggedInUser = useAppSelector(selectUser);
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
      <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
        {name}
      </h5>
      <div className="flex items-baseline text-gray-900 dark:text-white">
        <span className="text-3xl font-semibold">₦</span>
        <span className="text-5xl font-extrabold tracking-tight">
          {discountedAmount.toLocaleString()}
        </span>
        <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400 lowercase">
          {duration}
        </span>
      </div>
      {amount !== discountedAmount && (
        <div className="text-gray-300 dark:text-gray-200">
          <span className="text-3xl font-semibold">₦</span>
          <span className="text-5xl font-extrabold line-through">
            {amount.toLocaleString()}
          </span>
        </div>
      )}

      <ul role="list" className="space-y-5 my-7">
        {details.map((i, index) => (
          <li
            key={index}
            className={`flex space-x-3 ${
              i.notAllowed ? "line-through decoration-gray-500" : ""
            }`}
          >
            <svg
              aria-hidden="true"
              className={`flex-shrink-0 w-5 h-5 ${
                i.notAllowed
                  ? "text-gray-400 dark:text-gray-500"
                  : "text-green-600 dark:text-green-500"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Check icon</title>
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span
              className={`text-base font-normal leading-tight text-gray-500 ${
                i.notAllowed ? "" : "dark:text-gray-400"
              }`}
            >
              {i.text}
            </span>
          </li>
        ))}
      </ul>

      {!loggedInUser ? (
        <>
          <button
            className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-900 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center"
            onClick={() => {
              navigate(`/auth`);
            }}
          >
            Get started
          </button>
        </>
      ) : (
        <>
          {discountedAmount > 0 ? (
            <SubScribeButton amount={discountedAmount} planCode={planCode} />
          ) : (
            <button
              className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-900 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center"
              onClick={() => {
                navigate(`/dashboard/${selectedCompany?.id}/rentalRecords`);
              }}
            >
              Continue free
            </button>
          )}
        </>
      )}
    </div>
  );
}
