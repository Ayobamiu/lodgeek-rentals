import { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import Input from "../../components/shared/input/Input";
import InputSelect from "../../components/shared/input/InputSelect";
import {
  conditionList,
  facilitiesList,
  furnishingList,
  propertyTypeList,
} from "../../utils/prodData";
import NaijaStates from "naija-state-local-government";
import TextAreaInput from "../../components/shared/input/TextAreaInput";
import {
  selectNewProperty,
  updateNewProperty,
} from "../../app/features/propertySlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RentType } from "../../models";
import { Select } from "antd";

export function PropertyInformationForm() {
  const dispatch = useAppDispatch();
  const newProperty = useAppSelector(selectNewProperty);
  const [lgaData, setLgaData] = useState<string[]>([]);
  useEffect(() => {
    if (newProperty.state) {
      setLgaData(NaijaStates.lgas(newProperty.state)?.lgas);
    }
  }, [newProperty.state]);

  const mappedFacilities = facilitiesList.map((item: string) => {
    return {
      label: item,
      value: item,
    };
  });

  return (
    <section className="w-full mt-5">
      <div className="w-full border-b border-b-gray-200 mb-5 pb-2">
        <h6 className="text-gray-400 font-semibold text-lg">
          Property Information
        </h6>
      </div>
      {/* Single Property data */}
      <div className="w-full grid  md:grid-cols-2 gap-5 items-center">
        <Input
          value={newProperty.title}
          onChange={(e) => {
            dispatch(updateNewProperty({ title: e.target.value }));
          }}
          className="w-full"
          label="Property Title"
          required
          placeholder="Enter property title..."
        />
        <Input
          value={newProperty.estateName || ""}
          onChange={(e) => {
            dispatch(updateNewProperty({ estateName: e.target.value }));
          }}
          className="w-full"
          label="Estate Name"
          placeholder="Enter estate name if applicable..."
        />
      </div>
      {/* Single Property data */}
      <div className="w-full grid  md:grid-cols-2 gap-5 items-center mt-5">
        <Input
          value={newProperty.address}
          onChange={(e) => {
            dispatch(updateNewProperty({ address: e.target.value }));
          }}
          className="w-full"
          label="Property Address"
          required
          placeholder="Enter property address..."
        />
        <Input
          value={newProperty.location || ""}
          onChange={(e) => {
            dispatch(updateNewProperty({ location: e.target.value }));
          }}
          className="w-full"
          label="Property Location"
          required
          placeholder="Ikeja, Lagos,"
        />
      </div>
      {/* Single Property data */}
      <div className="w-full grid  md:grid-cols-2 gap-5 items-center mt-5">
        <InputSelect
          value={newProperty.state}
          onChange={(e) => {
            dispatch(updateNewProperty({ state: e.target.value }));
          }}
          className="w-full"
          label="Property State"
          required
          placeholder="Select state location of property"
          options={NaijaStates.states()}
        />
        <InputSelect
          value={newProperty.lga}
          onChange={(e) => {
            dispatch(updateNewProperty({ lga: e.target.value }));
          }}
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
          value={newProperty.propertySize}
          onChange={(e) => {
            dispatch(updateNewProperty({ propertySize: e.target.value }));
          }}
          className="w-full"
          label="Property Size(sqm)"
          required
          placeholder="Enter property size..."
        />
        <InputSelect
          value={newProperty.propertyType}
          onChange={(e) => {
            dispatch(updateNewProperty({ propertyType: e.target.value }));
          }}
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
          value={newProperty.numberOfBedrooms}
          onChange={(e) => {
            dispatch(updateNewProperty({ numberOfBedrooms: e.target.value }));
          }}
          className="w-full"
          label="Property Bedrooms"
          required
          placeholder="Enter property  bedrooms..."
        />
        <Input
          value={newProperty.numberOfBathrooms}
          onChange={(e) => {
            dispatch(updateNewProperty({ numberOfBathrooms: e.target.value }));
          }}
          className="w-full"
          label="Property Bathrooms"
          required
          placeholder="Select the property bathrooms..."
        />
      </div>

      {/* Single Property data */}
      <div className="w-full grid  md:grid-cols-2 gap-5 items-center mt-5">
        <Input
          value={newProperty.numberOfToilets}
          onChange={(e) => {
            dispatch(updateNewProperty({ numberOfToilets: e.target.value }));
          }}
          className="w-full"
          label="Property Number of Toilets"
          required
          placeholder="Enter the property number of toilets,"
          type="number"
        />
        <div>
          <label
            htmlFor="options"
            className="mb-1 text-coolGray-500 font-medium text-sm"
          >
            Property facilities <sup className="text-red-500 text-sm">*</sup>
          </label>
          <Select
            size="large"
            mode="multiple"
            aria-required
            allowClear
            style={{ width: "100%" }}
            placeholder="Select the property facilities..."
            value={newProperty.facilities}
            onChange={(value: string[]) => {
              dispatch(
                updateNewProperty({
                  facilities: value,
                })
              );
            }}
            options={mappedFacilities}
          />
        </div>
      </div>
      {/* Single Property data */}
      <div className="w-full grid md:grid-cols-2 gap-5 items-center mt-5">
        <InputSelect
          defaultValue={newProperty.condition}
          value={newProperty.condition}
          onChange={(e) => {
            dispatch(updateNewProperty({ condition: e.target.value }));
          }}
          className="w-full"
          label="Property Condition"
          required
          placeholder="Enter property condition..."
          options={conditionList}
        />
        <InputSelect
          defaultValue={newProperty.furnishing}
          value={newProperty.furnishing}
          onChange={(e) => {
            dispatch(updateNewProperty({ furnishing: e.target.value }));
          }}
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
            Rent <sup className="text-red-500 text-sm">*</sup>
          </label>
          <CurrencyInput
            id="property-price"
            name="property-price"
            placeholder="₦ 500,000.00"
            decimalsLimit={2}
            onValueChange={(value, name) => {
              dispatch(updateNewProperty({ rent: Number(value) || 0 }));
            }}
            value={newProperty.rent}
            defaultValue={newProperty.rent || 0}
            required
            prefix="₦ "
            className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg "
          />
        </div>
        <InputSelect
          defaultValue={newProperty.rentPer}
          value={newProperty.rentPer}
          onChange={(e) => {
            dispatch(updateNewProperty({ rentPer: e.target.value }));
          }}
          className="w-full"
          label="Rent frequency"
          placeholder="Enter the property payment frequency..."
          options={[RentType.month, RentType.year]}
          required
        />
      </div>
      {/* Property Description  */}
      <div className="w-full mt-5">
        <TextAreaInput
          onChange={(e) => {
            dispatch(updateNewProperty({ description: e.target.value }));
          }}
          value={newProperty.description}
          className="w-full"
          label="Property Description"
          required
          placeholder="Enter detailed property description..."
        />
      </div>
    </section>
  );
}
