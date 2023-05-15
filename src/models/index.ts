import { WhereFilterOp } from "firebase/firestore";

export enum UserType {
  "individual" = "individual",
  "company" = "company",
}

export type rentReviewFrequencyType =
  | "yearly"
  | "bi-annually"
  | "every-5years"
  | "every-10years";
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
export enum RentType {
  "month" = "month",
  "year" = "year",
}
export enum propertyConditionType {
  "Fairly Used" = "Fairly Used",
  "Newly-Built" = "Newly-Built",
  "Old" = "Old",
  "Renovated" = "Renovated",
}
export enum propertyFurnishing {
  "Furnished" = "Furnished",
  "Semi-Furnished" = "Semi-Furnished",
  "Unfurnished" = "Unfurnished",
}

export type ImageCard = {
  size: number;
  type: string;
  name: string;
  url: string;
  id: string;
};

export type Property = {
  id: string;
  owner: string;
  title: string;
  company: string;
  description: string;
  address: string;
  location?: string;
  state: string;
  lga: string;
  images: ImageCard[];
  estateName?: string;
  propertyType: string;
  propertySize: string;
  condition: propertyConditionType;
  furnishing: propertyFurnishing;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  numberOfToilets: number;
  facilities: string[];
  createdDate: number;
  rent: number;
  rentPer: RentType;
  landLordFullName: string;
  landLordContactPhoneNumber: string;
  landLordEmailAddress: string;
  landLordMailingAddress: string;
  landLordEmergencyContactInformation: string;
  landLordTaxIdentificationNumber?: string;
  landLordPropertyManagementExperience?: string;
};
export type Landlord = {
  id: string;
  landLordFullName: string;
  landLordContactPhoneNumber: string;
  landLordEmailAddress: string;
  landLordMailingAddress: string;
  landLordEmergencyContactInformation: string;
  landLordTaxIdentificationNumber?: string;
  landLordPropertyManagementExperience?: string;
  company: string;
  photoUrl: string;
};
export type AdditionalFee = {
  id: string;
  feeTitle: string;
  feeAmount: number;
  feeIsRequired: boolean;
  paid: boolean;
  paidOn: number;
};
export type RentReviewRecord = {
  id: string;
  dateSubmitted: number;
  effectDate: number;
  leaseAgreement: string;
  rentIncreaseNotice: string;
  currentRentAmount: number;
  newRentAmount: number;
  reviewDate: number;
  reasonForReview: string;
  notes?: string;
};

export enum SignedTenancyAgreementStatus {
  "notSubmitted" = "Not Submited",
  "underReview" = "Under Review",
  "verified" = "Verified",
  "rejected" = "Rejected",
}

export enum SignedTenancyAgreementStatusColor {
  "Not Submited" = "gray",
  "Under Review" = "yellow",
  "Verified" = "green",
  "Rejected" = "red",
}
export enum SignedTenancyAgreementStatusType {
  "Not Submited" = "info",
  "Under Review" = "warning",
  "Verified" = "success",
  "Rejected" = "error",
}
export enum SignedTenancyAgreementStatusHelpText {
  "Not Submited" = "You haven't submitted your signed lease agreement yet. Please do so as soon as possible.",
  "Under Review" = "Your signed lease document is currently being reviewed. We'll notify you once it's been processed.",
  "Verified" = "Your signed lease documents have been verified and accepted. You can now proceed to pay rent.",
  "Rejected" = "Unfortunately, your signed lease document was rejected. Please check your email for instructions on how to upload an acceptable copy.",
}
export type RentalRecord = {
  id: string;
  property: string;
  unitNo?: string;
  tenant: string;
  rentInstruction: string;
  rentReviewFrequency: rentReviewFrequencyType;
  owner: string;
  company: string;
  createdDate: number;
  updatedDate?: number;
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
  team: string[];
  members: CompanyMember[];
  rentReviews: RentReviewRecord[];
  tenancyAgreementFile: string;
  signedTenancyAgreementFile: string;
  signedTenancyAgreementStatus: SignedTenancyAgreementStatus;
  reasonToRejectSignedTenancyAgreement: string;
  tenancyAgreementFileSignedOn: number;
};

export type ReveiwFormDetails = {
  address: string;
  unitNumber: string;
  tenantName: string;
  currentRentAmount: number;
  newRentAmount: number;
  reviewDate: number;
  reasonForReview: string;
  notes?: string;
};

export type RentReviewResponse = {
  user: string;
  message: string;
  date: number;
  id: string;
};

export enum RentReviewStatus {
  "opened" = "Opened",
  "reviewSent" = "Review Sent",
  "tenantResponded" = "Tenant Responded",
  "increaseAccepted" = "Increase Accepted",
  "increaseRejected" = "Increase Rejected",
}
export enum RentReviewStatusColor {
  "Opened" = "gray",
  "Review Sent" = "yellow",
  "Tenant Responded" = "blue",
  "Increase Accepted" = "green",
  "Increase Rejected" = "red",
}

export type RentReview = {
  id: string;
  property: string;
  tenant: string;
  owner: string;
  company: string;
  createdDate: number;
  acceptedOn: number;
  rejectedOn: number;
  status: RentReviewStatus;
  responses: RentReviewResponse[];
  reveiwFormDetails: ReveiwFormDetails;
  rentalRecord: string;
  rentIncreaseNotice: string;
  leaseAgreement: string;
};
export enum RentStatus {
  "Upcoming - Rent is not due for payment." = "upcoming",
  "Pending - Tenant has not started the rent." = "pending",
  "Paid - Rent has been paid." = "paid",
  "Late - Due date has passed and rent has not been paid." = "late",
}
export enum RentStatusColor {
  "upcoming" = "gray",
  "pending" = "yellow",
  "paid" = "green",
  "late" = "red",
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
export type ReceiptProps = {
  /**Title of the email. */
  title?: string;
  /**Customer who made payment: This can be the name of a company or tenant. */
  receivedfrom: string;
  /**Title of the property the fees are for. */
  property: string;
  /**Property manager in charge of the property: This can be the name of a company or an individual. */
  propertyCompany: string;
  /**Company logo. */
  propertyCompanyLogo?: string;
  /**Date of the transaction in this format February 19, 2023 */
  date: string;
  /**receiptNumber prop on the MoneyTransaction for this transaction e.g. 001234 */
  receiptNumber: string;
  /**List of payments made.
   * 1. Description: Describes the payment in details
   * 2. Amount: string format of the amount in this format N1,000,000
   */
  payments: {
    /**Describes the payment in details */
    description: string;
    /**String format of the amount in this format N1,000,000 */
    amount: string;
  }[];
  /**String format of the total amount paid in this format N1,000,000 */
  totalPaid: string;
  /**List of due payments and their due dates.
   * 1. Description: Describes the payment in details
   * 2. Amount: string format of the amount in this format N1,000,000
   * 3. Date: Due date of the payment in this format February 19, 2023
   */
  duePayments: {
    /**Describes the payment in details */
    description: string;
    /**String format of the amount in this format N1,000,000 */
    amount: string;
    /**Due date of the payment in this format February 19, 2023 */
    dueDate: string;
  }[];
  /**String format of the total due amount in this format N1,000,000 */
  totalAmountDue: string;
  /**Salutaions at the end of the receipt. Can include information about due payments */
  extraComment?: string;
  paymentId: string;
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
export type UpdatePaidRentsProps = {
  rents: Rent[];
  rentalRecordId: string;
  owner: string;
  propertyTitle: string;
  tenantName: string;
  tenantEmail: string;
  selectedAdditionalFees: AdditionalFee[];
  rentalRecord: RentalRecord;
  transactionFee: number;
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
  company?: string;
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
export enum CompanyRole {
  "owner" = "owner",
  "admin" = "admin",
  "regular" = "regular",
}
export type CompanyMember = {
  email: string;
  role: CompanyRole;
  dateJoined: number;
};
export type TeamMemberData = {
  userData?: User;
  memberData: CompanyMember;
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
  balance: number;
  directRemitance?: boolean;
  numberOfInvoices: number;
  numberOfReceipts: number;
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
/**
 * Used to filter documents.
 * @link https://googleapis.dev/nodejs/firestore/latest/CollectionReference.html#where
 */
export type WhereCriteria = {
  field: string;
  operation: WhereFilterOp;
  criteria: any;
};
export enum SubscriptionPlan {
  "Basic Plan" = "Basic Plan",
  "Free Plan" = "Free Plan",
  "Premium Plan" = "Premium Plan",
  "Pro Plan" = "Pro Plan",
}

type Customer = {
  email: string;
  name: string;
  photo?: string;
};

export enum InvoiceStatus {
  Draft = "draft",
  Sent = "sent",
  Paid = "paid",
  Overdue = "overdue",
}
export enum RecurringInvoiceStatus {
  Active = "active",
  Cancelled = "cancelled",
  Completed = "completed",
  Paused = "paused",
}

export enum InvoiceStatusColor {
  "draft" = "gray",
  "sent" = "blue",
  "paid" = "green",
  "overdue" = "red",
}
export enum RecurringInvoiceStatusColor {
  "completed" = "gray",
  "cancelled" = "red",
  "active" = "green",
  "paused" = "yellow",
}
export enum PaymentMethod {
  Bank = "bank",
  Card = "card",
  Cash = "cash",
  EFT = "eft",
  MobileMoney = "mobile_money",
  Other = "Other",
  QRCode = "qr",
  USSD = "ussd",
}
export enum InvoiceFrequency {
  "Weekly" = "weekly",
  "Every two weeks" = "biweekly",
  "Monthly" = "monthly",
  "Every two months" = "bimonthly",
  "Every three months" = "quarterly",
  "Every six months" = "biannually",
  "Annually" = "annually",
}

export type InvoiceItem = {
  key: string; // Name of the item or service being invoiced
  name: string; // Name of the item or service being invoiced
  price: number; // Price of the item or service being invoiced
  quantity: number; // Quantity of the item or service being invoiced
  amount: number; // Quantity of the item or service being invoiced
  paid: boolean;
};

export type PartialPayment = {
  date: number;
  amount: number;
  paymentMethod: string;
};

export type Invoice = {
  // attachments?: Attachment[];
  // paymentTerms: PaymentTerms;
  /**
   *  Bank where the invoice payment will be remitted
   */
  remittanceAccount: string; //id of bank record
  /**
   *  Total amount due on the invoice
   */
  amount: number;
  /**
   *  Whether partial payment is allowed
   */
  acceptPartialPayment: boolean;
  /**
   *  Total amount paid on the invoice
   */
  amountPaid: number;
  /**
   *  Total amount yet to be paid on the invoice i.e value for the sum of all payments made so far
   */
  balanceDue: number;
  /**
   * Array of partial payments
   */
  partialPayments: PartialPayment[];

  /**
   *  Date on which the invoice was created
   */
  createdAt: number;
  currency: PaymentCurrency;
  customer: Customer;
  customerName: string;
  customerCompanyName: string;
  customerCompanyAddress: string;
  customerCompanyPhone: string;
  customerCompanyEmail: string;
  customerAdditionalInfo: string;
  senderCompanyLogo: string;
  senderName: string;
  senderCompanyName: string;
  senderCompanyAddress: string;
  senderCompanyPhone: string;
  senderCompanyEmail: string;
  senderAdditionalInfo: string;
  /**
   *  ID of the company issueing the invoice
   */
  companyId: string;
  /**
   *  ID of the customer to whom the invoice is being issued
   */
  customerId: string;
  date: number;
  /**
   *  Description of the items or services being invoiced
   */
  description?: string;
  /**
   *  The total amount of discounts applied to the invoice.
   */
  discount: number;
  /**
   *  Date on which the invoice is due
   */
  dueDate?: number;
  /**
   *  End date of the recurring invoice (if applicable)
   */
  endDate?: number;
  /**
   *  Frequency of the recurring invoice (if applicable)
   */
  frequency: InvoiceFrequency;
  /**
   *  Unique ID of the invoice
   */
  id: string;
  /**
   *  Unique ID of the invoice by company
   */
  invoiceNumber: string;
  /**
   *  List of line items on the invoice
   */
  lineItems: InvoiceItem[];
  /**
   * Additional notes or comments about the invoice.
   */
  notes?: string;
  /**
   * The date the invoice was paid.
   */
  paymentDate?: number;
  /**
   *  Payment method used to pay the invoice (if applicable)
   */
  paymentMethod?: PaymentMethod;
  /**
   *  ID of the property for which the invoice is being issued
   */
  propertyId?: string;
  /**
   *  Name of the property for which the invoice is being issued
   */
  propertyName?: string;
  /**
   * The unique number assigned to the receipt generated for the invoice.
   */
  receiptNumber?: string;
  /**
   *  Indicates whether this is a recurring invoice
   */
  recurring: boolean;
  /**
   *  This indicates the status of the recurring invoice
   */
  recurringInvoiceStatus?: RecurringInvoiceStatus;
  /**
   * This shows when the next payment is due for the recurring invoice.
   */
  nextPaymentDate?: number;
  /**
   * The amount refunded for the invoice, if any.
   */
  refundedAmount?: number;
  /**
   *  Start date of the recurring invoice (if applicable)
   */
  startDate?: number;
  /**
   *  Status of the invoice
   */
  status: InvoiceStatus;
  /**
   * The total amount of the invoice before tax and discounts are applied.
   */
  subtotal: number;
  /**
   * The total amount of tax applied to the invoice.
   */
  tax: number;
  /**
   * The final amount of the invoice including tax and discounts.
   */
  total: number;
  /**
   * The fee charged for processing the payment transaction.
   */
  transactionFee: number;
  /**
   *  Reference number or transaction ID of the payment (if applicable)
   */
  transactionId?: string;
  /**
   *  Date on which the invoice was last updated
   */
  updatedAt: number;
  /**
   *  Invoice download url
   */
  url: string;
};

export type InvoiceReceipt = {
  invoice?: Invoice;
  amountPaid: number;
  balanceDue: number;
  datePaid: number;
  paymentMethod: PaymentMethod;
  itemsPaid: InvoiceItem[];
  authorization?: PayStackAuthorization;
  receiptNumber: string;
  itemsDue: InvoiceItem[];
  paymentId: string;
  currency: PaymentCurrency;
  senderCompanyLogo: string;
  senderCompanyName: string;
  customerCompanyName: string;
};
export enum PaymentStatus {
  Pending = "pending",
  Paid = "paid",
  Failed = "failed",
}

export enum PaymentCurrency {
  NGN = "NGN",
  USD = "USD",
  EUR = "EUR",
}

export type Payment = {
  id: string;
  invoiceId: string;
  amount: number;
  currency: PaymentCurrency;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  failureCode?: string;
  failureMessage?: string;
  receiptUrl: string;
  companyId: string;
  receiptData?: InvoiceReceipt;
  details: string;
  client: string;
  clientEmail: string;
  propertyName?: string;
  forRent: boolean;
  rentReceipt?: ReceiptProps;
  propertyId?: string;
  rentalRecordId?: string;
  category?: PaymentCategories;
};

export enum PaymentCategories {
  AmenitiesFees = "Amenities fees",
  ApplicationFees = "Application fees",
  CableTVFees = "Cable TV fees",
  CleaningFees = "Cleaning fees",
  FurnishingFees = "Furnishing fees",
  InsuranceFees = "Insurance fees",
  InternetFees = "Internet fees",
  KeyReplacementFees = "Key replacement fees",
  LateFees = "Late fees",
  LatePaymentCharges = "Late payment charges",
  LeaseBreakFee = "Lease break fee",
  MaintenanceFees = "Maintenance fees",
  MoveInFees = "Move-in fees",
  MoveOutFees = "Move-out fees",
  ParkingFees = "Parking fees",
  PestControlFees = "Pest control fees",
  PetFees = "Pet fees",
  Rent = "Rent",
  RepairsFees = "Repairs fees",
  SecurityDeposit = "Security deposit",
  SecuritySystemFees = "Security system fees",
  UtilityFees = "Utility fees",
  Other = "Other",
}

export enum CompanyUserRole {
  "admin" = "admin",
  "staff" = "staff",
  "customer" = "customer",
}
export enum CompanyUserStatus {
  "active" = "active",
  "inactive" = "inactive",
  "blocked" = "blocked",
}
export enum CompanyUserStatusColor {
  "active" = "green",
  "inactive" = "gray",
  "blocked" = "red",
}

export type CompanyUser = {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  phone: string;
  address: string;
  roles: CompanyUserRole[];
  status: CompanyUserStatus;
  createdAt: number;
  updatedAt: number;
  company: string;
  companyId: string;
  city: string;
  country: string;
  website: string;
  about: string;
  dob: number;
};
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
  dueDate: number; //Date the rent is due
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
