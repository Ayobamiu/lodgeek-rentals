import { Transition } from "@headlessui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { selectUser } from "../../app/features/userSlice";
import { useAppSelector } from "../../app/hooks";
import { generateFirebaseId } from "../../firebase/config";
import { BankRecord, FirebaseCollections, PayStackBank } from "../../models";
import ActivityIndicator from "../shared/ActivityIndicator";

type AddBankRecordProps = {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  addBank: (data: BankRecord) => Promise<void>;
};

export function AddBankRecordModal(props: AddBankRecordProps) {
  const { openModal, setOpenModal, addBank } = props;
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [verifyingAccount, setVerifyingAccount] = useState(false);
  const [banks, setBanks] = useState<PayStackBank[]>([]);
  const [bank, setBank] = useState<PayStackBank>();
  const loggedInUser = useAppSelector(selectUser);

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
        .catch((error) => {
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
  const [addingBankRecord, setAddingBankRecord] = useState(false);
  async function handleAddNewRecord(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!loggedInUser) {
      return toast("Can't resole logged in user", { type: "error" });
    }
    if (!bank) {
      return toast("Select a bank.", { type: "error" });
    }
    if (!accountName) {
      return toast("Account not verified.", { type: "error" });
    }

    const data: BankRecord = {
      accountName,
      accountNumber,
      bank,
      bankName: bank?.name,
      createdAt: Date.now(),
      id: generateFirebaseId(FirebaseCollections.bankReord),
      updatedAt: Date.now(),
      user: loggedInUser?.email,
    };
    setAddingBankRecord(true);
    await addBank(data)
      .finally(() => {
        setAddingBankRecord(false);
      })
      .then(() => {
        setOpenModal(false);
      });
  }

  return (
    <Transition
      show={openModal}
      enter="transition-opacity duration-150"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <form
        onSubmit={handleAddNewRecord}
        onReset={() => {
          setOpenModal(false);
        }}
        id="addPropertyForm"
        className="bg-white fixed h-screen w-screen top-0 left-0 z-50 overflow-scroll "
      >
        <div className="h-20 w-full border-b flex justify-between items-center p-3">
          <h1 className="lg:text-3xl text-2xl">New Bank Record</h1>
          <div className="flex ml-auto item-center gap-x-5">
            <button
              className="text-red-500"
              onClick={() => {
                setOpenModal(false);
              }}
            >
              Close
            </button>
            <button className="text-green-500 flex" type="submit">
              Add {addingBankRecord && <ActivityIndicator color="green-500" />}
            </button>
          </div>
        </div>

        <div className="">
          <section className="bg-white py-4 lg:m-5 m-0 lg:mx-auto mx-auto">
            <div className="container px-4 mx-auto">
              <div className="p-6 h-full  bg-white rounded-md">
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
                            setBankCode(e.currentTarget.value);
                            const targetBank = banks.find(
                              (i) => i.code === e.currentTarget.value
                            );
                            setBank(targetBank);
                          }}
                          disabled={verifyingAccount || addingBankRecord}
                        >
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
                          disabled={verifyingAccount || addingBankRecord}
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
              </div>
            </div>
          </section>
        </div>
      </form>
    </Transition>
  );
}
