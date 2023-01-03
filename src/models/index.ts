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
export type Rent = {
  id: string;
  property: string;
  rentalRecord: string;
  dueDate: number;
  status: "upcoming" | "pending" | "paid" | "late";
  rent: number;
  rentPer: RentType;
};
