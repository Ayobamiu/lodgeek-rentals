import React, { useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { Property, RentType } from "../../models";
import { useNavigate } from "react-router-dom";
import useProperties from "../../hooks/useProperties";
import { toast } from "react-toastify";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../app/features/userSlice";
import { generateFirebaseId, PROPERTY_PATH } from "../../firebase/config";
import DashboardWrapper from "../../components/dashboard/DashboardWrapper";
import { selectSelectedCompany } from "../../app/features/companySlice";

export default function AddProperty() {
  const [rent, setRent] = useState(0);
  const [rentPer, setRentPer] = useState<RentType>("year");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();
  const { addProperty, addingProperty } = useProperties();
  const loggedInUser = useAppSelector(selectUser);
  const selectedCompany = useAppSelector(selectSelectedCompany);

  const submitStageOne = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rent < 1) {
      return toast.error("Set Rent Amount");
    }
    if (!loggedInUser?.email) {
      return toast.error("Error getting user");
    }
    const data: Property = {
      rent,
      rentPer,
      title,
      location,
      address,
      createdDate: Date.now(),
      description,
      owner: loggedInUser?.email,
      id: generateFirebaseId(PROPERTY_PATH),
      company: selectedCompany?.id || "",
    };

    await addProperty(data).then(() => {
      const addPropertyForm =
        document &&
        (document?.getElementById("addPropertyForm") as HTMLFormElement);
      addPropertyForm && addPropertyForm.reset();
    });
  };

  const gotoProperties = () => {
    navigate(`/dashboard/${selectedCompany?.id}/properties`);
  };

  return (
    <DashboardWrapper>
      <div>
        <section className="bg-white py-4">
          <div className="container px-4 mx-auto">
            <form
              onSubmit={submitStageOne}
              onReset={gotoProperties}
              className="p-6 h-full  bg-white rounded-md"
              id="addPropertyForm"
            >
              <div className="pb-6 border-b border-coolGray-100">
                <div className="flex flex-wrap items-center justify-between -m-2">
                  <div className="w-full md:w-auto p-2">
                    <h2 className="text-coolGray-900 text-lg font-semibold">
                      Add Property
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
                          disabled={addingProperty}
                        >
                          <p>Submit</p>
                          {addingProperty && (
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
              </div>
              <div className="py-6 border-b border-coolGray-100">
                <div className="w-full md:w-9/12">
                  <div className="flex flex-wrap -m-3">
                    <div className="w-full md:w-1/3 p-3">
                      <p className="text-sm text-coolGray-800 font-semibold">
                        Title
                      </p>
                    </div>
                    <div className="w-full md:flex-1 p-3">
                      <input
                        required
                        className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                        type="text"
                        placeholder="Title of apartment"
                        onChange={(e) => setTitle(e.target.value)}
                        defaultValue={title}
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
                        Description
                      </p>
                    </div>
                    <div className="w-full md:flex-1 p-3">
                      <input
                        className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                        type="text"
                        placeholder="Description of apartment"
                        onChange={(e) => setDescription(e.target.value)}
                        defaultValue={description}
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
                        Location
                      </p>
                    </div>
                    <div className="w-full md:flex-1 p-3">
                      <input
                        // ref={ref}
                        required
                        className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                        type="text"
                        placeholder="Lekki, Lagos"
                        onChange={(e) => setLocation(e.target.value)}
                        defaultValue={location}
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
                        Address
                      </p>
                    </div>
                    <div className="w-full md:flex-1 p-3 relative">
                      <input
                        required
                        className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                        type="text"
                        placeholder="2, New Avenue Street"
                        onChange={(e) => setAddress(e.target.value)}
                        defaultValue={address}
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
                          setRent(Number(value));
                        }}
                        defaultValue={rent}
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
                        defaultValue={rentPer}
                        onSelect={(e) =>
                          setRentPer(e.currentTarget.value as RentType)
                        }
                      >
                        <option value="month">per month</option>
                        <option value="year">per year</option>
                      </select>
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
