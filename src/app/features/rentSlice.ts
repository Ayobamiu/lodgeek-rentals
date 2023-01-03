import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Rent } from "../../models";
import filterUniqueByKey from "../../utils/filterUniqueIds";
import { RootState } from "../store";

interface PropertyState {
  rents: Rent[];
}

const initialState: PropertyState = {
  rents: [],
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
  },
});

export const { addRent, updateRent, deleteRent, setRents } =
  propertySlice.actions;

export const selectRents = (state: RootState) => state.rent.rents;

export default propertySlice.reducer;
