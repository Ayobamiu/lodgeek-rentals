import { useState } from "react";
import Input from "../../components/shared/input/Input";
import TextAreaInput from "../../components/shared/input/TextAreaInput";
import {
  selectNewProperty,
  updateNewProperty,
} from "../../app/features/propertySlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { ExisitingLandLords } from "./ExisitingLandLords";
import { useParams } from "react-router-dom";

export function LandloardInforationForm() {
  const dispatch = useAppDispatch();
  const { propertyId } = useParams();

  const newProperty = useAppSelector(selectNewProperty);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className="w-full mt-10 relative">
      <ExisitingLandLords
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        closeModal={closeModal}
      />

      {propertyId && (
        <div className="absolute w-full h-full backdrop-blur-sm"></div>
      )}

      <div className="w-full flex justify-between items-center border-b border-b-gray-200 mb-5 pb-2">
        <h6 className="text-gray-400 font-semibold text-lg">
          Lanlord's Information
        </h6>
        <button
          type="button"
          onClick={showModal}
          className="text-blue-500 text-xs text-right"
        >
          <FontAwesomeIcon icon={faPlus} /> Select existing landlord
        </button>
      </div>
      {/* Single Property data */}
      <div className="w-full grid  md:grid-cols-2 gap-5 items-center mt-5">
        <Input
          value={newProperty.landLordFullName}
          onChange={(e) => {
            dispatch(updateNewProperty({ landLordFullName: e.target.value }));
          }}
          className="w-full"
          label="FullName"
          required={!propertyId}
          placeholder="Enter lanlord full name..."
        />
        <Input
          value={newProperty.landLordEmailAddress}
          onChange={(e) => {
            dispatch(
              updateNewProperty({
                landLordEmailAddress: e.target.value,
              })
            );
          }}
          className="w-full"
          label="Email Address"
          placeholder="Enter lanlord email address..."
          type="email"
          required={!propertyId}
        />
      </div>
      {/* Single Property data */}
      <div className="w-full grid  md:grid-cols-2 gap-5 items-center mt-5">
        <Input
          value={newProperty.landLordContactPhoneNumber}
          onChange={(e) => {
            dispatch(
              updateNewProperty({
                landLordContactPhoneNumber: e.target.value,
              })
            );
          }}
          className="w-full"
          label="Contact Number"
          required={!propertyId}
          placeholder="Enter lanlord contact phone number..."
          type="tel"
        />
        <Input
          value={newProperty.landLordEmergencyContactInformation}
          onChange={(e) => {
            dispatch(
              updateNewProperty({
                landLordEmergencyContactInformation: e.target.value,
              })
            );
          }}
          className="w-full"
          label="Emergency Contact Number"
          placeholder="Enter lanlord emergency contact phone number..."
          type="tel"
          required={!propertyId}
        />
      </div>
      {/* Single Property data */}
      <div className="w-full grid  md:grid-cols-2 gap-5 items-center mt-5">
        <Input
          value={newProperty.landLordMailingAddress}
          onChange={(e) => {
            dispatch(
              updateNewProperty({
                landLordMailingAddress: e.target.value,
              })
            );
          }}
          className="w-full"
          label="Mailing Address (P.O.BOX)"
          required={!propertyId}
          placeholder="Enter lanlord mailing address..."
        />
        <Input
          value={newProperty.landLordTaxIdentificationNumber || ""}
          onChange={(e) => {
            dispatch(
              updateNewProperty({
                landLordTaxIdentificationNumber: e.target.value,
              })
            );
          }}
          className="w-full"
          label="Tax Identification Number (TIN)"
          placeholder="Enter lanlord TIN number..."
        />
      </div>
      {/* Single Property data */}
      <div className="w-full mt-5">
        <TextAreaInput
          value={newProperty.landLordPropertyManagementExperience || ""}
          onChange={(e) => {
            dispatch(
              updateNewProperty({
                landLordPropertyManagementExperience: e.target.value,
              })
            );
          }}
          className="w-full"
          label="About Me"
          placeholder="Enter lanLord about details..."
        />
      </div>
    </section>
  );
}
