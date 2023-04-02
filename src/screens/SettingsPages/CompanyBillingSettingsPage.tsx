import { useState } from "react";
import SettingsWrapper from "../../components/settings/SettingsWrapper";
import CompanyProfileEditPage from "./CompanyProfileEditPage";

const CompanyBillingSettingsPage = () => {
  // State for managing the user's subscription and billing information
  const [subscription, setSubscription] = useState({
    plan: "",
    nextBillingDate: "",
    status: "",
    price: "",
  });
  const [billingInfo, setBillingInfo] = useState({
    name: "",
    email: "",
    address: "",
    paymentMethod: "",
  });

  // Function to handle updating the user's subscription
  // const updateSubscription = (newSubscription) => {
  //   setSubscription(newSubscription);
  // };

  // Function to handle updating the user's billing information
  // const updateBillingInfo = (newBillingInfo) => {
  //   setBillingInfo(newBillingInfo);
  // };

  return (
    <SettingsWrapper>
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-4">Billing</h2>

        {/* Subscription card component */}
        <SubscriptionCard
        // subscription={subscription} updateSubscription={updateSubscription}
        />

        {/* Billing information component */}
        <PaymentCardDetails
          expiryDate="02/26"
          cardHolderName="John Doe"
          cardNumber="12345678901234"
          //  billingInfo={billingInfo} updateBillingInfo={updateBillingInfo}
        />
        {/* Billing information component */}
        {/* <BillingInformation
        //  billingInfo={billingInfo} updateBillingInfo={updateBillingInfo}
        /> */}

        {/* Button to cancel subscription */}
        <button className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4">
          Cancel Subscription
        </button>
      </div>
    </SettingsWrapper>
  );
};

export default CompanyBillingSettingsPage;

const SubscriptionCard = () => {
  return (
    <div className=" bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
      <div className="flex justify-between p-6 border-b items-center">
        <div className="">
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Plan
          </h1>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Basic Plan
          </p>
        </div>
        <div className="">
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Cost
          </h1>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            NGN 20,000 per month
          </p>
        </div>
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Upgrade
        </button>
      </div>
      <div className="p-6">Your account expires on Jul 1st, 2023.</div>
    </div>
  );
};

const BillingInformation = () => {
  const [billingInfo, setBillingInfo] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setBillingInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // Submit billing information to server or API
    console.log("Billing information submitted:", billingInfo);
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Billing Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Name on Card
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={billingInfo.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="cardNumber"
            className="block text-gray-700 font-bold mb-2"
          >
            Card Number
          </label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={billingInfo.cardNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex justify-between mb-4">
          <div className="w-2/3 mr-4">
            <label
              htmlFor="expiry"
              className="block text-gray-700 font-bold mb-2"
            >
              Expiry Date (MM/YY)
            </label>
            <input
              type="text"
              id="expiry"
              name="expiry"
              value={billingInfo.expiry}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="w-1/3">
            <label htmlFor="cvv" className="block text-gray-700 font-bold mb-2">
              CVV
            </label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={billingInfo.cvv}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 ease-in-out"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

const PaymentCardDetails = ({
  cardHolderName,
  cardNumber,
  expiryDate,
}: {
  cardHolderName: string;
  cardNumber: string;
  expiryDate: string;
}) => {
  // Mask card numbers for security
  const maskedCardNumber = cardNumber
    .replace(/\s/g, "")
    .replace(/(\d{4})/g, "**** **** **** $1");
  const lastFourDigits = cardNumber.slice(-4);

  return (
    <div className="bg-white shadow-md p-6 rounded-lg my-5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Payment Card Details
        </h2>
        <img
          src="https://tailwindui.com/img/logos/visa.svg"
          alt="Visa"
          className="w-12"
        />
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="text-gray-800 text-sm">Cardholder Name</div>
        <div className="text-gray-800 font-medium">{cardHolderName}</div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="text-gray-800 text-sm">Card Number</div>
        <div className="text-gray-800 font-medium">
          <span>**** **** **** {lastFourDigits}</span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-gray-800 text-sm">Expiry Date</div>
        <div className="text-gray-800 font-medium">{expiryDate}</div>
      </div>
    </div>
  );
};
