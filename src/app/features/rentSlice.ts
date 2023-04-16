import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdditionalFee, Rent } from "../../models";
import filterUniqueByKey from "../../utils/filterUniqueIds";
import { RootState } from "../store";

interface RentState {
  rents: Rent[];
  selectedRents: Rent[];
  selectedAdditionalFees: AdditionalFee[];
  openRentPayment: boolean;
}

const initialState: RentState = {
  rents: [],
  selectedRents: [],
  selectedAdditionalFees: [],
  openRentPayment: false,
};
export const propertySlice = createSlice({
  name: "rent",
  initialState,
  reducers: {
    deleteRent: (state, action: PayloadAction<Rent>) => {
      const currentRents = [...state.rents];
      const rentIndex = currentRents.findIndex(
        (i) => i.id === action.payload.id
      );
      currentRents.splice(rentIndex, 1);
      state.rents = currentRents;
    },
    updateRent: (state, action: PayloadAction<Rent>) => {
      const currentRents = [...state.rents];
      const rentIndex = currentRents.findIndex(
        (i) => i.id === action.payload.id
      );
      currentRents.splice(rentIndex, 1, action.payload);
      state.rents = currentRents;
    },
    addRent: (state, action: PayloadAction<Rent>) => {
      const currentRents = [...state.rents];
      currentRents.push(action.payload);
      state.rents = filterUniqueByKey(currentRents, "id");
    },
    setRents: (state, action: PayloadAction<Rent[]>) => {
      state.rents = action.payload;
    },
    setSelectedRents: (state, action: PayloadAction<Rent[]>) => {
      state.selectedRents = action.payload;
    },
    setOpenRentPayment: (state, action: PayloadAction<boolean>) => {
      state.openRentPayment = action.payload;
    },
    setSelectedAdditionalFees: (
      state,
      action: PayloadAction<AdditionalFee[]>
    ) => {
      state.selectedAdditionalFees = action.payload;
    },
  },
});

export const {
  addRent,
  updateRent,
  deleteRent,
  setRents,
  setSelectedRents,
  setSelectedAdditionalFees,
  setOpenRentPayment,
} = propertySlice.actions;

export const selectRent = (state: RootState) => state.rent;
export const selectRents = (state: RootState) => state.rent.rents;
export const selectSelectedRents = (state: RootState) =>
  state.rent.selectedRents;
export const selectSelectedAdditionalFees = (state: RootState) =>
  state.rent.selectedAdditionalFees;

export default propertySlice.reducer;
