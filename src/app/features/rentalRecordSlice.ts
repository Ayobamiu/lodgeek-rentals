import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RentalRecord, UserKYC } from "../../models";
import filterUniqueByKey from "../../utils/filterUniqueIds";
import { RootState } from "../store";

interface PropertyState {
  rentalRecords: RentalRecord[];
  newRentalRecord: RentalRecord;
  userKYC: UserKYC;
}

const initialNewRentalRecord: RentalRecord = {
  createdDate: Date.now(),
  rentStarts: Date.now(),
  id: "",
  owner: "",
  property: "",
  rent: 0,
  rentPer: "year",
  tenant: "",
  status: "created",
  fees: [],
  rentInstruction: "",
  tenantAgreed: false,
};
const initialUserKYC: UserKYC = {
  associatedWithFelonyOrMisdemeanor: "no",
  beenEvictedBefore: "no",
  emergencyContact: "",
  guarantorAddress: "",
  guarantorContact: "",
  guarantorEmail: "",
  guarantorName: "",
  guarantorOccupation: "",
  guarantorRelationship: "",
  id: "",
  idType: "National Identification Number (NIN)",
  meansOfId: "",
  moveInDate: Date.now(),
  readyToLeaveCurrentAddress: "yes",
  referee1Address: "",
  referee1Contact: "",
  referee1Email: "",
  referee1Name: "",
  referee1Occupation: "",
  referee1Relationship: "",
  tenantCurrentAddress: "",
  tenantPhone: "",
  user: "",
};
const initialState: PropertyState = {
  rentalRecords: [],
  newRentalRecord: initialNewRentalRecord,
  userKYC: initialUserKYC,
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
    updateUserKYC: (state, action: PayloadAction<Partial<UserKYC>>) => {
      state.userKYC = { ...state.userKYC, ...action.payload };
    },
    updateNewRentalRecord: (
      state,
      action: PayloadAction<Partial<RentalRecord>>
    ) => {
      state.newRentalRecord = { ...state.newRentalRecord, ...action.payload };
    },
    resetNewRentalRecord: (state) => {
      state.newRentalRecord = initialNewRentalRecord;
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
  updateUserKYC,
} = propertySlice.actions;

export const selectRentalRecords = (state: RootState) =>
  state.rentalRecord.rentalRecords;
export const selectNewRentalRecord = (state: RootState) =>
  state.rentalRecord.newRentalRecord;
export const selectUserKYC = (state: RootState) => state.rentalRecord.userKYC;

export default propertySlice.reducer;
