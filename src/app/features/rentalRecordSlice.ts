import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Company,
  Property,
  Rent,
  RentalRecord,
  TeamMemberData,
  User,
  UserKYC,
} from "../../models";
import filterUniqueByKey from "../../utils/filterUniqueIds";
import { initialNewRentalRecord, initialUserKYC } from "../initialValues";
import { RootState } from "../store";

interface RentalRecordState {
  rentalRecords: RentalRecord[];
  newRentalRecord: RentalRecord;
  userKYC: UserKYC;
  /* Current rental record being loaded on the Rental record details page */
  currentRentalRecord: RentalRecord;
  /* Members of the current rental record being loaded on the Rental record details page */
  currentRentalRecordMembers: TeamMemberData[];
  /* Company related the current rental record being loaded on the Rental record details page */
  currentRentalRecordCompany?: Company;
  /* Property related the current rental record being loaded on the Rental record details page */
  currentRentalRecordProperty?: Property;
  /* Owner of the current rental record being loaded on the Rental record details page */
  currentRentalRecordOwner?: User;
  /* tenant on the current rental record being loaded on the Rental record details page */
  currentRentalRecordTenant?: User;
  /* Rents on the current rental record being loaded on the Rental record details page */
  currentRentalRecordRents: Rent[];
}

const initialState: RentalRecordState = {
  rentalRecords: [],
  newRentalRecord: initialNewRentalRecord,
  currentRentalRecord: initialNewRentalRecord,
  userKYC: initialUserKYC,
  currentRentalRecordMembers: [],
  currentRentalRecordRents: [],
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
    setCurrentRentalRecord: (state, action: PayloadAction<RentalRecord>) => {
      state.currentRentalRecord = action.payload;
    },
    updateCurrentRentalRecord: (
      state,
      action: PayloadAction<Partial<RentalRecord>>
    ) => {
      state.currentRentalRecord = {
        ...state.currentRentalRecord,
        ...action.payload,
      };
    },
    resetCurrentRentalRecord: (state) => {
      state.currentRentalRecord = initialNewRentalRecord;
    },
    setRentalRecords: (state, action: PayloadAction<RentalRecord[]>) => {
      state.rentalRecords = action.payload;
    },
    setCurrentRentalRecordMembers: (
      state,
      action: PayloadAction<TeamMemberData[]>
    ) => {
      state.currentRentalRecordMembers = action.payload;
    },
    setCurrentRentalRecordCompany: (state, action: PayloadAction<Company>) => {
      state.currentRentalRecordCompany = action.payload;
    },
    setCurrentRentalRecordProperty: (
      state,
      action: PayloadAction<Property | undefined>
    ) => {
      state.currentRentalRecordProperty = action.payload;
    },
    setCurrentRentalRecordOwner: (
      state,
      action: PayloadAction<User | undefined>
    ) => {
      state.currentRentalRecordOwner = action.payload;
    },
    setCurrentRentalRecordTenant: (
      state,
      action: PayloadAction<User | undefined>
    ) => {
      state.currentRentalRecordTenant = action.payload;
    },
    setCurrentRentalRecordRents: (state, action: PayloadAction<Rent[]>) => {
      state.currentRentalRecordRents = action.payload;
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
  resetCurrentRentalRecord,
  setCurrentRentalRecord,
  updateCurrentRentalRecord,
  setCurrentRentalRecordMembers,
  setCurrentRentalRecordCompany,
  setCurrentRentalRecordProperty,
  setCurrentRentalRecordOwner,
  setCurrentRentalRecordTenant,
  setCurrentRentalRecordRents,
} = propertySlice.actions;

export const selectRentalRecord = (state: RootState) => state.rentalRecord;
export const selectRentalRecords = (state: RootState) =>
  state.rentalRecord.rentalRecords;
export const selectNewRentalRecord = (state: RootState) =>
  state.rentalRecord.newRentalRecord;
export const selectCurrentRentalRecord = (state: RootState) =>
  state.rentalRecord.currentRentalRecord;
export const selectCurrentRentalRecordMembers = (state: RootState) =>
  state.rentalRecord.currentRentalRecordMembers;
export const selectUserKYC = (state: RootState) => state.rentalRecord.userKYC;
export const selectCurrentRentalRecordCompany = (state: RootState) =>
  state.rentalRecord.currentRentalRecordCompany;

export default propertySlice.reducer;
