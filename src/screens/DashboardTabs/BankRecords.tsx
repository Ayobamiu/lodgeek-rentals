import React, { useState } from "react";
import { Link } from "react-router-dom";
import formatPrice from "../../utils/formatPrice";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../app/features/userSlice";
import BankRecordItem from "../../components/shared/BankRecordItem";
import { selectBankRecords } from "../../app/features/bankRecordSlice";
import useBanks from "../../hooks/useBanks";
import { AddBankRecordModal } from "../../components/banks/AddBankRecordModal";
import useQuery from "../../hooks/useQuery";

export default function BankRecords() {
  const [openAddRecordModal, setOpenAddRecordModal] = useState(false);
  let query = useQuery();
  const redirectToAddRentalRecords = query.get("redirect");
  const loggedInUser = useAppSelector(selectUser);
  const bankRecords = useAppSelector(selectBankRecords);
  const { addBank } = useBanks();

  return (
    <div>
      <AddBankRecordModal
        openModal={openAddRecordModal}
        setOpenModal={setOpenAddRecordModal}
        addBank={addBank}
      />
      <section className="bg-white py-4">
        <div className="container px-4 mx-auto">
          <div className="p-6 h-full  bg-white rounded-md" id="addPropertyForm">
            <div className="pb-6 border-b border-coolGray-100">
              <div className="flex flex-wrap items-center justify-between -m-2">
                <div className="w-full md:w-auto p-2">
                  <small>Available Balance</small>
                  <h2 className="text-coolGray-900 text-lg font-semibold">
                    {formatPrice(loggedInUser?.balance || 0)}
                  </h2>
                </div>
                <div className="w-full md:w-auto p-2">
                  <div className="flex flex-wrap justify-between -m-1.5">
                    {!bankRecords.length && (
                      <div className="w-full md:w-auto p-1.5">
                        <button
                          type="submit"
                          className="flex flex-wrap justify-center w-full px-4 py-2 bg-green-500 hover:bg-green-600 font-medium text-sm text-white border border-green-500 rounded-md shadow-button"
                          onClick={() => {
                            setOpenAddRecordModal(true);
                          }}
                        >
                          <p>Add Bank Record</p>
                        </button>
                      </div>
                    )}
                    {redirectToAddRentalRecords === "addRentalRecords" && (
                      <Link
                        to="/dashboard?tab=addRentalRecords"
                        className="w-full md:w-auto p-1.5"
                      >
                        <button
                          type="submit"
                          className="flex flex-wrap justify-center w-full px-4 py-2  font-medium text-sm text-green-500 border border-green-500 rounded-md shadow-button"
                          onClick={() => {
                            setOpenAddRecordModal(true);
                          }}
                        >
                          <p>Back to Rental Records</p>
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <section className="bg-coolGray-50 py-4">
              <div className="container px-4 mx-auto">
                <div className="mb-5">
                  <small>Your preferred bank account</small>
                </div>
                <div className="p-6 mx-auto bg-white border border-coolGray-100 rounded-md shadow-dashboard">
                  <div className="flex flex-wrap -m-2">
                    {bankRecords.map((rentalRecord, index) => (
                      <BankRecordItem
                        bankRecordData={rentalRecord}
                        key={index}
                      />
                    ))}
                    {!bankRecords.length && (
                      <div className="flex justify-center text-lg font-medium text-coolGray-500 mb-2 w-full">
                        No bank records
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
          <p className="text-xs font-medium text-coolGray-500 lg:text-center text-justify my-2">
            Funds deposited into your account will be transferred to your
            preferred bank account by the end of the day.
          </p>
        </div>
      </section>
    </div>
  );
}
