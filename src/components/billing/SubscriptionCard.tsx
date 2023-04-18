import moment from "moment";
import { Link } from "react-router-dom";
import { PayStackSubscription } from "../../models";
import formatPrice from "../../utils/formatPrice";

export function SubscriptionCard({
  subscription,
}: {
  subscription: PayStackSubscription;
}) {
  return (
    <div className=" bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
      <div className="flex justify-between p-6 border-b items-center flex-wrap gap-5">
        <div className="">
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Plan
          </h1>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {subscription.plan.name}
          </p>
        </div>
        <div className="">
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Cost
          </h1>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {formatPrice(subscription.amount / 100)}{" "}
            {subscription.plan.interval}
          </p>
        </div>
        <Link
          to="/select-plans"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Upgrade
        </Link>
      </div>
      <div className="p-6">
        Your account expires on{" "}
        <strong>{moment(subscription.next_payment_date).format("ll")}</strong>.
      </div>
    </div>
  );
}
