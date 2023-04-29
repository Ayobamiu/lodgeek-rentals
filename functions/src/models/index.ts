export type User = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  createdDate: number;
  photoURL?: string;
  lastUpdated: number;
};
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
  users = "users",
  reminders = "reminders",
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
