import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  addProperty,
  selectProperties,
  setProperties,
} from "../app/features/propertySlice";
import { selectUser } from "../app/features/userSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { db, generateFirebaseId, PROPERTY_PATH } from "../firebase/config";
import { Property } from "../models";

const useProperties = () => {
  const propertyRef = collection(db, PROPERTY_PATH);
  const [addingProperty, setAddingProperty] = useState(false);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [propertyLoading, setPropertyLoading] = useState("");
  const dispatch = useAppDispatch();
  const properties = useAppSelector(selectProperties);
  const loggedInUser = useAppSelector(selectUser);

  useEffect(() => {
    if (!properties.length) {
      getUsersProperties();
    }
  }, [loggedInUser?.email]);

  async function getUsersProperties() {
    const propertiesCol = collection(db, PROPERTY_PATH);
    const q = query(propertiesCol, where("owner", "==", loggedInUser?.email));

    setLoadingProperties(true);
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
      .finally(() => {
        setLoadingProperties(false);
      });
  }

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
    propertyLoading,
  };
};
export default useProperties;
