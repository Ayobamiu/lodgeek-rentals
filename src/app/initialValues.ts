import {
  CompanyRole,
  CompanyUser,
  CompanyUserStatus,
  Invoice,
  InvoiceFrequency,
  InvoiceStatus,
  PaymentCurrency,
  PaymentMethod,
  Property,
  propertyConditionType,
  propertyFurnishing,
  RentalRecord,
  RentReview,
  RentReviewStatus,
  RentType,
  SignedTenancyAgreementStatus,
  UserKYC,
} from "../models";

export const initialNewRentalRecord: RentalRecord = {
  createdDate: Date.now(),
  rentStarts: Date.now(),
  id: "",
  owner: "",
  property: "",
  rent: 0,
  rentPer: RentType.year,
  tenant: "",
  status: "created",
  fees: [],
  rentInstruction: "",
  tenantAgreed: false,
  tenantAgreedOn: -1,
  company: "",
  members: [],
  team: [],
  rentReviews: [],
  tenancyAgreementFile: "",
  signedTenancyAgreementFile: "",
  tenancyAgreementFileSignedOn: 0,
  signedTenancyAgreementStatus: SignedTenancyAgreementStatus["notSubmitted"],
  reasonToRejectSignedTenancyAgreement: "",
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
export const initialRentReview: RentReview = {
  company: "",
  createdDate: 0,
  id: "",
  owner: "",
  property: "",
  rentalRecord: "",
  responses: [],
  reveiwFormDetails: {
    address: "",
    currentRentAmount: 0,
    newRentAmount: 0,
    reasonForReview: "",
    reviewDate: 0,
    tenantName: "",
    unitNumber: "",
    notes: "",
  },
  status: RentReviewStatus.opened,
  tenant: "",
  leaseAgreement: "",
  rentIncreaseNotice: "",
  acceptedOn: 0,
  rejectedOn: 0,
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

export const initialNewProperty: Property = {
  address: "",
  company: "",
  condition: propertyConditionType["Fairly Used"],
  createdDate: Date.now(),
  description: "",
  facilities: [],
  furnishing: propertyFurnishing.Furnished,
  id: "",
  landLordContactPhoneNumber: "",
  landLordEmailAddress: "",
  landLordEmergencyContactInformation: "",
  landLordFullName: "",
  landLordMailingAddress: "",
  lga: "",
  numberOfBathrooms: 0,
  numberOfBedrooms: 0,
  numberOfToilets: 0,
  owner: "",
  propertySize: "",
  propertyType: "",
  rent: 0,
  rentPer: RentType.year,
  state: "",
  title: "",
  estateName: "",
  images: [],
  landLordPropertyManagementExperience: "",
  landLordTaxIdentificationNumber: "",
  location: "",
};

export const initialCompanyUser: CompanyUser = {
  address: "",
  company: "",
  companyId: "",
  createdAt: Date.now(),
  email: "",
  id: "",
  name: "",
  phone: "",
  roles: [],
  status: CompanyUserStatus.active,
  updatedAt: Date.now(),
  photoUrl: "",
  about: "",
  city: "",
  country: "",
  dob: 0,
  website: "",
};

export const initialInvoice: Invoice = {
  amount: 0,
  acceptPartialPayment: false,
  remittanceAccount: "",
  amountPaid: 0,
  balanceDue: 0,
  partialPayments: [],
  createdAt: Date.now(),
  currency: PaymentCurrency.NGN,
  customer: { name: "", email: "" },
  companyId: "",
  customerId: "",
  date: Date.now(),
  description: "",
  discount: 0,
  id: "",
  invoiceNumber: "",
  lineItems: [],
  notes: "",
  paymentDate: Date.now(),
  paymentMethod: PaymentMethod.Card,
  propertyId: "",
  recurring: false,
  refundedAmount: 0,
  status: InvoiceStatus.Draft,
  subtotal: 0,
  tax: 0,
  total: 0,
  transactionFee: 0,
  updatedAt: Date.now(),
  customerAdditionalInfo: "",
  customerCompanyAddress: "",
  customerCompanyName: "",
  customerCompanyEmail: "",
  customerCompanyPhone: "",
  customerName: "",
  senderAdditionalInfo: "",
  senderCompanyAddress: "",
  senderCompanyName: "",
  senderCompanyLogo: "",
  senderCompanyEmail: "",
  senderCompanyPhone: "",
  senderName: "",
  url: "",
  frequency: InvoiceFrequency.Monthly,
};
