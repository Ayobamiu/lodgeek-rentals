export enum UserType {
  "individual" = "individual",
  "company" = "company",
}

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
  fees: AdditionalFee[];
  tenantAgreed: boolean;
  tenantAgreedOn: number;
  userKYC?: UserKYC;
  remittanceAccount?: string; //id of bank record
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
  /**
   * Amount to pay per month or per year.
   */
  rent: number;
  /**
   * Frequency of the rent; "month" for monthly and "year" for yearly payment.
   */
  rentPer: RentType;
  tenant: string;
  owner: string;
  company: string;
  sentAWeekReminder?: boolean;
  sentADayReminder?: boolean;
  sentFirstFailedRent?: boolean;
  sentSecondFailedRent?: boolean;
  sentThirdFailedRent?: boolean;
  paidOn: number;
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
  bankReord = "bankReord",
  companies = "companies",
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
  receiptNumber: string;
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

export interface Bank {
  Code?: string;
  Id?: number;
  IsMicroFinanceBank?: boolean;
  IsMobileVerified?: boolean;
  Name: string;
  SwiftCode?: string;
  branches?: any;
}
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
export type TenantInviteProps = {
  rentalRecordData: RentalRecord;
  property?: Property;
  loggedInUser: User;
};
export type LodgeekNotification = {
  title?: string;
  description?: string;
  type: "info" | "success" | "warning" | "error" | "default";
  buttons?: {
    text: string;
    onClick?: () => void;
    type?: "button" | "link";
    link?: string;
  }[];
};

/** 
  * 
  * 1. Company Owners:
  Primary Owners can assign Company Owners. They have the same level of permissions as the Primary Owner, except they can’t delete or transfer ownership of a Company.
  2. Company Admins:
  Company Owners can assign Company Admins. They help manage members and can perform other administrative tasks.
  3. Regular members
  Members have access to use features in Lodgeek, except for those that are limited to only owners and admins.
*/
type CompanyRole = "owner" | "admin" | "regular";
type CompanyMember = {
  email: string;
  role: CompanyRole;
  dateJoined: number;
};

export type Company = {
  id: string;
  name: string;
  registrationNumber: string;
  address: string;
  phone: string;
  email: string;
  size: string;
  logo: string;
  createdBy: string;
  /**
   * Company Primary Owner:
    A Lodgeek Company has a single Primary Owner. Only this person can delete the Company or transfer ownership to someone else.
   */
  primaryOwner: string;
  createdAt: number;
  updatedAt: number;
  team: string[];
  members: CompanyMember[];
  remittanceAccount?: string;
  planCode?: string;
  subscriptionCode?: string;
  nextPaymentDate?: string;
};

export enum SettingsTab {
  profile = "profile",
  team = "team",
  billing = "billing",
}

type PayStackAuthorization = {
  account_name: string;
  authorization_code: string;
  bank: string;
  bin: string;
  brand: string;
  card_type: string;
  channel: string;
  country_code: string;
  exp_month: string;
  exp_year: string;
  last4: string;
  receiver_bank: string;
  receiver_bank_account_number: string;
  reusable: boolean;
  signature: string;
};

type PayStackPlan = {
  domain: string;
  name: string;
  plan_code: string;
  description: null;
  amount: number;
  interval: string;
  send_invoices: boolean;
  send_sms: boolean;
  hosted_page: false;
  hosted_page_url: null;
  hosted_page_summary: null;
  currency: string;
  id: number;
  integration: number;
  createdAt: string;
  updatedAt: string;
};

type PayStackCustomer = {
  first_name: string;
  last_name: string;
  email: string;
  phone: null;
  metadata: {
    photos: {
      type: string;
      typeId: string;
      typeName: string;
      url: string;
      isPrimary: false;
    }[];
  };
  domain: string;
  customer_code: string;
  id: number;
  integration: number;
  createdAt: string;
  updatedAt: string;
};

export type PayStackSubscription = {
  invoices: any[];
  customer: PayStackCustomer;
  plan: PayStackPlan;
  integration: number;
  authorization: PayStackAuthorization;
  domain: string;
  start: number;
  /**1. active: The subscription is currently active, and will be charged on the next payment date.
   * 2. non-renewing: The subscription is currently active, but we won't be charging it on the next payment date. This occurs when a subscription is about to be complete, or has been cancelled (but we haven't reached the next payment date yet).
   * 3. attention: The subscription is still active, but there was an issue while trying to charge the customer's card. The issue can be an expired card, insufficient funds, etc. We'll attempt charging the card again on the next payment date.
   * 4. completed: The subscription is complete, and will no longer be charged.
   * 5. cancelled: The subscription has been cancelled, and we'll no longer attempt to charge the card on the subscription.
   */
  status: "active" | "non-renewing" | "attention" | "completed" | "cancelled";
  quantity: 1;
  amount: number;
  subscription_code: string;
  email_token: string;
  easy_cron_id: null;
  cron_expression: string;
  next_payment_date: string;
  open_invoice: null;
  id: number;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
};
