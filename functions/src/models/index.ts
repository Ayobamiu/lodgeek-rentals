export type User = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  createdDate: number;
  photoURL?: string;
  lastUpdated: number;
  balance: number;
  directRemitance?: boolean;
  remittanceAccount?: string;
  defaultCompany?: string;
  userType?: UserType;
};
export enum UserType {
  "individual" = "individual",
  "company" = "company",
}

export type RentType = "month" | "year";

export type Property = {
  id: string;
  owner: string;
  company: string;
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
  company: string;
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
  company: string;
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
  rentReview = "rentReview",
  users = "users",
  userKYC = "userKYC",
  transaction = "transaction",
  bankReord = "bankReord",
  companies = "companies",
  companyUser = "companyUser",
  landlord = "landlord",
  invoice = "invoice",
  payment = "payment",
  payout = "payout",
  reminders = "reminders",
  notifications = "notifications",
}
export enum ReminderType {
  "3Months" = "3-months",
  "1Month" = "1-month",
  "1Week" = "1-week",
  "3Days" = "3-days",
  "1Day" = "1-day",
  "dDay" = "d-day",
}
export type Reminder = {
  id: string; // unique identifier for the reminder
  type: ReminderType; // type of the reminder
  reminderDate: number; // date when the reminder should be sent
  rentalRecordId: string; // ID of the rental record associated with the reminder
  propertyId: string; // ID of the property associated with the reminder
  companyId: string; // ID of the company associated with the reminder
  rentId: string; // ID of the rent associated with the reminder
  sent: boolean; // flag indicating whether the reminder has been sent
  dueDate: number; // Date the rent is due
};
export type Payout = {
  id: string;
  paymentId: string;
  type: "rent" | "invoice" | "others";
  amount: number;
  transactionFee: number;
  remittanceAccoundId: string;
  status: "pending" | "success" | "failed";
  eta: number;
  createdAt: number;
  paidAt: number;
  failedAt: number;
  companyId: string;
  paymentGateway: "paystack" | "others";
  errorMessage: string;
  owner: string;
};
export interface BankRecord {
  bank: PayStackBank;
  id: string;
  accountNumber: string;
  bankName: string;
  accountName: string;
  user: string;
  createdAt: number;
  updatedAt: number;
  company: string;
}
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
  receiptNumber: string;
  company?: string;
};
export type NotificationMessage = {
  id: string; // A unique identifier for the notification
  type: "email" | "sms" | "push"; // The type of notification (email, SMS, or push)
  title: string; // The title of the notification
  description: string; // The description of the notification
  icon?: string; // An optional icon to display with the notification
  image?: string; // An optional image to display with the notification
  link?: string; // An optional link for the notification
  sound?: string; // An optional sound to play with the notification
  recipientId: string; // An array of recipient IDs for the notification
  status: "pending" | "sent" | "delivered" | "read"; // The status of the notification
  timestamp: number; // The timestamp for when the notification was created
};
export type NotificationOrder = {
  title: string; // The title of the notification
  description: string; // The description of the notification
  icon?: string; // An optional icon to display with the notification
  image?: string; // An optional image to display with the notification
  link?: string; // An optional link for the notification
  sound?: string; // An optional sound to play with the notification
  recipientIDs: string[]; // An array of recipient IDs for the notification
};
