import React, { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { toast } from "react-toastify";
import Header from "../../assets/flex-ui-assets/images/headers/header.jpg";
import { Rent, RentType } from "../../models";
import { useNavigate } from "react-router-dom";
import useProperties from "../../hooks/useProperties";
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
  faPlus,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import formatPrice from "../../utils/formatPrice";
import useRentalRecords from "../../hooks/useRentalRecords";
import DetailsBox from "../../components/shared/DetailsBox";

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

  const { getPropertyData, propertyLoading } = useProperties();
  const { addingRentalRecord, handleAddRentalRecord } = useRentalRecords();
  const properties = useAppSelector(selectProperties);
  const newRentalRecord = useAppSelector(selectNewRentalRecord);

  const submitStageOne = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newRentalRecord.property) {
      return toast.error("Select a property");
    }
    setStage("two");
  };

  function gotoRentalRecords() {
    dispatch(resetNewRentalRecord());
    navigate("/dashboard?tab=rentalRecords");
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
        status: "upcoming",
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
        status: "upcoming",
      });
    }
    setRents(r);
  }, [newRentalRecord.rentPer, newRentalRecord.rentStarts]);

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
      status: "upcoming",
    });
    setRents(currentRents);
  };

  const addRentalRecord = async () => {
    await handleAddRentalRecord(newRentalRecord, rents).then(gotoRentalRecords);
  };
  const property = properties.find((i) => i.id === newRentalRecord.property);

  return (
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
                    <div className="w-full md:flex-1 p-3">
                      <div className="w-full  text-base text-coolGray-900 font-normal outline-none focus:border-green-500   rounded-lg shadow-input">
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
            </form>
          </div>
        </section>
      )}

      {stage === "two" && (
        <section className="bg-white p-8 pt-7 pb-6 container mx-auto">
          <div className="flex flex-wrap items-center justify-between pb-5 -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
              <h2 className="text-lg font-semibold">Rental Record Details</h2>
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

          <div className="border-b border-coolGray-100 my-3">
            <DetailsBox label="Property " value={property?.title} />

            <DetailsBox label="Tenant" value={newRentalRecord.tenant} />
            <DetailsBox label="Property Location" value={property?.location} />
            <DetailsBox label="Property Address" value={property?.address} />
            <DetailsBox
              label="Rent"
              value={`${formatPrice(newRentalRecord?.rent || 0)}/${
                newRentalRecord?.rentPer
              }`}
            />
          </div>

          <p className="text-xs font-medium text-coolGray-500 flex gap-2 items-center my-5 flex-wrap">
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
                  if (rent.status === "paid") {
                    toggleRent(index, { ...rent, status: "upcoming" });
                  } else {
                    toggleRent(index, { ...rent, status: "paid" });
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
                {rent.status === "paid" && (
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
                    color={rent.status === "paid" ? "green" : "black"}
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
              reminders will not be sent to tenants who have already paid their
              rent.
            </p>
            <p className="text-xs font-medium text-coolGray-500 my-2">
              Click plus button <FontAwesomeIcon icon={faPlus} color="black" />{" "}
              to add more rents.
            </p>
            <p className="text-xs font-medium text-coolGray-500 my-2">
              Click remove button{" "}
              <FontAwesomeIcon icon={faTimesCircle} className="" /> to remove
              rents.
            </p>
          </div>
          <div className="w-full md:w-auto p-2">
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
    </div>
  );
}
