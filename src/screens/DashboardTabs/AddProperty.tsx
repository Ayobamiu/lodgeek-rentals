import React, { useCallback, useEffect, useState } from "react";
import { FirebaseCollections, Landlord, Property } from "../../models";
import { useNavigate, useParams } from "react-router-dom";
import useProperties from "../../hooks/useProperties";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUser } from "../../app/features/userSlice";
import { generateFirebaseId, PROPERTY_PATH } from "../../firebase/config";
import DashboardWrapper from "../../components/dashboard/DashboardWrapper";
import { selectSelectedCompany } from "../../app/features/companySlice";
import {
  resetNewProperty,
  selectProperty,
  setNewProperty,
  updateProperty,
} from "../../app/features/propertySlice";
import { PropertyImages } from "./PropertyImages";
import { PropertyInformationForm } from "./PropertyInformationForm";
import { LandloardInforationForm } from "./LandloardInforationForm";
import { createLandlord } from "../../firebase/apis/landlord";
import ActivityIndicator from "../../components/shared/ActivityIndicator";
import { getProperty } from "../../firebase/apis/company";
import { updatePropertyInDatabase } from "../../firebase/apis/property";

export default function AddProperty() {
  const dispatch = useAppDispatch();
  const { newProperty, landlords, properties } = useAppSelector(selectProperty);

  const navigate = useNavigate();
  const { addingProperty, addProperty } = useProperties();
  const loggedInUser = useAppSelector(selectUser);
  const selectedCompany = useAppSelector(selectSelectedCompany);
  const [loading, setLoading] = useState(false);
  const [updatingProperty, setUpdatingProperty] = useState(false);
  const [error, setError] = useState("");
  const { propertyId } = useParams();

  const getPropertyDetail = useCallback(async () => {
    if (propertyId) {
      const propertyInStore = properties.find((i) => i.id === propertyId);
      if (propertyInStore) {
        dispatch(setNewProperty(propertyInStore));
      } else {
        setLoading(true);
        setError("");
        const property = await getProperty(propertyId);
        if (property) {
          setLoading(false);
          setError("");
          dispatch(setNewProperty(property));
          return;
        }
        if (!property) {
          setLoading(false);
          setError("Error occured while getting the property detail");
          return;
        }
      }
    }
  }, [propertyId]);

  useEffect(() => {
    getPropertyDetail();
  }, [getPropertyDetail, propertyId]);

  const submitStageOne = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newProperty.rent < 1) {
      return toast.error("Set Rent Amount");
    }
    if (!loggedInUser?.email) {
      return toast.error("Error getting user");
    }
    if (!selectedCompany) {
      return toast.error("Error getting account details.");
    }

    const mainData: Property = {
      ...newProperty,
      id: generateFirebaseId(PROPERTY_PATH),
      company: selectedCompany?.id || "",
      owner: loggedInUser?.email,
    };

    const landlord: Landlord = {
      company: selectedCompany?.id,
      id: generateFirebaseId(FirebaseCollections.landlord),
      landLordContactPhoneNumber: newProperty.landLordContactPhoneNumber,
      landLordEmailAddress: newProperty.landLordEmailAddress,
      landLordEmergencyContactInformation:
        newProperty.landLordEmergencyContactInformation,
      landLordFullName: newProperty.landLordFullName,
      landLordMailingAddress: newProperty.landLordMailingAddress,
      photoUrl: "",
      landLordPropertyManagementExperience:
        newProperty.landLordPropertyManagementExperience,
      landLordTaxIdentificationNumber:
        newProperty.landLordTaxIdentificationNumber,
    };
    await addProperty(mainData).then(async () => {
      if (
        !landlords.find(
          (i) => i.landLordEmailAddress === landlord.landLordEmailAddress
        )
      ) {
        await createLandlord(landlord);
      }

      dispatch(resetNewProperty());
      const addPropertyForm =
        document &&
        (document?.getElementById("addPropertyForm") as HTMLFormElement);
      addPropertyForm && addPropertyForm.reset();
    });
  };

  const updatePropertyInDatabaseAndStore = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setUpdatingProperty(true);
    await updatePropertyInDatabase(newProperty)
      .then(() => {
        dispatch(updateProperty(newProperty));
        gotoProperty(propertyId as string);
      })
      .finally(() => {
        setUpdatingProperty(false);
      });
  };

  const gotoProperties = () => {
    dispatch(resetNewProperty());
    navigate(`/dashboard/${selectedCompany?.id}/properties`);
  };
  const gotoProperty = (id: string) => {
    dispatch(resetNewProperty());
    navigate(`/dashboard/${selectedCompany?.id}/properties/${id}`);
  };

  return (
    <DashboardWrapper>
      <div>
        <section className="bg-white py-4">
          <div className="container lg:px-4 mx-auto">
            <form
              onSubmit={(e) => {
                propertyId
                  ? updatePropertyInDatabaseAndStore(e)
                  : submitStageOne(e);
              }}
              onReset={gotoProperties}
              className="p-6 h-full  bg-white rounded-md"
              id="addPropertyForm"
            >
              {/* Form Header */}
              <div className="pb-6 border-b border-coolGray-100">
                <div className="flex flex-wrap items-center justify-between -m-2">
                  <div className="w-full md:w-auto p-2">
                    <h2 className="text-coolGray-900 text-2xl font-semibold">
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
                          {(addingProperty || updatingProperty) && (
                            <ActivityIndicator size="4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* End of form Header */}
              <PropertyImages />

              <PropertyInformationForm />
              {/* Lanlord information */}
              <LandloardInforationForm />
            </form>
          </div>
        </section>
      </div>
    </DashboardWrapper>
  );
}
