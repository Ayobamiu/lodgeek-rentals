import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BankRecord } from "../../models";
import filterUniqueByKey from "../../utils/filterUniqueIds";
import { RootState } from "../store";

interface BankRecordState {
  bankRecords: BankRecord[];
}

const initialState: BankRecordState = {
  bankRecords: [],
};
export const bankRecordSlice = createSlice({
  name: "bankRecord",
  initialState,
  reducers: {
    deleteBankRecord: (state, action: PayloadAction<BankRecord>) => {
      const currentBankRecords = [...state.bankRecords];
      const bankRecordIndex = currentBankRecords.findIndex(
        (i) => i.id === action.payload.id
      );
      currentBankRecords.splice(bankRecordIndex, 1);
      state.bankRecords = currentBankRecords;
    },
    updateBankRecord: (state, action: PayloadAction<BankRecord>) => {
      const currentBankRecords = [...state.bankRecords];
      const bankRecordIndex = currentBankRecords.findIndex(
        (i) => i.id === action.payload.id
      );
      currentBankRecords.splice(bankRecordIndex, 1, action.payload);
      state.bankRecords = currentBankRecords;
    },
    addBankRecord: (state, action: PayloadAction<BankRecord>) => {
      const currentBankRecords = [...state.bankRecords];
      currentBankRecords.push(action.payload);
      state.bankRecords = filterUniqueByKey(currentBankRecords, "id");
    },
    setBankRecords: (state, action: PayloadAction<BankRecord[]>) => {
      state.bankRecords = action.payload;
    },
  },
});

export const {
  addBankRecord,
  deleteBankRecord,
  setBankRecords,
  updateBankRecord,
} = bankRecordSlice.actions;

export const selectBankRecords = (state: RootState) =>
  state.bankRecord.bankRecords;

export default bankRecordSlice.reducer;
