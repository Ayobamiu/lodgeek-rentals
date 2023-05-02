import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useState } from "react";
import ActivityIndicator from "../../components/shared/ActivityIndicator";
import { PayStackSubscription } from "../../models";

type UpdateCardDetailsProp = {
  subscription: PayStackSubscription;
};

export function UpdateCardDetails(props: UpdateCardDetailsProp) {
  const { subscription } = props;
  const [link, setLink] = useState("");
  const [generating, setGenerating] = useState(false);

  const generateUpdateSubscriptionLink = async () => {
    const options = {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_SECRET_KEY}`,
      },
    };
    setGenerating(true);
    await axios
      .get(
        `https://api.paystack.co/subscription/${subscription.subscription_code}/manage/link`,
        options
      )
      .then((response) => {
        setLink(response.data.data.link);
      })
      .finally(() => {
        setGenerating(false);
      });
  };

  return (
    <div
      id="alert-additional-content-2"
      className="p-4 mb-4 text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
      role="alert"
    >
      <div className="flex items-center">
        <svg
          aria-hidden="true"
          className="w-5 h-5 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          ></path>
        </svg>
        <span className="sr-only">Info</span>
        <h3 className="text-lg font-medium">
          There was an issue while trying to charge your card
        </h3>
      </div>
      <div className="mt-2 mb-4 text-sm">
        Sorry, your payment method was declined for your subscription renewal.
        Please update your payment information to ensure uninterrupted service.
        If you need assistance with updating your payment method, please contact
        our support team. Thank you.
      </div>

      <div className="flex gap-5 items-center">
        <button
          onClick={generateUpdateSubscriptionLink}
          disabled={generating}
          className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-3"
        >
          Update card
          {generating && <ActivityIndicator />}
        </button>
        {link && (
          <a
            href={link}
            target="_blank"
            className="text-blue-500 text-lg underline"
          >
            Click here to update your card{" "}
            <FontAwesomeIcon icon={faExternalLink} />
          </a>
        )}
      </div>
    </div>
  );
}
