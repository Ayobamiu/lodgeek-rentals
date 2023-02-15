export type User = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  createdDate: number;
  photoURL?: string;
  lastUpdated: number;
  balance: number;
};
export type RentType = "month" | "year";

export type Property = {
  id: string;
  owner: string;
  title: string;
  description: string;
  address: string;
  location: string;
  rent: number;
  createdDate: number;
  rentPer: RentType;
};
export type AdditionalFee = {
  id: string;
  feeTitle: string;
  feeAmount: number;
  feeIsRequired: boolean;
  paid: boolean;
  paidOn: number;
};
export type RentalRecord = {
  id: string;
  property: string;
  tenant: string;
  rentInstruction: string;
  owner: string;
  createdDate: number;
  rentStarts: number;
  rent: number;
  rentPer: RentType;
  status:
    | "created"
    | "inviteSent"
    | "inviteAccepted"
    | "cancelled"
    | "inviteRejected";
  fees: AdditionalFee[];
  tenantAgreed: boolean;
  tenantAgreedOn: number;
  userKYC?: UserKYC;
};
export enum RentStatus {
  "Upcoming - Rent is not due for payment." = "upcoming",
  "Pending - Tenant has not started the rent." = "pending",
  "Paid - Rent has been paid." = "paid",
  "Late - Due date has passed and rent has not been paid." = "late",
}
export type Rent = {
  id: string;
  property: string;
  rentalRecord: string;
  dueDate: number;
  status: RentStatus;
  rent: number;
  rentPer: RentType;
  tenant: string;
  owner: string;
  sentAWeekReminder?: boolean;
  sentADayReminder?: boolean;
  sentFirstFailedRent?: boolean;
  sentSecondFailedRent?: boolean;
  sentThirdFailedRent?: boolean;
};
export type SimpleEmailProps = {
  title?: string;
  paragraphs: string[];
  buttons?: ButtonItemProps[];
};
export type ButtonItemProps = {
  text: string;
  link: string;
  color?: string | undefined;
};
export enum FirebaseCollections {
  properties = "properties",
  rentalRecords = "rentalRecords",
  mail = "mail",
  rents = "rents",
  users = "users",
  userKYC = "userKYC",
  transaction = "transaction",
}
export type UpdatePaidRentsProps = {
  rents: Rent[];
  rentalRecordId: string;
  owner: string;
  propertyTitle: string;
  tenantName: string;
  tenantEmail: string;
  selectedAdditionalFees: AdditionalFee[];
  rentalRecord: RentalRecord;
};
export type PayStackBank = {
  id: number;
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway: string;
  pay_with_bank: boolean;
  active: boolean;
  country: string;
  currency: string;
  type: string;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
};
export type MoneyTransaction = {
  id: string;
  description: string;
  amount: number;
  currency: string;
  createdAt: number;
  updatedAt: number;
  status: "success" | "failed" | "pending";
  type: "minus" | "plus";
  serviceFee: number;
  payer: string;
  payee: string;
};
export type YesOrNo = "yes" | "no";

export type RentOrOwn = "rent" | "own";

export type AcceptableIDs =
  | `Driver's License`
  | `Permanent Voter's Card`
  | `National Identification Number (NIN)`
  | `International Passport.`
  | `Residence/Work Permit (For Foreigners)`;

export type UserKYC = {
  id: string;
  user: string;
  idType: AcceptableIDs;
  meansOfId: string;
  moveInDate: number;
  tenantPhone: string;
  tenantCurrentAddress: string;
  readyToLeaveCurrentAddress: YesOrNo;
  currentResidenceType?: RentOrOwn;
  currentResidenceMoveInDate?: number;
  currentResidenceMoveOutDate?: number;
  currentResidenceOwner?: string;
  currentResidenceOwnerContact?: string;
  reasonForLeavingcurrentResidence?: string;
  currentEmployerName?: string;
  currentEmploymentPosition?: string;
  currentMonthlySalary?: number;
  emergencyContact: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactAddress: string;
  referee1Name: string;
  referee1Relationship: string;
  referee1Contact: string;
  referee1Email: string;
  referee1Occupation: string;
  referee1Address: string;
  referee2Name?: string;
  referee2Relationship?: string;
  referee2Contact?: string;
  referee2Email?: string;
  referee2Occupation?: string;
  referee2Address?: string;
  guarantorName: string;
  guarantorRelationship: string;
  guarantorContact: string;
  guarantorEmail: string;
  guarantorOccupation: string;
  guarantorAddress: string;
  beenEvictedBefore: YesOrNo;
  lastEvictionDate?: number;
  lastEvictionLocation?: string;
  associatedWithFelonyOrMisdemeanor: YesOrNo;
  felonyOrMisdemeanorDescription?: string;
  felonyOrMisdemeanorDate?: number;
};
