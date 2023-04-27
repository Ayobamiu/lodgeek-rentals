import React, { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { PayStackBank } from "../../models";
import { useNavigate } from "react-router-dom";
import formatPrice from "../../utils/formatPrice";
import { toast } from "react-toastify";
import axios from "axios";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../app/features/userSlice";
import useBanks from "../../hooks/useBanks";
import DashboardWrapper from "../../components/dashboard/DashboardWrapper";
import { selectSelectedCompany } from "../../app/features/companySlice";
import LostPage from "../../components/shared/LostPage";

export default function Wallet() {
  const loggedInUser = useAppSelector(selectUser);
  const selectedCompany = useAppSelector(selectSelectedCompany);
  const navigate = useNavigate();
  const { processWithdrawal, processingWithdrawal } = useBanks();

  const [banks, setBanks] = useState<PayStackBank[]>([]);
  const [bankCode, setBankCode] = useState("");
  const [amount, setAmount] = useState(0);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [verifyingAccount, setVerifyingAccount] = useState(false);

  async function createTransferRecipient(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (amount > (loggedInUser?.balance || 0)) {
      return toast("Your balance is not enough to fulfil this request", {
        type: "warning",
      });
    }
    processWithdrawal({
      accountName,
      accountNumber,
      amount: amount,
      bankCode,
      type: "fromUserAccountToAccountNumber",
      senderUserEmail: loggedInUser?.email,
    });
  }

  function gotoProperties() {
    navigate(`/dashboard/${selectedCompany?.id}/properties`);
  }

  useEffect(() => {
    verifyBank();
  }, [accountNumber, bankCode]);

  async function verifyBank() {
    if (accountNumber.length === 10 && typeof bankCode === "string") {
      setVerifyingAccount(true);
      await axios
        .get(
          `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_SECRET_KEY}`,
            },
          }
        )
        .then((res) => {
          setAccountName(res.data.data.account_name);
        })
        .catch(() => {
          toast("Could not verify bank account.", { type: "error" });
        })
        .finally(() => {
          setVerifyingAccount(false);
        });
    }
  }

  async function getBanks(): Promise<void> {
    await axios
      .get("https://api.paystack.co/bank?country=nigeria")
      .then((res) => {
        setBanks(res.data.data as PayStackBank[]);
      });
  }

  useEffect(() => {
    getBanks();
  }, []);

  const ownerAccess = loggedInUser?.email === selectedCompany?.primaryOwner;
  if (!ownerAccess) return <LostPage />;
  return (
    <DashboardWrapper>
      <div>
        <section className="bg-white py-4">
          <div className="container px-4 mx-auto">
            <form
              onSubmit={createTransferRecipient}
              onReset={gotoProperties}
              className="p-6 h-full  bg-white rounded-md"
              id="addPropertyForm"
            >
              <div className="pb-6 border-b border-coolGray-100">
                <div className="flex flex-wrap items-center justify-between -m-2">
                  {/* <div className="w-full md:w-auto p-2">
                    <small>Available Balance</small>
                    <h2 className="text-coolGray-900 text-lg font-semibold">
                      {formatPrice(loggedInUser?.balance || 0)}
                    </h2>
                  </div> */}
                  {/* <div className="w-full md:w-auto p-2">
                    <div className="flex flex-wrap justify-between -m-1.5">
                      <div className="w-full md:w-auto p-1.5">
                        <button
                          type="submit"
                          className="flex flex-wrap justify-center w-full px-4 py-2 bg-green-500 hover:bg-green-600 font-medium text-sm text-white border border-green-500 rounded-md shadow-button"
                          disabled={processingWithdrawal}
                        >
                          <p>Withdraw</p>
                          {processingWithdrawal && (
                            <svg
                              className="animate-spin h-5 w-5 mr-3 rounded-full border-t-2 border-r-2 border-white ml-2"
                              viewBox="0 0 24 24"
                            ></svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
              <div className="py-6 border-b border-coolGray-100">
                <div className="w-full md:w-9/12">
                  <div className="flex flex-wrap -m-3">
                    <div className="w-full md:w-1/3 p-3">
                      <p className="text-sm text-coolGray-800 font-semibold">
                        Amount
                      </p>
                    </div>
                    <div className="w-full md:flex-1 p-3">
                      <CurrencyInput
                        id="Amount"
                        name="input-name"
                        placeholder="₦ 500,000.00"
                        decimalsLimit={2}
                        onValueChange={(value) => {
                          setAmount(Number(value));
                        }}
                        defaultValue={amount}
                        required
                        prefix="₦ "
                        disabled={processingWithdrawal}
                        className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-6 border-b border-coolGray-100">
                <div className="w-full md:w-9/12">
                  <div className="flex flex-wrap -m-3">
                    <div className="w-full md:w-1/3 p-3">
                      <p className="text-sm text-coolGray-800 font-semibold">
                        Bank
                      </p>
                    </div>
                    <div className="w-full md:flex-1 p-3">
                      <select
                        required
                        className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                        placeholder="Doe"
                        defaultValue={bankCode}
                        onChange={(e) => {
                          setAccountName("");
                          setBankCode(e.currentTarget.value);
                        }}
                        disabled={processingWithdrawal}
                      >
                        <option value="">-</option>
                        {banks.map((i, bankIndex) => (
                          <option key={bankIndex} value={i.code}>
                            {i.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-6 border-b border-coolGray-100">
                <div className="w-full md:w-9/12">
                  <div className="flex flex-wrap -m-3">
                    <div className="w-full md:w-1/3 p-3">
                      <p className="text-sm text-coolGray-800 font-semibold flex">
                        Account Number{" "}
                        {verifyingAccount && (
                          <svg
                            className="animate-spin h-5 w-5 mr-3 rounded-full border-t-2 border-r-2 border-green-500 ml-2"
                            viewBox="0 0 24 24"
                          ></svg>
                        )}
                      </p>
                    </div>
                    <div className="w-full md:flex-1 p-3 relative">
                      <input
                        required
                        className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                        placeholder="0000000000"
                        onChange={(e) => {
                          setAccountName("");
                          setAccountNumber(e.target.value);
                        }}
                        defaultValue={accountNumber}
                        maxLength={10}
                        disabled={verifyingAccount || processingWithdrawal}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-6 border-b border-coolGray-100">
                <div className="w-full md:w-9/12">
                  <div className="flex flex-wrap -m-3">
                    <div className="w-full md:w-1/3 p-3">
                      <p className="text-sm text-coolGray-800 font-semibold">
                        Account Name
                      </p>
                    </div>
                    <div className="w-full md:flex-1 p-3 relative">
                      <input
                        required
                        className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                        type="text"
                        placeholder="John Doe"
                        onChange={(e) => setAccountName(e.target.value)}
                        defaultValue={accountName}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>
    </DashboardWrapper>
  );
}
