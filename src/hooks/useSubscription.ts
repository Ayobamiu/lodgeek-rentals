import axios from "axios";
import { useEffect, useState } from "react";
import { selectSelectedCompany } from "../app/features/companySlice";
import { useAppSelector } from "../app/hooks";
import { PayStackSubscription } from "../models";

const useSubscription = () => {
  const selectedCompany = useAppSelector(selectSelectedCompany);
  const [subscription, setSubscription] = useState<PayStackSubscription>();
  const [fetchingSubscribtion, setFetchingSubscribtion] = useState(false);

  useEffect(() => {
    if (selectedCompany?.subscriptionCode) {
      fetchSubscription(selectedCompany.subscriptionCode);
    }
  }, [selectedCompany]);

  const fetchSubscription = async (subId: string) => {
    const options = {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_SECRET_KEY}`,
      },
    };
    setFetchingSubscribtion(true);
    await axios
      .get(`https://api.paystack.co/subscription/${subId}`, options)
      .then((response) => {
        setSubscription(response.data.data);
      })
      .finally(() => {
        setFetchingSubscribtion(false);
      });
  };

  return { subscription, fetchingSubscribtion, fetchSubscription };
};
export default useSubscription;
