import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CompanyUser } from "../../models";
import filterUniqueByKey from "../../utils/filterUniqueIds";
import { initialCompanyUser } from "../initialValues";
import { RootState } from "../store";

interface UserState {
  companyUsers: CompanyUser[];
  currentCompanyUser: CompanyUser;
}

const initialState: UserState = {
  companyUsers: [],
  currentCompanyUser: initialCompanyUser,
};
export const companyUserSlice = createSlice({
  name: "companyUser",
  initialState,
  reducers: {
    setCurrentCompanyUser: (state, action: PayloadAction<CompanyUser>) => {
      state.currentCompanyUser = action.payload;
    },
    updateCurrentCompanyUser: (
      state,
      action: PayloadAction<Partial<CompanyUser>>
    ) => {
      state.currentCompanyUser = {
        ...state.currentCompanyUser,
        ...action.payload,
      };
    },
    resetCurrentCompanyUser: (state) => {
      state.currentCompanyUser = initialCompanyUser;
    },
    updateCompanyUser: (state, action: PayloadAction<CompanyUser>) => {
      const currentCompanyUsers = [...state.companyUsers];
      const companyUserIndex = currentCompanyUsers.findIndex(
        (i) => i.id === action.payload.id
      );
      currentCompanyUsers.splice(companyUserIndex, 1, action.payload);
      state.companyUsers = currentCompanyUsers;
    },
    deleteCompanyUser: (state, action: PayloadAction<CompanyUser>) => {
      const currentCompanyUsers = [...state.companyUsers];
      const companyUserIndex = currentCompanyUsers.findIndex(
        (i) => i.id === action.payload.id
      );
      currentCompanyUsers.splice(companyUserIndex, 1);
      state.companyUsers = currentCompanyUsers;
    },
    addCompanyUser: (state, action: PayloadAction<CompanyUser>) => {
      const currentUsers = [...state.companyUsers];
      currentUsers.unshift(action.payload);
      state.companyUsers = filterUniqueByKey(currentUsers, "email");
    },
    setCompanyUsers: (state, action: PayloadAction<CompanyUser[]>) => {
      state.companyUsers = action.payload;
    },
  },
});

export const {
  addCompanyUser,
  setCompanyUsers,
  setCurrentCompanyUser,
  updateCompanyUser,
  resetCurrentCompanyUser,
  updateCurrentCompanyUser,
  deleteCompanyUser,
} = companyUserSlice.actions;

export const selectCompanyUser = (state: RootState) => state.companyUser;

export default companyUserSlice.reducer;
