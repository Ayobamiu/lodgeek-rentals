import { message, Modal, ModalFuncProps } from "antd";
import { useEffect, useState } from "react";
import { selectSelectedCompany } from "../app/features/companySlice";
import {
  addPayment,
  deletePayment,
  selectPayment,
  setPayments,
} from "../app/features/paymentSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  createPayment,
  deletePaymentFromDatabase,
  getPaymentsForCompany,
} from "../firebase/apis/payment";
import { Payment } from "../models";

const usePayments = () => {
  const { payments } = useAppSelector(selectPayment);
  const selectedCompany = useAppSelector(selectSelectedCompany);
  const dispatch = useAppDispatch();
  const [addingPayment, setAddingPayment] = useState(false);

  useEffect(() => {
    if (!payments.length) {
      loadCompanyPayments();
    }
  }, [selectedCompany?.id]);

  const loadCompanyPayments = async () => {
    if (selectedCompany?.id) {
      const paymentsList = await getPaymentsForCompany(selectedCompany?.id);
      dispatch(setPayments(paymentsList));
    }
  };

  const addPaymentToDatabaseAndStore = async (payment: Payment) => {
    setAddingPayment(true);
    await createPayment(payment)
      .then(() => {
        dispatch(addPayment(payment));
      })
      .finally(() => {
        setAddingPayment(false);
      });
  };

  const deletePaymentFromDatabaseAndStore = async (id: string) => {
    const config: ModalFuncProps = {
      title: "Delete Payment!",
      content: "All data about this payment will be lost.",
      okButtonProps: { className: "bg-blue-500", type: "primary" },
      onOk: async () => {
        await deletePaymentFromDatabase(id).then(() => {
          dispatch(deletePayment(id));
          message.success("Payment record deleted");
        });
      },
    };
    Modal.confirm(config);
  };

  return {
    addPaymentToDatabaseAndStore,
    addingPayment,
    deletePaymentFromDatabaseAndStore,
  };
};
export default usePayments;
