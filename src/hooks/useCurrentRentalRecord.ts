import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  selectRentalRecord,
  setCurrentRentalRecord,
  setCurrentRentalRecordCompany,
  setCurrentRentalRecordOwner,
  setCurrentRentalRecordProperty,
  setCurrentRentalRecordRents,
  setCurrentRentalRecordTenant,
} from "../app/features/rentalRecordSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getCompany } from "../firebase/apis/company";
import { Rent } from "../models";
import useAuth from "./useAuth";
import useProperties from "./useProperties";
import useRentalRecords from "./useRentalRecords";
import useRents from "./useRents";

const useCurrentRentalRecord = () => {
  let { rentalRecordId } = useParams();
  const { getRentalRecordData } = useRentalRecords();
  const { currentRentalRecord } = useAppSelector(selectRentalRecord);
  const { getUserData } = useAuth();
  const { getRentsForARentalRecord } = useRents();
  const { getPropertyData } = useProperties();

  const dispatch = useAppDispatch();

  const [loadingRentalRecord, setLoadingRentalRecord] = useState(false);
  const [loadingProperty, setLoadingProperty] = useState(false);
  const [loadingOwner, setLoadingOwner] = useState(false);
  const [loadingTenant, setLoadingTenant] = useState(false);
  const [loadingRents, setLoadingRents] = useState(false);

  /* Load rental record */
  useEffect(() => {
    const loadRelatedRentalRecord = async () => {
      if (!rentalRecordId) return;
      setLoadingRentalRecord(true);
      const rentalRecordD = await getRentalRecordData(rentalRecordId).finally(
        () => {
          setLoadingRentalRecord(false);
        }
      );

      if (rentalRecordD) {
        dispatch(setCurrentRentalRecord(rentalRecordD));
      }
    };
    loadRelatedRentalRecord();
  }, [rentalRecordId]);
  /* Load rental record */

  /* Load property company data */
  useEffect(() => {
    (async () => {
      if (currentRentalRecord?.company) {
        const company = await getCompany(currentRentalRecord?.company);
        dispatch(setCurrentRentalRecordCompany(company));
      }
    })();
  }, [currentRentalRecord]);
  /* Load property company data */

  /* Load related property */
  useEffect(() => {
    const loadRelatedProperty = async () => {
      setLoadingProperty(true);
      const propertyData = await getPropertyData(
        currentRentalRecord?.property!
      ).finally(() => {
        setLoadingProperty(false);
      });
      dispatch(setCurrentRentalRecordProperty(propertyData));
    };
    if (currentRentalRecord?.property) {
      loadRelatedProperty();
    }
  }, [currentRentalRecord?.property]);
  /* Load related property */

  /* Load property owner */
  useEffect(() => {
    const loadRelatedOwner = async () => {
      if (!currentRentalRecord?.owner) return;
      setLoadingOwner(true);
      const ownerData = await getUserData(currentRentalRecord?.owner).finally(
        () => {
          setLoadingOwner(false);
        }
      );
      dispatch(setCurrentRentalRecordOwner(ownerData));
    };
    loadRelatedOwner();
  }, [currentRentalRecord?.owner]);
  /* Load property owner */

  /* Load tenant details */
  useEffect(() => {
    const loadRelatedTenant = async () => {
      if (!currentRentalRecord?.tenant) return;
      setLoadingTenant(true);
      const tenantData = await getUserData(currentRentalRecord?.tenant).finally(
        () => {
          setLoadingTenant(false);
        }
      );
      dispatch(setCurrentRentalRecordTenant(tenantData));
    };
    loadRelatedTenant();
  }, [currentRentalRecord?.tenant]);
  /* Load tenant details */

  /* Load rents */

  useEffect(() => {
    const loadRelatedRents = async () => {
      if (!currentRentalRecord?.id) return;
      setLoadingRents(true);
      const rentsData = await getRentsForARentalRecord(
        currentRentalRecord?.id
      ).finally(() => {
        setLoadingRents(false);
      });
      dispatch(setCurrentRentalRecordRents(rentsData as Rent[]));
    };
    loadRelatedRents();
  }, [currentRentalRecord?.id]);
  /* Load rents */
  return {
    loadingRentalRecord,
    loadingProperty,
    loadingOwner,
    loadingTenant,
    loadingRents,
  };
};
export default useCurrentRentalRecord;
