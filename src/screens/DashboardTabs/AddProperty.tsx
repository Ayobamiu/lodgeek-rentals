import React, { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import {
  IProperty,
  Property,
  RentType,
  propertyConditionType,
  propertyFurnishing,
} from "../../models";
import { useNavigate } from "react-router-dom";
import useProperties from "../../hooks/useProperties";
import { toast } from "react-toastify";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../app/features/userSlice";
import { generateFirebaseId, PROPERTY_PATH } from "../../firebase/config";
import DashboardWrapper from "../../components/dashboard/DashboardWrapper";
import { selectSelectedCompany } from "../../app/features/companySlice";
import Input from "../../components/shared/input/Input";
import InputSelect from "../../components/shared/input/InputSelect";
import {
  conditionList,
  facilitiesList,
  furnishingList,
  propertyTypeList,
} from "../../utils/prodData";
import NaijaStates from "naija-state-local-government";
import Select from "../../components/shared/Select/Select";
import MultiSelect from "../../components/shared/Select/MultiSelect";
import TextAreaInput from "../../components/shared/input/TextAreaInput";

export default function AddProperty() {
  const [rent, setRent] = useState(0);
  const [rentPer, setRentPer] = useState<RentType>("year");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [toilet, setSToilet] = useState(0);
  const [estateName, setEstateName] = useState("");
  const [propertyState, setPropertyState] = useState("");
  const [propertyCondition, setPropertyCondition] = useState("");
  const [propertyFurnishing, setPropertyFurnishing] = useState("");
  const [propertyFacilities, setPropertyFacilities] = useState<any>([]);
  // const [furnishingDataLocal,setFurnishingDataLocal] = useState<{value:string,label:string}[] | undefined>(undefined)
  const [propertyLga, setPropertyLga] = useState("");
  const [propertySize, setPropertySize] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [lgaData, setLgaData] = useState<string[]>([]);

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

    const facilities = propertyFacilities?.map(
      (item: { value: string; label: string }) => item?.label
    );

    const mainData: IProperty = {
      id: generateFirebaseId(PROPERTY_PATH),
      company: selectedCompany?.id || "",
      owner: loggedInUser?.email,
      description,
      address,
      createdDate: Date.now(),
      state: propertyState,
      lga: propertyLga,
      estateName,
      propertyType,
      propertySize,
      condition: propertyCondition as propertyConditionType,
      furnishing: propertyFurnishing as propertyFurnishing,
      numberOfBedrooms: bedrooms,
      numberOfBathrooms: bathrooms,
      numberOfToilets: toilet,
      facilities,
      title,
      rent,
      rentPer,
      location,
    };

    await addProperty(mainData).then(() => {
      const addPropertyForm =
        document &&
        (document?.getElementById("addPropertyForm") as HTMLFormElement);
      addPropertyForm && addPropertyForm.reset();
    });
  };

  // Setting the lag based on the state selected
  useEffect(() => {
    if (propertyState) {
      setLgaData(NaijaStates.lgas(propertyState)?.lgas);
    }
  }, [propertyState]);

  const gotoProperties = () => {
    navigate(`/dashboard/${selectedCompany?.id}/properties`);
  };

  const mappedFacilities = facilitiesList.map((item: string) => {
    return {
      label: item,
      value: item,
    };
  });

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
              {/* Form Header */}
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
              {/* End of form Header */}
              <section className="w-full mt-5">
                {/* Single Property data */}
                <div className="w-full grid  md:grid-cols-2 gap-5 items-center">
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e?.target.value)}
                    className="w-full"
                    label="Property Title"
                    required
                    placeholder="Enter property title..."
                  />
                  <Input
                    value={estateName}
                    onChange={(e) => setEstateName(e?.target.value)}
                    className="w-full"
                    label="Estate Name"
                    placeholder="Enter estate name if applicable..."
                  />
                </div>
                {/* Single Property data */}
                <div className="w-full grid  md:grid-cols-2 gap-5 items-center mt-5">
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e?.target.value)}
                    className="w-full"
                    label="Property Address"
                    required
                    placeholder="Enter property address..."
                  />
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e?.target.value)}
                    className="w-full"
                    label="Property Location"
                    required
                    placeholder="Ikeja, Lagos,"
                  />
                </div>
                {/* Single Property data */}
                <div className="w-full grid  md:grid-cols-2 gap-5 items-center mt-5">
                  <InputSelect
                    value={propertyState}
                    onChange={(e) => setPropertyState(e?.target.value)}
                    className="w-full"
                    label="Property State"
                    required
                    placeholder="Select state location of property"
                    options={NaijaStates.states()}
                  />
                  <InputSelect
                    value={propertyLga}
                    onChange={(e) => setPropertyLga(e?.target.value)}
                    className="w-full"
                    label="Property LGA"
                    placeholder="Select the LGA location of property..."
                    required
                    options={lgaData}
                  />
                </div>
                {/* Single Property data */}
                <div className="w-full grid md:grid-cols-2 gap-5 items-center mt-5">
                  <Input
                    value={propertySize}
                    onChange={(e) => setPropertySize(e.target.value)}
                    className="w-full"
                    label="Property Size(sqm)"
                    required
                    placeholder="Enter property size..."
                  />
                  <InputSelect
                    value={propertyType}
                    onChange={(e) => setPropertyType(e?.target.value)}
                    className="w-full"
                    label="Property Type"
                    required
                    placeholder="Select the property type..."
                    options={propertyTypeList}
                  />
                </div>
                {/* Single Property data */}
                <div className="w-full grid md:grid-cols-2 gap-5 items-center mt-5">
                  <Input
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full"
                    label="Property Bedrooms"
                    required
                    placeholder="Enter property  bedrooms..."
                  />
                  <Input
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e?.target.value)}
                    className="w-full"
                    label="Property Bathrooms"
                    required
                    placeholder="Select the property bathrooms..."
                  />
                </div>

                {/* Single Property data */}
                <div className="w-full grid  md:grid-cols-2 gap-5 items-center mt-5">
                  <Input
                    value={toilet}
                    onChange={(e) => setSToilet(e?.target.value)}
                    className="w-full"
                    label="Property Number of Toilets"
                    required
                    placeholder="Enter the property number of toilets,"
                    type="number"
                  />
                  <MultiSelect
                    id="facilities"
                    value={propertyFacilities}
                    onChange={(e) => setPropertyFacilities(e)}
                    className="w-full"
                    label="Property facilities"
                    required
                    placeholder="Select the property facilities..."
                    options={mappedFacilities}
                  />
                </div>
                {/* Single Property data */}
                <div className="w-full grid md:grid-cols-2 gap-5 items-center mt-5">
                  <InputSelect
                    value={propertyCondition}
                    onChange={(e) => setPropertyCondition(e.target.value)}
                    className="w-full"
                    label="Property Condition"
                    required
                    placeholder="Enter property condition..."
                    options={conditionList}
                  />
                  <InputSelect
                    value={propertyFurnishing}
                    onChange={(e) => setPropertyFurnishing(e?.target.value)}
                    className="w-full"
                    label="Property furnishing"
                    required
                    placeholder="Select the property furnishing..."
                    options={furnishingList}
                  />
                </div>

                {/* Single Property data */}
                <div className="w-full grid md:grid-cols-2 gap-5 items-center mt-5">
                  <div>
                    <label
                      htmlFor="property-price"
                      className="mb-1 text-coolGray-500 font-medium text-sm"
                    >
                      Property Price{" "}
                      <sup className="text-red-500 text-sm">*</sup>
                    </label>
                    <CurrencyInput
                      id="property-price"
                      name="property-price"
                      placeholder="₦ 500,000.00"
                      decimalsLimit={2}
                      onValueChange={(value, name) => {
                        setRent(Number(value));
                      }}
                      defaultValue={rent}
                      required
                      prefix="₦ "
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg "
                    />
                  </div>
                  <InputSelect
                    value={rentPer}
                    onChange={(e) => setRentPer(e?.target.value)}
                    className="w-full"
                    label="Property payment frequency"
                    placeholder="Enter the property payment frequency..."
                    options={["Month", "Year"]}
                    required
                  />
                </div>
                {/* Property Description  */}
                <div className="w-full mt-5">
                  <TextAreaInput
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    className="w-full"
                    label="Property Description"
                    required
                    placeholder="Enter detailed property description..."
                  />
                </div>
              </section>
            </form>
          </div>
        </section>
      </div>
    </DashboardWrapper>
  );
}

{
  /* <>
  <div className="py-6 border-b border-coolGray-100">
    <div className="w-full md:w-9/12">
      <div className="flex flex-wrap -m-3">
        <div className="w-full md:w-1/3 p-3">
          <p className="text-sm text-coolGray-800 font-semibold">Title</p>
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
          <p className="text-sm text-coolGray-800 font-semibold">Description</p>
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
          <p className="text-sm text-coolGray-800 font-semibold">Location</p>
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
          <p className="text-sm text-coolGray-800 font-semibold">Address</p>
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
          <p className="text-sm text-coolGray-800 font-semibold">Rent</p>
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
            onSelect={(e) => setRentPer(e.currentTarget.value as RentType)}
          >
            <option value="month">per month</option>
            <option value="year">per year</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</>; */
}
