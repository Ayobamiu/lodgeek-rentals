import React, { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { toast } from "react-toastify";
import Header from "../../assets/flex-ui-assets/images/headers/header.jpg";
import {
  AdditionalFee,
  Rent,
  RentStatus,
  RentType,
  rentReviewFrequencyType,
} from "../../models";
import { useNavigate } from "react-router-dom";
import { selectProperties } from "../../app/features/propertySlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  resetNewRentalRecord,
  selectNewRentalRecord,
  updateNewRentalRecord,
} from "../../app/features/rentalRecordSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExternalLink,
  faFolderOpen,
  faPlus,
  faTimesCircle,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import formatPrice from "../../utils/formatPrice";
import useRentalRecords from "../../hooks/useRentalRecords";
import DetailsBox from "../../components/shared/DetailsBox";
import { selectUser } from "../../app/features/userSlice";
import AdditionalfeeForm from "../../components/shared/AdditionalfeeForm";
import { selectBankRecords } from "../../app/features/bankRecordSlice";
import { AddBankRecordModal } from "../../components/banks/AddBankRecordModal";
import DashboardWrapper from "../../components/dashboard/DashboardWrapper";
import { selectSelectedCompany } from "../../app/features/companySlice";
import { UploadPhotoAsync } from "../../firebase/storage_upload_blob";
import ActivityIndicator from "../../components/shared/ActivityIndicator";
import InputSelect from "../../components/shared/input/InputSelect";
import { rentReviewOptions } from "../../utils/prodData";
// import { TextEncoder } from "util";
// import TextEditor from "../../components/lib/rental/TextEditor";

export default function AddRentalRecords() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [stage, setStage] = useState<"one" | "two">("one");
  const [showRentStarts, setShowRentStarts] = useState(false);
  const openRentStarts = () => {
    setShowRentStarts(true);
  };
  const closeRentStarts = () => {
    setShowRentStarts(false);
  };

  const { addingRentalRecord, handleAddRentalRecord } = useRentalRecords();
  const properties = useAppSelector(selectProperties);
  const newRentalRecord = useAppSelector(selectNewRentalRecord);

  const loggedInUser = useAppSelector(selectUser);
  const selectedCompany = useAppSelector(selectSelectedCompany);
  // Rental Agreement state
  const [file, setFile] = useState<any>(null);

  const [uploadingTenancy, setUploadingTenancy] = useState(false);

  const handleUploadTenancy = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.length) {
      const fileUploaded = e.target.files[0];
      setUploadingTenancy(true);
      const url = await UploadPhotoAsync(
        `/rentdocs/${Date.now()}-${fileUploaded.name}`,
        fileUploaded
      )
        .finally(() => {
          setUploadingTenancy(false);
        })
        .catch(() => {
          toast.error("Error uploading file.");
        });

      if (url) {
        dispatch(updateNewRentalRecord({ tenancyAgreementFile: url }));
      }
    }
  };

  const chooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files && e.target.files[0]?.type !== "application/pdf") {
      toast.warn("Only PDF files are allowed");
      setFile(null);
    }
  };

  const submitStageOne = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newRentalRecord.property) {
      return toast.error("Select a property");
    }
    setStage("two");
  };

  function gotoRentalRecords() {
    dispatch(resetNewRentalRecord());
    navigate(`/dashboard/${selectedCompany?.id}/rentalRecords`);
  }

  const goBack = () => {
    if (stage === "one") {
      gotoRentalRecords();
    } else {
      setStage("one");
      dispatch(updateNewRentalRecord({ property: "" }));
    }
  };

  const handleOnSelect = (item: any) => {
    dispatch(
      updateNewRentalRecord({
        property: item.id,
        rent: item.rent,
        rentPer: item.rentPer,
      })
    );
  };

  const formatResult = (item: any) => {
    return (
      <div className="flex gap-x-3 items-center">
        <img className="rounded-7xl h-10 w-10" src={Header} alt=""></img>
        <span style={{ display: "block", textAlign: "left" }}>
          {item.title}
        </span>
      </div>
    );
  };

  const [rents, setRents] = useState<Rent[]>([]);

  useEffect(() => {
    let r: Rent[] = [
      {
        dueDate: newRentalRecord.rentStarts,
        id: "",
        property: newRentalRecord.property,
        rent: newRentalRecord.rent,
        rentPer: newRentalRecord.rentPer,
        rentalRecord: "",
        status: RentStatus["Upcoming - Rent is not due for payment."],
        owner: loggedInUser?.email || "",
        tenant: newRentalRecord.tenant,
        paidOn: -1,
        company: selectedCompany?.id || "",
      },
    ];
    for (let index = 1; index < 5; index++) {
      r.push({
        dueDate: moment(newRentalRecord.rentStarts)
          .add(index, newRentalRecord.rentPer)
          .toDate()
          .getTime(),
        id: "",
        property: newRentalRecord.property,
        rent: newRentalRecord.rent,
        rentPer: newRentalRecord.rentPer,
        rentalRecord: "",
        status: RentStatus["Upcoming - Rent is not due for payment."],
        owner: loggedInUser?.email || "",
        tenant: newRentalRecord.tenant,
        paidOn: -1,
        company: selectedCompany?.id || "",
      });
    }
    setRents(r);
  }, [
    newRentalRecord.rentPer,
    newRentalRecord.rentStarts,
    newRentalRecord.property,
    newRentalRecord.rent,
  ]);

  const removeLastRent = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation();
    const currentRents = [...rents];
    currentRents.pop();
    setRents(currentRents);
  };

  const toggleRent = (index: number, rent: Rent) => {
    const currentRents = [...rents];
    currentRents.splice(index, 1, rent);
    setRents(currentRents);
  };

  const addAnotherRent = () => {
    const currentRents = [...rents];
    currentRents.push({
      dueDate: moment(newRentalRecord.rentStarts)
        .add(rents.length, newRentalRecord.rentPer)
        .toDate()
        .getTime(),
      id: "",
      property: newRentalRecord.property,
      rent: newRentalRecord.rent,
      rentPer: newRentalRecord.rentPer,
      rentalRecord: "",
      status: RentStatus["Upcoming - Rent is not due for payment."],
      owner: loggedInUser?.email || "",
      tenant: newRentalRecord.tenant,
      paidOn: -1,
      company: selectedCompany?.id || "",
    });
    setRents(currentRents);
  };

  useEffect(() => {
    if (selectedCompany?.remittanceAccount) {
      dispatch(
        updateNewRentalRecord({
          remittanceAccount: selectedCompany?.remittanceAccount,
        })
      );
    }
  }, [selectedCompany?.remittanceAccount]);

  const addRentalRecord = async () => {
    await handleAddRentalRecord(newRentalRecord, rents).then(gotoRentalRecords);
  };
  const property = properties.find((i) => i.id === newRentalRecord.property);
  const bankRecords = useAppSelector(selectBankRecords);
  const [openAddRecordModal, setOpenAddRecordModal] = useState(false);

  return (
    <DashboardWrapper>
      <div>
        {stage === "one" && (
          <section className="bg-white py-4">
            <div className="container px-4 mx-auto">
              <form
                onSubmit={submitStageOne}
                onReset={goBack}
                className="p-6 h-full  bg-white rounded-md"
              >
                <div className="pb-6 border-b border-coolGray-100">
                  <div className="flex flex-wrap items-center justify-between -m-2">
                    <div className="w-full md:w-auto p-2">
                      <h2 className="text-coolGray-900 text-lg font-semibold">
                        Add Rental Record  1/2
                      </h2>
                    </div>
                    <div className="w-full md:w-auto p-2">
                      <div className="flex flex-wrap justify-between -m-1.5">
                        <div className="w-full md:w-auto p-1.5">
                          <button
                            type="reset"
                            className="flex flex-wrap justify-center w-full px-4 py-2 font-medium text-sm text-coolGray-500 hover:text-coolGray-600 border border-coolGray-200 hover:border-coolGray-300 bg-white rounded-md shadow-button"
                          >
                            <p>Cancel</p>
                          </button>
                        </div>
                        <div className="w-full md:w-auto p-1.5">
                          <button
                            type="submit"
                            className="flex flex-wrap justify-center w-full px-4 py-2 bg-green-500 hover:bg-green-600 font-medium text-sm text-white border border-green-500 rounded-md shadow-button"
                          >
                            <p>Proceed</p>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="py-6 border-b border-coolGray-100">
                  <div className="w-full md:w-9/12">
                    <div className="flex flex-wrap -m-3">
                      <div className="w-full md:w-1/3 p-3">
                        <p className="text-sm text-coolGray-800 font-semibold">
                          Property
                        </p>
                      </div>
                      <div className="w-full md:flex-1 p-3 grid grid-cols-4 gap-3">
                        <div className="col-span-3 text-base text-coolGray-900 font-normal outline-none focus:border-green-500   rounded-lg shadow-input">
                          <ReactSearchAutocomplete
                            items={properties.map((item, index) => {
                              return { ...item, name: item.title };
                            })}
                            maxResults={4}
                            showNoResults
                            onSelect={handleOnSelect}
                            formatResult={formatResult}
                            styling={{ borderRadius: "8px" }}
                            showIcon={false}
                            placeholder="Property A"
                            showClear
                            onClear={() => {
                              dispatch(updateNewRentalRecord({ property: "" }));
                            }}
                          />
                        </div>
                        <input
                          required
                          className="col-span-1 px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                          type="text"
                          placeholder="Unit No"
                          id="unitNo"
                          defaultValue={newRentalRecord.unitNo}
                          onChange={(e) =>
                            dispatch(
                              updateNewRentalRecord({ unitNo: e.target.value })
                            )
                          }
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
                          Rent
                        </p>
                      </div>
                      <div className="w-full md:w-1/3 p-3 flex items-center ">
                        <CurrencyInput
                          id="input-example"
                          name="input-name"
                          placeholder="₦ 500,000.00"
                          decimalsLimit={2}
                          onValueChange={(value, name) => {
                            dispatch(
                              updateNewRentalRecord({
                                rent: Number(value) > 0 ? Number(value) : 0,
                              })
                            );
                          }}
                          value={newRentalRecord.rent}
                          required
                          prefix="₦ "
                          className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                        />
                      </div>
                      <div className="w-full md:w-1/3 p-3 flex">
                        <select
                          required
                          className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                          placeholder="Doe"
                          value={newRentalRecord.rentPer}
                          onChange={(e) =>
                            dispatch(
                              updateNewRentalRecord({
                                rentPer: e.target.value as RentType,
                              })
                            )
                          }
                        >
                          <option value="month">per month</option>
                          <option value="year">per year</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Rent review frequency */}
                <div className="py-6 border-b border-coolGray-100">
                  <div className="w-full md:w-9/12">
                    <div className="flex flex-wrap -m-3">
                      <div className="w-full md:w-1/3 p-3">
                        <p className="text-sm text-coolGray-800 font-semibold">
                          Rent Review Frequency
                        </p>
                      </div>
                      <div className="w-full md:flex-1 p-3">
                        <select
                          required
                          className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                          placeholder="Doe"
                          value={newRentalRecord.rentReviewFrequency}
                          onChange={(e) =>
                            dispatch(
                              updateNewRentalRecord({
                                rentReviewFrequency: e.target
                                  .value as rentReviewFrequencyType,
                              })
                            )
                          }
                        >
                          {rentReviewOptions.map((record, index) => (
                            <option key={index} value={record.slug}>
                              {record.type}
                            </option>
                          ))}
                        </select>
                        <small className="text-coolGray-400">
                          This determines the time interval at which tenant
                          rents is reviewed
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End of rent review frequency */}
                <div className="py-6 border-b border-coolGray-100">
                  <div className="w-full md:w-9/12">
                    <div className="flex flex-wrap -m-3">
                      <div className="w-full md:w-1/3 p-3">
                        <p className="text-sm text-coolGray-800 font-semibold">
                          Tenant's Email
                        </p>
                      </div>
                      <div className="w-full md:flex-1 p-3">
                        <input
                          required
                          className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                          type="text"
                          placeholder="johndoe@flex.co"
                          id="tenantEmail"
                          defaultValue={newRentalRecord.tenant}
                          onChange={(e) =>
                            dispatch(
                              updateNewRentalRecord({ tenant: e.target.value })
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Remittance Account */}
                <div className="py-6 border-b border-coolGray-100">
                  <div className="w-full md:w-9/12">
                    <div className="flex flex-wrap -m-3">
                      <div className="w-full md:w-1/3 p-3">
                        <p className="text-sm text-coolGray-800 font-semibold">
                          Remittance account
                        </p>
                      </div>
                      <div className="w-full md:flex-1 p-3">
                        <select
                          required
                          className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                          placeholder="Doe"
                          value={newRentalRecord.remittanceAccount}
                          defaultValue={selectedCompany?.remittanceAccount}
                          onChange={(e) =>
                            dispatch(
                              updateNewRentalRecord({
                                remittanceAccount: e.target.value,
                              })
                            )
                          }
                        >
                          {bankRecords.map((record, index) => (
                            <option key={record.id} value={record.id}>
                              {record.accountNumber} - {record.bankName} -{" "}
                              {record.accountName}{" "}
                              {selectedCompany?.remittanceAccount ===
                                record.id && "(default account)"}
                            </option>
                          ))}
                        </select>
                        <div
                          className="text-green-500 underline cursor-pointer"
                          onClick={() => {
                            setOpenAddRecordModal(true);
                          }}
                        >
                          Add new account
                        </div>
                        <small className="text-coolGray-400">
                          Payments for this property will be remitted to this
                          account.
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Rent Instructions */}
                <div className="py-6 border-b border-coolGray-100">
                  <div className="w-full md:w-9/12">
                    <div className="flex flex-wrap -m-3">
                      <div className="w-full md:w-1/3 p-3">
                        <p className="text-sm text-coolGray-800 font-semibold">
                          Tenancy agreement
                        </p>
                      </div>
                      <div className="w-full md:flex-1 p-3">
                        {/* Upload options */}

                        <>
                          <label
                            className=" mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            htmlFor="file_input"
                          >
                            {newRentalRecord.tenancyAgreementFile ? (
                              <small className="text-grey-500 underline underline-offset-4">
                                Change file{" "}
                                <FontAwesomeIcon icon={faFolderOpen} />
                              </small>
                            ) : (
                              <div className=" flex gap-x-3 items-center">
                                Choose file{" "}
                                {newRentalRecord.tenancyAgreementFile && (
                                  <FontAwesomeIcon
                                    icon={faCheckCircle}
                                    className="text-green-500"
                                  />
                                )}
                                {uploadingTenancy && (
                                  <ActivityIndicator size="4" />
                                )}
                              </div>
                            )}
                          </label>
                          <input
                            accept="application/pdf"
                            className={`block ${
                              newRentalRecord.tenancyAgreementFile
                                ? "w-0 h-0"
                                : "w-full"
                            } text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400`}
                            aria-describedby="file_input_help"
                            id="file_input"
                            type="file"
                            // value={file?.name}
                            onChange={handleUploadTenancy}
                          />
                          {newRentalRecord.tenancyAgreementFile && (
                            <div className="mb-3">
                              <div className="flex items-center">
                                <small className="flex items-center gap-x-3">
                                  <a
                                    href={newRentalRecord.tenancyAgreementFile}
                                    className="text-blue-500 underline underline-offset-4"
                                    target="_blank"
                                  >
                                    Lease Agreement{" "}
                                    <FontAwesomeIcon icon={faExternalLink} />
                                  </a>
                                  <FontAwesomeIcon
                                    icon={faTrashAlt}
                                    title="Delete Lease Agreement file"
                                    className="text-red-500 cursor-pointer"
                                    onClick={() => {
                                      dispatch(
                                        updateNewRentalRecord({
                                          tenancyAgreementFile: "",
                                        })
                                      );
                                    }}
                                  />
                                </small>
                              </div>
                            </div>
                          )}
                          <p
                            className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                            id="file_input_help"
                          >
                            Only PDF file is allowed.
                          </p>
                        </>

                        {/* <div className="flex flex-row items-center">
                          <hr className="h-px my-8 bg-gray-300 border-0 w-[48%]" />
                          <p className="text-sm font-semibold text-gray-400 px-5">
                            OR
                          </p>
                          <hr className="h-px my-8 bg-gray-300 border-0 w-[48%]" />
                        </div>

                        <div className="w-full mt-5">
                          <TextEditor />
                        </div> */}

                        {/* <small className="text-coolGray-400">
                          Write some instructions you want the tenants to
                          understand and or agree to.
                        </small> */}
                      </div>
                    </div>
                  </div>
                </div>
                {/* End of rent instructions */}
              </form>
            </div>
          </section>
        )}
        {stage === "two" && (
          <section className="bg-white p-8 pt-7 pb-6 container mx-auto">
            <div className="flex flex-wrap items-center justify-between pb-5 -mx-2">
              <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
                <DetailsBox
                  label="Property "
                  value={`${property?.title} - ${formatPrice(
                    newRentalRecord?.rent || 0
                  )}/${newRentalRecord?.rentPer}`}
                />
              </div>
              <div className="w-full md:w-1/2 px-2">
                <div className="flex flex-wrap justify-end -m-2">
                  <div className="w-full md:w-auto p-2">
                    <button
                      disabled={addingRentalRecord}
                      onClick={goBack}
                      className="w-full px-4 py-2 text-sm text-coolGray-500 font-medium bg-white border border-coolGray-200 hover:border-coolGray-300 rounded-md shadow-button"
                    >
                      Back
                    </button>
                  </div>
                  <div className="w-full md:w-auto p-2">
                    <button
                      disabled={addingRentalRecord}
                      onClick={addRentalRecord}
                      className="w-full px-4 py-2 text-sm text-white font-medium bg-green-500 hover:bg-green-600 border border-green-600 rounded-md shadow-button flex items-center justify-center"
                    >
                      Send Invite
                      {addingRentalRecord && (
                        <svg
                          className="animate-spin h-5 w-5 mr-3 rounded-full border-t-2 border-r-2 border-white ml-2"
                          viewBox="0 0 24 24"
                        ></svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-b border-coolGray-500 mb-10">
              <h1 className="text-3xl">Rents</h1>
              <p className="text-xs font-medium text-coolGray-500 flex gap-2 items-center mb-5 flex-wrap">
                List of Upcoming Rents starting on{" "}
                {moment(newRentalRecord.rentStarts).format("MMM YYYY")}{" "}
                {!showRentStarts && (
                  <button
                    disabled={addingRentalRecord}
                    onClick={openRentStarts}
                    className="bg-gray-300 px-2 rounded py-1"
                  >
                    Change
                  </button>
                )}
                {showRentStarts && (
                  <input
                    type="date"
                    name="rentStarts"
                    id="rentStarts"
                    defaultValue={moment(newRentalRecord.rentStarts).format(
                      "YYYY-MM-DD"
                    )}
                    onBlur={closeRentStarts}
                    onChange={(e) => {
                      dispatch(
                        updateNewRentalRecord({
                          rentStarts: e.target.valueAsNumber,
                        })
                      );
                    }}
                    className="px-2  text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                  />
                )}
              </p>
              <div className="flex gap-5 justify-start my-5 flex-wrap">
                {rents.map((rent, index) => (
                  <button
                    key={index}
                    disabled={addingRentalRecord}
                    className="flex flex-col items-center bg-gray-300 p-3 gap-3 rounded-xl min-w-[70px] relative"
                    onClick={() => {
                      if (
                        rent.status === RentStatus["Paid - Rent has been paid."]
                      ) {
                        toggleRent(index, {
                          ...rent,
                          status:
                            RentStatus[
                              "Upcoming - Rent is not due for payment."
                            ],
                        });
                      } else {
                        toggleRent(index, {
                          ...rent,
                          status: RentStatus["Paid - Rent has been paid."],
                        });
                      }
                    }}
                  >
                    {index === rents.length - 1 && (
                      <FontAwesomeIcon
                        icon={faTimesCircle}
                        className="absolute -right-0.5 -top-0.5"
                        onClick={removeLastRent}
                      />
                    )}
                    {rent.status ===
                      RentStatus["Paid - Rent has been paid."] && (
                      <div className="px-1 text-xs bg-[green] text-white font-bold shadow-sm rounded absolute -bottom-2">
                        Paid
                      </div>
                    )}
                    <p
                      key={index}
                      className="text-xs font-medium text-coolGray-500"
                    >
                      {moment(rent.dueDate).format("MMM YYYY")}
                    </p>
                    <div className="flex">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        size={"2xl"}
                        color={
                          rent.status ===
                          RentStatus["Paid - Rent has been paid."]
                            ? "green"
                            : "black"
                        }
                      />
                    </div>
                  </button>
                ))}
                <button
                  disabled={addingRentalRecord}
                  className="flex items-center bg-gray-300 p-3 gap-3 rounded-xl min-w-[70px] justify-center"
                  onClick={addAnotherRent}
                >
                  <FontAwesomeIcon icon={faPlus} size={"2xl"} />
                </button>
              </div>
              <div className="my-5">
                <p className="text-xs font-medium text-coolGray-500">
                  Instructions:
                </p>
                <p className="text-xs font-medium text-coolGray-500 my-2">
                  Rents can be marked as paid by clicking on them{" "}
                  <FontAwesomeIcon icon={faCheckCircle} color="black" />. Rent
                  reminders will not be sent to tenants who have already paid
                  their rent.
                </p>
                <p className="text-xs font-medium text-coolGray-500 my-2">
                  Click plus button{" "}
                  <FontAwesomeIcon icon={faPlus} color="black" /> to add more
                  rents.
                </p>
                <p className="text-xs font-medium text-coolGray-500 my-2">
                  Click remove button{" "}
                  <FontAwesomeIcon icon={faTimesCircle} className="" /> to
                  remove rents.
                </p>
              </div>
            </div>
            <div className="border-b border-coolGray-500 mt-3 py-3 mb-10">
              <h1 className="text-3xl">Additional fees</h1>
              {newRentalRecord.fees.map((i, feeIndex) => (
                <div
                  key={feeIndex}
                  className="flex gap-2 items-center py-2 flex-wrap border-b"
                >
                  <p>{i.feeTitle}</p>
                  <p>{formatPrice(i.feeAmount)}</p>{" "}
                  {i.feeIsRequired ? (
                    <div
                      className="bg-green-500 text-white rounded px-2 text-xs"
                      title="Tenant must pay this fee."
                    >
                      Required
                    </div>
                  ) : (
                    <div
                      className="bg-gray-500 text-white rounded px-2 text-xs"
                      title="Tenants are not required to pay this fee."
                    >
                      Not required
                    </div>
                  )}
                  <button
                    type="button"
                    className="ml-auto w-full lg:w-auto px-4 py-2 text-sm text-white font-medium bg-red-500 hover:bg-red-600 border border-red-600 rounded-md shadow-button flex items-center justify-center"
                    onClick={() => {
                      const updatedFees: AdditionalFee[] = [
                        ...newRentalRecord.fees,
                      ].filter((x) => x.id !== i.id);
                      dispatch(updateNewRentalRecord({ fees: updatedFees }));
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
              {!newRentalRecord.fees.length && (
                <div className="mb-3">No Additional fees</div>
              )}
              <AdditionalfeeForm />
            </div>
            <div className="w-full md:w-auto py-2 mt-10">
              <button
                onClick={addRentalRecord}
                disabled={addingRentalRecord}
                className="w-full px-4 py-3 text-sm text-white font-medium bg-green-500 hover:bg-green-600 border border-green-600 rounded-md shadow-button flex items-center justify-center"
              >
                Send Invite to {newRentalRecord.tenant}
                {addingRentalRecord && (
                  <svg
                    className="animate-spin h-5 w-5 mr-3 rounded-full border-t-2 border-r-2 border-white ml-2"
                    viewBox="0 0 24 24"
                  ></svg>
                )}
              </button>
            </div>
          </section>
        )}
        <AddBankRecordModal
          openModal={openAddRecordModal}
          setOpenModal={setOpenAddRecordModal}
        />
      </div>
    </DashboardWrapper>
  );
}

{
  /* <textarea
                          name="rentInstruction"
                          id="rentInstruction"
                          cols={30}
                          rows={10}
                          onChange={(e) => {
                            dispatch(
                              updateNewRentalRecord({
                                rentInstruction: e.target.value,
                              })
                            );
                          }}
                          className="w-full px-4 py-2.5 my-3 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                          about="Write some instructions you want the tenants to understand and or agree to."
                          title="Write some instructions you want the tenants to understand and or agree to."
                        ></textarea> */
}
