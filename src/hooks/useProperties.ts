import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { selectSelectedCompany } from "../app/features/companySlice";
import {
  addProperty,
  selectProperty,
  setLandlords,
  setProperties,
} from "../app/features/propertySlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getLandlordsForCompany } from "../firebase/apis/landlord";
import { db, PROPERTY_PATH } from "../firebase/config";
import { Property } from "../models";

const useProperties = () => {
  const propertyRef = collection(db, PROPERTY_PATH);
  const [addingProperty, setAddingProperty] = useState(false);

  const [loadingLandlords, setLoadingLandlords] = useState(false);
  let { companyId } = useParams();

  const dispatch = useAppDispatch();
  const { landlords, properties } = useAppSelector(selectProperty);
  const selectedCompany = useAppSelector(selectSelectedCompany);

  const getUsersProperties = useCallback(async () => {
    const propertiesCol = collection(db, PROPERTY_PATH);
    const q = query(propertiesCol, where("company", "==", selectedCompany?.id));

    await getDocs(q)
      .then((propertiesSnapshot) => {
        const propertiesList = propertiesSnapshot.docs.map((doc) =>
          doc.data()
        ) as Property[];

        dispatch(setProperties(propertiesList));
      })
      .catch((error) => {
        toast.error("Error Loading Properties");
      })
      .finally(() => {});
  }, [selectedCompany, dispatch]);

  useEffect(() => {
    if (!properties.length && selectedCompany) {
      getUsersProperties();
    }
  }, [selectedCompany, getUsersProperties]);

  useEffect(() => {
    if (!landlords.length) {
      getCompanyLandlords();
    }
  }, [companyId]);

  const handleAddProperty = async (data: Property) => {
    setAddingProperty(true);
    await setDoc(doc(propertyRef, data.id), data)
      .then((c) => {
        toast.success("Succesfully Added Property");
        dispatch(addProperty(data));
        return data;
      })
      .catch((error) => {
        toast.error("Error Adding Property");
        return null;
      })
      .finally(() => {
        setAddingProperty(false);
      });
  };

  const getCompanyLandlords = useCallback(async () => {
    if (!landlords.length && companyId) {
      setLoadingLandlords(true);
      const landlordss = await getLandlordsForCompany(companyId).finally(() => {
        setLoadingLandlords(false);
      });
      if (landlordss) {
        dispatch(setLandlords(landlordss));
      }
    }
  }, [landlords, companyId]);

  const getPropertyData = async (id: string): Promise<Property | undefined> => {
    let property = properties.find((i) => i.id === id);
    if (!property) {
      const docRef = doc(db, PROPERTY_PATH, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        property = docSnap.data() as Property;
      }
    }

    return property;
  };

  return {
    addProperty: handleAddProperty,
    addingProperty,
    getPropertyData,
    loadingLandlords,
  };
};
export default useProperties;
