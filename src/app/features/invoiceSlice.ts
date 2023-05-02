import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Invoice } from "../../models";
import { initialInvoice } from "../initialValues";
import { RootState } from "../store";

interface UserState {
  invoices: Invoice[];
  currentInvoice: Invoice;
}

const initialState: UserState = {
  invoices: [],
  currentInvoice: initialInvoice,
};
export const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    setCurrentInvoice: (state, action: PayloadAction<Invoice>) => {
      state.currentInvoice = action.payload;
    },
    updateCurrentInvoice: (state, action: PayloadAction<Partial<Invoice>>) => {
      state.currentInvoice = {
        ...state.currentInvoice,
        ...action.payload,
      };
    },
    resetCurrentInvoice: (state) => {
      state.currentInvoice = initialInvoice;
    },
    updateInvoice: (state, action: PayloadAction<Invoice>) => {
      const currentInvoices = [...state.invoices];
      const invoiceIndex = currentInvoices.findIndex(
        (i) => i.id === action.payload.id
      );
      currentInvoices.splice(invoiceIndex, 1, action.payload);
      state.invoices = currentInvoices;
    },
    deleteInvoice: (state, action: PayloadAction<string>) => {
      const currentInvoices = [...state.invoices];
      const invoiceIndex = currentInvoices.findIndex(
        (i) => i.id === action.payload
      );
      currentInvoices.splice(invoiceIndex, 1);
      state.invoices = currentInvoices;
    },
    addInvoice: (state, action: PayloadAction<Invoice>) => {
      const currentInvoices = [...state.invoices];
      currentInvoices.unshift(action.payload);
      state.invoices = currentInvoices;
    },
    setInvoices: (state, action: PayloadAction<Invoice[]>) => {
      state.invoices = action.payload;
    },
  },
});

export const {
  addInvoice,
  setInvoices,
  setCurrentInvoice,
  updateInvoice,
  resetCurrentInvoice,
  updateCurrentInvoice,
  deleteInvoice,
} = invoiceSlice.actions;

export const selectInvoice = (state: RootState) => state.invoice;

export default invoiceSlice.reducer;
