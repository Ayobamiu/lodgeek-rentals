import { CompanyRole, RentalRecord, UserKYC } from "../models";

export const initialNewRentalRecord: RentalRecord = {
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
  tenantAgreedOn: -1,
  company: "",
  members: [],
};
export const initialUserKYC: UserKYC = {
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
  emergencyContactAddress: "",
  emergencyContactName: "",
  emergencyContactRelationship: "",
};

export const roleOptions = [
  {
    role: CompanyRole.regular,
    details: "Can only view the record.",
  },
  {
    role: CompanyRole.admin,
    details: "Can edit the record.",
  },
  {
    role: CompanyRole.owner,
    details: "Can edit the record, add and delete members.",
  },
];
