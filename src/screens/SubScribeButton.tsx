//@ts-nocheck
import {
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useState } from "react";
import { PaystackButton } from "react-paystack";
import { useNavigate } from "react-router-dom";
import {
  selectSelectedCompany,
  setSelectedCompany,
  updateCompany,
} from "../app/features/companySlice";
import { selectUser } from "../app/features/userSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import ActivityIndicator from "../components/shared/ActivityIndicator";
import { updateCompanyInDatabase } from "../firebase/apis/company";
import { Company } from "../models";

type SubScribeButtonProp = {
  planCode: string;
  amount: number;
};

export function SubScribeButton(props: SubScribeButtonProp) {
  const { amount, planCode } = props;
  const selectedCompany = useAppSelector(selectSelectedCompany);
  const loggedInUser = useAppSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [confirming, setConfirming] = useState(false);
  const [subscriptionConfirmed, setSubscriptionConfirmed] = useState(false);
  const [subscriptionfailed, setSubscriptionfailed] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const options = {
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  };

  const verifySubscription = async (id: string) => {
    const onError:
      | ((reason: any) => void | PromiseLike<void>)
      | null
      | undefined = () => {
      setSubscriptionfailed(true);
      setConfirming(false);
    };
    const onFinally = () => {
      setConfirming(false);
    };
    setShowNotificationModal(true);
    setConfirming(true);

    await axios
      .get(`https://api.paystack.co/transaction/verify/${id}`, options)
      .then(async (transactionResponse) => {
        const customer = transactionResponse.data.data.customer.id;
        const plan = transactionResponse.data.data.plan_object.id;
        await axios
          .get(
            `https://api.paystack.co/subscription?customer=${customer}&plan=${plan}`,
            options
          )
          .then(async (response) => {
            const subsribtions = response.data.data;
            const rearranged = subsribtions.sort(function (a, b) {
              return new Date(b.createdAt) - new Date(a.createdAt);
            });
            const latestSub = rearranged[0];
            const subscriptionCode = latestSub.subscription_code;
            const nextPaymentDate = latestSub.next_payment_date;
            const planCode = latestSub.plan.plan_code;

            const company: Company = {
              ...selectedCompany,
              subscriptionCode,
              nextPaymentDate,
              planCode,
            };

            await updateCompanyInDatabase(company).then(() => {
              dispatch(updateCompany(company));
              dispatch(setSelectedCompany(company));
              setSubscriptionConfirmed(true);
            });
          })
          .catch(onError)
          .finally(onFinally);
      })
      .catch(onError);
  };

  const handlePaystackSuccessAction = async (reference) => {
    // Implementation for whatever you want to do with reference and after success call.
    await verifySubscription(reference.reference);
  };

  const config = {
    reference: new Date().getTime().toString(),
    email: loggedInUser?.email || "",
    publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || "",
    plan: planCode,
    billingEmail: loggedInUser?.email,
    amount,
  };

  const componentProps = {
    ...config,
    text: "Choose plan",
    onSuccess: (reference: any) => handlePaystackSuccessAction(reference),
    onClose: () => {},
  };

  function gotoRentalRecords() {
    navigate(`/dashboard/${selectedCompany?.id}/rentalRecords`);
  }

  return (
    <>
      {showNotificationModal && (
        <div className="fixed w-screen h-screen bg-gray-100 top-0 left-0 flex flex-col justify-center items-center p-5">
          {confirming && (
            <div className=" flex flex-col items-center justify-center text-center">
              <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                Confirming your subscribtion
              </h5>
              <p className="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">
                Please don't exit this page
              </p>
              <ActivityIndicator />
            </div>
          )}
          {subscriptionConfirmed && (
            <div className=" flex flex-col items-center justify-center text-center">
              <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                Subscribtion Confirmed
              </h5>

              <FontAwesomeIcon
                icon={faCheckCircle}
                size="3x"
                className="text-green-500"
              />
              <button
                onClick={gotoRentalRecords}
                className="my-5 font-normal underline rounded-lg text-sm text-green-500"
              >
                Close
              </button>
            </div>
          )}
          {subscriptionfailed && (
            <div className=" flex flex-col items-center justify-center text-center">
              <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                Subscribtion Failed
              </h5>
              <p className="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">
                The error is from us. Please contact admin on{" "}
                <a
                  className="underline text-blue-500"
                  href="mailto:contact@lodgeek.com"
                >
                  contact@lodgeek.com
                </a>
                . We will get it fixed ASAP.
              </p>
              <FontAwesomeIcon
                icon={faExclamationCircle}
                size="3x"
                className="text-red-500"
              />
              <button
                onClick={gotoRentalRecords}
                className="my-5 font-normal underline rounded-lg text-sm text-blue-500"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
      <PaystackButton
        className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-900 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center"
        {...componentProps}
      />
    </>
  );
}
