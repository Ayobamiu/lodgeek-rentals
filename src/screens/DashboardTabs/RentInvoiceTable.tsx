import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { AdditionalFee, Rent, RentStatus } from "../../models";
import formatPrice from "../../utils/formatPrice";
import { Transition } from "@headlessui/react";
import { PaystackButton } from "react-paystack";
import {
  selectRent,
  setOpenRentPayment,
  setSelectedRents,
} from "../../app/features/rentSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUser } from "../../app/features/userSlice";
import {
  selectRentalRecord,
  setCurrentRentalRecord,
  setCurrentRentalRecordRents,
} from "../../app/features/rentalRecordSlice";
import { getRentsAndFees } from "./getRentsAndFees";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import FullScreenActivityIndicator from "../../components/shared/FullScreenActivityIndicator";
import { payRentAndFees } from "../../functions/Payment/payRentAndFees";

export function RentInvoiceTable() {
  const {
    currentRentalRecord,
    currentRentalRecordCompany,
    currentRentalRecordProperty,
    currentRentalRecordOwner,
    currentRentalRecordTenant,
    currentRentalRecordRents,
  } = useAppSelector(selectRentalRecord);
  const { selectedRents, openRentPayment, selectedAdditionalFees } =
    useAppSelector(selectRent);
  const { transactionFee, totalFeeMinusTransactionFee } = getRentsAndFees(
    selectedRents,
    selectedAdditionalFees,
    currentRentalRecordCompany
  );
  const dispatch = useAppDispatch();
  const [updatingRents, setUpdatingRents] = useState(false);
  let { rentalRecordId } = useParams();

  const loggedInUser = useAppSelector(selectUser);

  const totalAmountToPay = useMemo(() => {
    const { transactionFee, totalFeeMinusTransactionFee } = getRentsAndFees(
      selectedRents,
      selectedAdditionalFees,
      currentRentalRecordCompany
    );
    return transactionFee + totalFeeMinusTransactionFee;
  }, [selectedRents, selectedAdditionalFees]);

  const updateSelectedRents = (value: Rent[]) => {
    dispatch(setSelectedRents(value));
  };
  const handlePaidRents = async () => {
    setUpdatingRents(true);

    await payRentAndFees({
      rents: selectedRents,
      rentalRecordId: rentalRecordId || "",
      owner: currentRentalRecordOwner?.email || "",
      propertyTitle: currentRentalRecordProperty?.title || "",
      tenantName: `${currentRentalRecordTenant?.firstName} ${currentRentalRecordTenant?.lastName}`,
      tenantEmail: currentRentalRecordTenant?.email || "",
      selectedAdditionalFees,
      rentalRecord: currentRentalRecord!,
      transactionFee,
    })
      .finally(() => {
        updateSelectedRents([]);
        setUpdatingRents(false);
      })
      .then(() => {
        const updatedRents = currentRentalRecordRents.map((i) => {
          const justPaid = selectedRents.findIndex((x) => x.id === i.id) > -1;
          if (justPaid) {
            const paidRent: Rent = {
              ...i,
              status: RentStatus["Paid - Rent has been paid."],
            };
            return paidRent;
          } else {
            return i;
          }
        });
        const updateDfees: AdditionalFee[] =
          currentRentalRecord?.fees?.map((i) => {
            if (selectedAdditionalFees.findIndex((x) => x.id === i.id) > -1) {
              return { ...i, paid: true, paidOn: Date.now() };
            } else {
              return i;
            }
          }) || [];
        const updatedRentalRecord = {
          ...currentRentalRecord!,
          fees: updateDfees,
        };
        dispatch(setCurrentRentalRecord(updatedRentalRecord));

        dispatch(setCurrentRentalRecordRents(updatedRents));
        dispatch(setOpenRentPayment(false));
      });
  };

  const config = {
    reference: new Date().getTime().toString(),
    email: loggedInUser?.email || "",
    // amount: 200 * 100,
    amount: totalAmountToPay * 100,
    publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || "",
  };

  const componentProps = {
    ...config,
    text: "Pay",
    onSuccess: () => handlePaidRents(),
    onClose: () => {},
  };

  return (
    <>
      {updatingRents && <FullScreenActivityIndicator />}

      <Transition
        show={openRentPayment}
        enter="transition-opacity duration-150"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="bg-black bg-opacity-50 fixed h-full w-full top-0 left-0 flex items-center justify-center z-40">
          <div className="lg:w-[600px] w-full lg:h-auto h-screen overflow-y-scroll bg-white lg:rounded-3xl p-6 relative">
            <FontAwesomeIcon
              icon={faTimes}
              className="absolute right-4 top-3 cursor-pointer"
              size="1x"
              onClick={() => dispatch(setOpenRentPayment(false))}
            />
            <div className="p-3">
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table
                  className="w-full text-sm text-left text-gray-500 dark:text-gray-400"
                  title="Payment Invoice"
                >
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3 rounded-l-lg">
                        Description
                      </th>

                      <th scope="col" className="px-6 py-3 rounded-r-lg">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRents.map((rent, rentIndex) => (
                      <tr
                        key={rent.id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          Rent for {moment(rent.dueDate).format("MMM YYYY")} -{" "}
                          {moment(rent.dueDate)
                            .add(1, rent.rentPer)
                            .format("MMM YYYY")}
                        </th>

                        <td className="px-6 py-4">{formatPrice(rent.rent)}</td>
                      </tr>
                    ))}
                    {selectedAdditionalFees.map((fee, feeIndex) => (
                      <tr
                        key={fee.id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {fee.feeTitle}
                        </th>

                        <td className="px-6 py-4">
                          {formatPrice(fee.feeAmount)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Transaction fee
                      </th>

                      <td className="px-6 py-4">
                        {formatPrice(transactionFee)}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="font-semibold text-gray-900 dark:text-white">
                      <th scope="row" className="px-6 py-3 text-base">
                        Total
                      </th>

                      <td className="px-6 py-3">
                        {formatPrice(
                          totalFeeMinusTransactionFee + transactionFee
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* <button
          onClick={handlePaidRents}
          className="flex flex-wrap items-center justify-center py-3 px-4 w-full text-base text-white font-medium bg-green-500 hover:bg-green-600 rounded-md shadow-button my-3"
        >
          Pay
        </button> */}
              <PaystackButton
                className="flex flex-wrap items-center justify-center py-3 px-4 w-full text-base text-white font-medium bg-green-500 hover:bg-green-600 rounded-md shadow-button my-3"
                {...componentProps}
              />
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
}
