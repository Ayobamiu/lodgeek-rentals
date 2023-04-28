import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Payment } from "../../models";
import filterUniqueByKey from "../../utils/filterUniqueIds";
import { initialPayment } from "../initialValues";
import { RootState } from "../store";

interface PaymentState {
  payments: Payment[];
  selectedPayment: Payment;
}

const initialState: PaymentState = {
  payments: [],
  selectedPayment: initialPayment,
};
export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    deletePayment: (state, action: PayloadAction<string>) => {
      const currentPayments = [...state.payments];
      const paymentIndex = currentPayments.findIndex(
        (i) => i.id === action.payload
      );
      currentPayments.splice(paymentIndex, 1);
      state.payments = currentPayments;
    },
    updatePayment: (state, action: PayloadAction<Payment>) => {
      const currentPayments = [...state.payments];
      const paymentIndex = currentPayments.findIndex(
        (i) => i.id === action.payload.id
      );
      currentPayments.splice(paymentIndex, 1, action.payload);
      state.payments = currentPayments;
    },
    addPayment: (state, action: PayloadAction<Payment>) => {
      const currentPayments = [...state.payments];
      currentPayments.push(action.payload);
      state.payments = filterUniqueByKey(currentPayments, "id");
    },
    setPayments: (state, action: PayloadAction<Payment[]>) => {
      state.payments = filterUniqueByKey(action.payload, "id");
    },
    setSelectedPayment: (state, action: PayloadAction<Payment>) => {
      state.selectedPayment = action.payload;
    },
    resetSelectedPayment: (state) => {
      state.selectedPayment = initialPayment;
    },
  },
});

export const {
  addPayment,
  deletePayment,
  setPayments,
  updatePayment,
  setSelectedPayment,
  resetSelectedPayment,
} = paymentSlice.actions;

export const selectPayment = (state: RootState) => state.payment;

export default paymentSlice.reducer;
