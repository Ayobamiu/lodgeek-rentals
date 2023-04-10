import { faAngleLeft, faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import moment from "moment";
import React, { FormEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { selectRentalRecord } from "../../app/features/rentalRecordSlice";
import { useAppSelector } from "../../app/hooks";
import DashboardWrapper from "../../components/dashboard/DashboardWrapper";
import { ProfilePhoto } from "../../components/dashboard/ProfilePhoto";
import AppInput from "../../components/shared/AppInput";
import DetailsBox from "../../components/shared/DetailsBox";
import { RentStatus } from "../../models";
import formatPrice from "../../utils/formatPrice";

const RentReviewpage = () => {
  let { id } = useParams();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(`/dashboard/rentalRecords/${id}`);
  };

  return (
    <DashboardWrapper>
      <div className="mx-auto max-w-3xl py-5">
        <button onClick={goBack} className="flex items-center gap-x-3 mb-3">
          <FontAwesomeIcon icon={faAngleLeft} /> <p>Go back</p>
        </button>
        <h2 className="font-semibold text-black text-3xl mb-5">
          Rent Review Process
        </h2>
        <ol className="relative border-l border-gray-200 dark:border-gray-700">
          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
              <svg
                aria-hidden="true"
                className="w-3 h-3 text-blue-800 dark:text-blue-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </span>
            <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
              Rent review request{" "}
              <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300 ml-3">
                Done
              </span>
            </h3>
            <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
              Released on January 13th, 2022
            </time>
            <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
              Property manager sends a request to tenant to review the current
              rent amount. In the first step of the rent review process,
              property managers should consider all relevant factors such as
              local tenancy laws, comparable rental properties, tenant payment
              history, and lease agreements.
            </p>

            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="py-2">
                    <a
                      href="#"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                    >
                      {open ? "Close" : "Open"} review form
                    </a>
                  </Disclosure.Button>
                  <Disclosure.Panel className="text-gray-500">
                    <RentReviewForm />
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </li>
          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
              <svg
                aria-hidden="true"
                className="w-3 h-3 text-blue-800 dark:text-blue-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </span>
            <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
              Rent review decision
            </h3>
            <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
              Released on December 7th, 2021
            </time>
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">
              After the property manager sends the rent review request to the
              tenant, they will wait for the tenant to respond. The response may
              involve accepting the proposed rent increase, negotiating a lower
              increase, or rejecting the increase entirely.
            </p>
            <ReviewConversations />
          </li>
          <li className="ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
              <svg
                aria-hidden="true"
                className="w-3 h-3 text-blue-800 dark:text-blue-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </span>
            <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
              Rent increase notice
            </h3>
            <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
              Released on December 2nd, 2021
            </time>
            <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
              If rent is to be increased, property manager sends a rent increase
              notice to the tenant.
            </p>
            <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
              If tenant accepts the increase, new lease agreement is signed. If
              not, the lease agreement continues with the previous rent amount.
            </p>
            <a
              href="#"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                  clip-rule="evenodd"
                ></path>
              </svg>{" "}
              Download Rent Notice
            </a>
          </li>
        </ol>
      </div>

      {/* <RentReviewForm /> */}
    </DashboardWrapper>
  );
};

export default RentReviewpage;

const RentReviewForm = () => {
  const {
    currentRentalRecord,
    currentRentalRecordCompany,
    currentRentalRecordProperty,
    currentRentalRecordOwner,
    currentRentalRecordTenant,
    currentRentalRecordRents,
  } = useAppSelector(selectRentalRecord);

  const paidRents = currentRentalRecordRents
    .filter((i) => i.status === RentStatus["Paid - Rent has been paid."])
    .sort((a, b) => a.dueDate - b.dueDate);
  const lastPaidRent = paidRents[paidRents.length - 1];

  const nextFourDuePayments = [];
  for (let index = 1; index < 6; index++) {
    nextFourDuePayments.push(
      moment(lastPaidRent.dueDate)
        .add(index, currentRentalRecord.rentPer)
        .toDate()
        .getTime()
    );
  }
  console.log({ nextFourDuePayments });

  const [propertyAddress, setPropertyAddress] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [currentRentAmount, setCurrentRentAmount] = useState("");
  const [newRentAmount, setNewRentAmount] = useState("");
  const [reviewDate, setReviewDate] = useState("");
  const [reviewReason, setReviewReason] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Logic to handle form submission
  };

  return (
    <div className="max-w-xl">
      <h2 className="font-semibold text-black text-3xl">Rent Review Form</h2>
      <p className="text-sm font-medium text-coolGray-500 text-justify my-2">
        As you prepare to conduct rent reviews for your properties, please keep
        in mind key factors such as local tenancy law, current rent amount,
        lease agreement, comparable rental properties, and tenant payment
        history. These factors will help ensure an informed and fair
        decision-making process for both you and your tenants. For properties
        located in Lagos, please refer to the{" "}
        <a
          href="http://lagosministryofjustice.org/wp-content/uploads/2022/01/Tenancy-Law-2011.pdf"
          target="_blank"
          className="underline underline-offset-2 text-blue-500"
        >
          Lagos Tenancy Law <FontAwesomeIcon icon={faExternalLink} size="xs" />
        </a>{" "}
        for guidance.
      </p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="propertyAddress">Property Address:</label>
          <AppInput
            type="text"
            id="propertyAddress"
            value={propertyAddress}
            onChange={(e) => setPropertyAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="unitNumber">Unit Number:</label>
          <AppInput
            type="text"
            id="unitNumber"
            value={unitNumber}
            onChange={(e) => setUnitNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="tenantName">Tenant Name:</label>
          <AppInput
            type="text"
            id="tenantName"
            value={tenantName}
            onChange={(e) => setTenantName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="currentRentAmount">Current Rent Amount:</label>
          <AppInput
            type="number"
            id="currentRentAmount"
            value={currentRentAmount}
            onChange={(e) => setCurrentRentAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="newRentAmount">New Rent Amount:</label>
          <AppInput
            type="number"
            id="newRentAmount"
            value={newRentAmount}
            onChange={(e) => setNewRentAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="reviewDate">
            Review Date (effective date of the increase):
          </label>

          <div className="mb-4 flex p-4 py-3 px-3 leading-5 w-full text-coolGray-400 font-normal border border-coolGray-200 outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-lg shadow-sm">
            <select
              name="reviewDate"
              id="reviewDate"
              className="w-full outline-none leading-5 text-coolGray-400 font-normal border-none"
            >
              {nextFourDuePayments.map((i) => (
                <option value={i}>{moment(i).format("LL")}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="reviewReason">Reason for Rent Review:</label>
          <AppInput
            type="text"
            id="reviewReason"
            value={reviewReason}
            onChange={(e) => setReviewReason(e.target.value)}
            required
            list="rentReviewReasons"
          />
          <datalist id="rentReviewReasons">
            <option value="Tenant request">Tenant request</option>
            <option value="Lease renewal">Lease renewal</option>
            <option value="Inflation">Inflation</option>
            <option value="Property improvements">Property improvements</option>
            <option value="Market conditions">Market conditions</option>
          </datalist>
        </div>
        <div>
          <label htmlFor="reviewNotes">Notes:</label>
          <div className="mb-4 flex p-4 py-3 px-3 leading-5 w-full text-coolGray-400 font-normal border border-coolGray-200 outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-lg shadow-sm">
            <textarea
              id="reviewNotes"
              value={reviewNotes}
              className="w-full outline-none leading-5 text-coolGray-400 font-normal border-none"
              onChange={(e) => setReviewNotes(e.target.value)}
            ></textarea>
          </div>
        </div>
        <button
          className="flex flex-wrap items-center justify-center h-[45px] px-4 w-full text-base text-white font-medium bg-green-500 hover:bg-green-600 rounded-md shadow-button"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

const ReviewConversations = () => {
  return (
    <div className="max-w-xl my-4">
      <form>
        <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
          <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
            <label htmlFor="response" className="sr-only">
              Your response
            </label>
            <textarea
              id="response"
              rows={4}
              className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
              placeholder="Write a response..."
              required
            ></textarea>
          </div>
          <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
            <button
              type="submit"
              className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
            >
              Post response
            </button>
          </div>
        </div>
      </form>
      <p className="ml-auto text-xs text-gray-500 dark:text-gray-400 mb-4">
        Your response should address accepting the proposed rent increase,
        negotiating a lower increase, or rejecting the increase entirely.
      </p>

      <ol className="relative border-l border-gray-200 dark:border-gray-700">
        <li className="mb-10 ml-6">
          <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
            <ProfilePhoto size="6" name="Property manager" />
          </span>
          <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:bg-gray-700 dark:border-gray-600">
            <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
              just now
            </time>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-300">
              Bonnie moved{" "}
              <a
                href="#"
                className="font-semibold text-blue-600 dark:text-blue-500 hover:underline"
              >
                Jese Leos
              </a>{" "}
              to{" "}
              <span className="bg-gray-100 text-gray-800 text-xs font-normal mr-2 px-2.5 py-0.5 rounded dark:bg-gray-600 dark:text-gray-300">
                Funny Group
              </span>
            </div>
          </div>
        </li>
        <li className="mb-10 ml-6">
          <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
            <ProfilePhoto size="6" name="Tenant" />
          </span>
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600">
            <div className="items-center justify-between mb-3 sm:flex">
              <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                2 hours ago
              </time>
              <div className="text-sm font-normal text-gray-500 lex dark:text-gray-300">
                Mr John Doe, the Property manager submitted a rent review
                request
              </div>
            </div>
            <div className="p-3 text-xs font-normal text-gray-500 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300">
              <DetailsBox label="Property Address:" value="Lekki Lagos" />
              <DetailsBox label="Unit Number:" value="2" />
              <DetailsBox
                label="Current Rent Amount:"
                value={formatPrice(1000000)}
              />
              <DetailsBox
                label="New Rent Amount:"
                value={formatPrice(1000000)}
              />
              <DetailsBox
                label="Review Date (effective date of the increase):"
                value={moment().format("ll")}
              />
              <DetailsBox
                label="Reason for Rent Review:"
                value="Lease renewal"
              />
              <DetailsBox
                label="Notes:"
                value="Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique, quasi reiciendis amet corrupti debitis quia alias saepe fuga. Minus consequatur vel reprehenderit doloribus quisquam assumenda ipsa hic, ullam nam. Laudantium."
              />
            </div>
          </div>
        </li>
      </ol>
    </div>
  );
};
