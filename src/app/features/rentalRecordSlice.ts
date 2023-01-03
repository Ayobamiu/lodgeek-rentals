import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RentalRecord } from "../../models";
import filterUniqueByKey from "../../utils/filterUniqueIds";
import { RootState } from "../store";

interface PropertyState {
  rentalRecords: RentalRecord[];
  newRentalRecord: RentalRecord;
}

const initialState: PropertyState = {
  rentalRecords: [],
  newRentalRecord: {
    createdDate: Date.now(),
    rentStarts: Date.now(),
    id: "",
    owner: "",
    property: "",
    rent: 0,
    rentPer: "year",
    tenant: "",
    status: "created",
  },
};
export const propertySlice = createSlice({
  name: "rentalRecord",
  initialState,
  reducers: {
    deleteRentalRecord: (state, action: PayloadAction<RentalRecord>) => {
      const currentRentalRecords = [...state.rentalRecords];
      const rentalRecordIndex = currentRentalRecords.findIndex(
        (i) => i.id === action.payload.id
      );
      currentRentalRecords.splice(rentalRecordIndex, 1);
      state.rentalRecords = currentRentalRecords;
    },
    updateRentalRecord: (state, action: PayloadAction<RentalRecord>) => {
      const currentRentalRecords = [...state.rentalRecords];
      const rentalRecordIndex = currentRentalRecords.findIndex(
        (i) => i.id === action.payload.id
      );
      currentRentalRecords.splice(rentalRecordIndex, 1, action.payload);
      state.rentalRecords = currentRentalRecords;
    },
    addRentalRecord: (state, action: PayloadAction<RentalRecord>) => {
      const currentRentalRecords = [...state.rentalRecords];
      currentRentalRecords.push(action.payload);
      state.rentalRecords = filterUniqueByKey(currentRentalRecords, "id");
    },
    addRentalRecords: (state, action: PayloadAction<RentalRecord[]>) => {
      const currentRentalRecords = [...state.rentalRecords];
      currentRentalRecords.push(...action.payload);
      state.rentalRecords = filterUniqueByKey(currentRentalRecords, "id");
    },
    updateNewRentalRecord: (
      state,
      action: PayloadAction<Partial<RentalRecord>>
    ) => {
      state.newRentalRecord = { ...state.newRentalRecord, ...action.payload };
    },
    resetNewRentalRecord: (state) => {
      state.newRentalRecord = {
        createdDate: Date.now(),
        rentStarts: Date.now(),
        id: "",
        owner: "",
        property: "",
        rent: 0,
        rentPer: "year",
        tenant: "",
        status: "created",
      };
    },
    setRentalRecords: (state, action: PayloadAction<RentalRecord[]>) => {
      state.rentalRecords = action.payload;
    },
  },
});

export const {
  addRentalRecord,
  updateRentalRecord,
  deleteRentalRecord,
  setRentalRecords,
  updateNewRentalRecord,
  resetNewRentalRecord,
  addRentalRecords,
} = propertySlice.actions;

export const selectRentalRecords = (state: RootState) =>
  state.rentalRecord.rentalRecords;
export const selectNewRentalRecord = (state: RootState) =>
  state.rentalRecord.newRentalRecord;

export default propertySlice.reducer;
