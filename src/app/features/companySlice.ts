import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Company, CompanyMember, TeamMemberData, User } from "../../models";
import filterUniqueByKey from "../../utils/filterUniqueIds";
import { RootState } from "../store";

interface CompanyState {
  companies: Company[];
  selectedCompany?: Company;
  selectedCompanyTeamMembers?: TeamMemberData[];
}

const initialState: CompanyState = {
  companies: [],
};
export const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    deleteCompany: (state, action: PayloadAction<Company>) => {
      const currentCompanies = [...state.companies];
      const companyIndex = currentCompanies.findIndex(
        (i) => i.id === action.payload.id
      );
      currentCompanies.splice(companyIndex, 1);
      state.companies = currentCompanies;
    },
    updateCompany: (state, action: PayloadAction<Company>) => {
      const currentCompanies = [...state.companies];
      const companyIndex = currentCompanies.findIndex(
        (i) => i.id === action.payload.id
      );
      currentCompanies.splice(companyIndex, 1, action.payload);
      state.companies = currentCompanies;
    },
    addCompany: (state, action: PayloadAction<Company>) => {
      const currentCompanies = [...state.companies];
      currentCompanies.push(action.payload);
      state.companies = filterUniqueByKey(currentCompanies, "id");
    },
    setCompanies: (state, action: PayloadAction<Company[]>) => {
      state.companies = action.payload;
    },
    setSelectedCompany: (state, action: PayloadAction<Company>) => {
      state.selectedCompany = action.payload;
    },
    setSelectedCompanyMembers: (
      state,
      action: PayloadAction<TeamMemberData[]>
    ) => {
      state.selectedCompanyTeamMembers = action.payload;
    },
  },
});

export const {
  addCompany,
  deleteCompany,
  setCompanies,
  updateCompany,
  setSelectedCompany,
  setSelectedCompanyMembers,
} = companySlice.actions;

export const selectCompanies = (state: RootState) => state.company.companies;
export const selectSelectedCompany = (state: RootState) =>
  state.company.selectedCompany;
export const selectSelectedCompanyMembers = (state: RootState) =>
  state.company.selectedCompanyTeamMembers;

export default companySlice.reducer;
