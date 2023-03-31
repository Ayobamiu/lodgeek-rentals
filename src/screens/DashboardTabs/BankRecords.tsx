import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import formatPrice from "../../utils/formatPrice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUser, updateUser } from "../../app/features/userSlice";
import BankRecordItem from "../../components/shared/BankRecordItem";
import { selectBankRecords } from "../../app/features/bankRecordSlice";
import { AddBankRecordModal } from "../../components/banks/AddBankRecordModal";
import useQuery from "../../hooks/useQuery";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { FirebaseCollections, User } from "../../models";
import { toast } from "react-toastify";
import ActivityIndicator from "../../components/shared/ActivityIndicator";
import useAuth from "../../hooks/useAuth";
import DashboardWrapper from "../../components/dashboard/DashboardWrapper";

export default function BankRecords() {
  const [openAddRecordModal, setOpenAddRecordModal] = useState(false);
  let query = useQuery();
  const dispatch = useAppDispatch();
  const redirectToAddRentalRecords = query.get("redirect");
  const loggedInUser = useAppSelector(selectUser);
  const bankRecords = useAppSelector(selectBankRecords);
  const [updatingDirectRemittance, setUpdatingDirectRemittance] =
    useState(false);
  const { updateDefaultRemittanceAccount } = useAuth();
  useEffect(() => {
    if (!loggedInUser?.remittanceAccount && bankRecords.length > 0) {
      const firstRecord = bankRecords[0];
      updateDefaultRemittanceAccount(firstRecord.id);
    }
  }, [loggedInUser, bankRecords]);

  const updateDirectRemittance = async (activate: boolean) => {
    const ownerRef = doc(
      db,
      FirebaseCollections.users,
      loggedInUser?.email || ""
    );
    setUpdatingDirectRemittance(true);
    const docSnap = await getDoc(ownerRef);
    if (docSnap.exists()) {
      const ownerDoc = docSnap.data() as User;
      const updatedUser: User = {
        ...ownerDoc,
        directRemitance: activate,
      };
      await updateDoc(ownerRef, updatedUser)
        .then((c) => {
          dispatch(updateUser(updatedUser));
          toast("Direct remittance updated", { type: "success" });
        })
        .finally(() => {
          setUpdatingDirectRemittance(false);
        });
    } else {
      setUpdatingDirectRemittance(false);
    }
  };

  return (
    <DashboardWrapper>
      <div>
        <AddBankRecordModal
          openModal={openAddRecordModal}
          setOpenModal={setOpenAddRecordModal}
        />
        <section className="bg-white py-4">
          <div className="container px-4 mx-auto">
            <div
              className="p-6 h-full  bg-white rounded-md"
              id="addPropertyForm"
            >
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
                      {!bankRecords.length ? (
                        <div className="w-full md:w-auto p-1.5">
                          <button
                            className="flex flex-wrap justify-center w-full px-4 py-2 bg-green-500 hover:bg-green-600 font-medium text-sm text-white border border-green-500 rounded-md shadow-button"
                            onClick={() => {
                              setOpenAddRecordModal(true);
                            }}
                          >
                            <p>Add Bank Record</p>
                          </button>
                        </div>
                      ) : (
                        <Link
                          to="/dashboard/withdraw"
                          className="w-full md:w-auto p-1.5"
                        >
                          <button className="flex flex-wrap justify-center w-full px-4 py-2 bg-green-500 hover:bg-green-600 font-medium text-sm text-white border border-green-500 rounded-md shadow-button">
                            <p>Withdraw</p>
                          </button>
                        </Link>
                      )}
                      {redirectToAddRentalRecords === "addRentalRecords" && (
                        <Link
                          to="/dashboard/rentalRecords/new"
                          className="w-full md:w-auto p-1.5"
                        >
                          <button
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
                  <div className="mb-5 flex justify-between flex-wrap">
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
              <section className="bg-coolGray-50 py-4">
                <div className="container px-4 mx-auto">
                  <div className="mb-5 flex justify-between flex-wrap">
                    <small>Account Settings</small>
                  </div>
                  <div className="p-6 mx-auto bg-white border border-coolGray-100 rounded-md shadow-dashboard">
                    <div className="flex flex-wrap -m-2">
                      <label
                        htmlFor="directRemitance"
                        className="w-full p-2 flex justify-between"
                      >
                        <h3 className="mb-1 font-medium text-lg text-coolGray-900 flex">
                          Activate Direct Remittance
                          {updatingDirectRemittance && (
                            <ActivityIndicator color="black" />
                          )}
                        </h3>
                        <input
                          type="checkbox"
                          name="directRemitance"
                          id="directRemitance"
                          defaultChecked={loggedInUser?.directRemitance}
                          disabled={updatingDirectRemittance}
                          className="h-5 w-5 accent-green-500"
                          onChange={(e) => {
                            const checked = e.target.checked;
                            updateDirectRemittance(checked);
                          }}
                        />
                      </label>
                    </div>
                    <p className="text-xs font-medium text-coolGray-500 my-2">
                      After receiving rent payments on Lodgeek, you can choose
                      to either receive direct remittance to your bank account
                      or use the withdraw button on your wallet page to transfer
                      the funds to your account. Please note that both processes
                      attract transfer charges as follows: Transfers of NGN
                      5,000 and below - NGN 10 per transfer, Transfers between
                      NGN 5,001 and NGN 50,000 - NGN 25 per transfer, Transfers
                      above NGN 50,000 - NGN 50 per transfer. Please select your
                      preferred option and follow the necessary steps to
                      complete the transfer. If you need any assistance, please
                      don't hesitate to contact our support team.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </DashboardWrapper>
  );
}
