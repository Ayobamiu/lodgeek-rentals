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
export type RentalRecord = {
  id: string;
  property: string;
  tenant: string;
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
  transaction = "transaction",
}
export type UpdatePaidRentsProps = {
  rents: Rent[];
  rentalRecordId: string;
  owner: string;
  propertyTitle: string;
  tenantName: string;
  tenantEmail: string;
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
