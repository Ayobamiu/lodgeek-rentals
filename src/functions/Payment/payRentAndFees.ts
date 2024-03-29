import {
  collection,
  doc,
  getDoc,
  setDoc,
  writeBatch,
  updateDoc,
} from "firebase/firestore";
import moment from "moment";
import { toast } from "react-toastify";
import { sendEmail } from "../../api/email";
import {
  db,
  generateFirebaseId,
  RENT_PATH,
  transactionRef,
} from "../../firebase/config";
import {
  Company,
  FirebaseCollections,
  MoneyTransaction,
  Payment,
  PaymentCurrency,
  PaymentMethod,
  PaymentStatus,
  Payout,
  ReceiptProps,
  Rent,
  RentalRecord,
  RentStatus,
  UpdatePaidRentsProps,
} from "../../models";
import formatPrice from "../../utils/formatPrice";
import { generateReceipt } from "../../utils/generateReceipt";
import { createPayment } from "../../firebase/apis/payment";
import { getTransactionDescriptionAndAmount } from "../../hooks/getTransactionDescriptionAndAmount";
import { generateReceiptNumber } from "../../utils/generateInvoiceNumber";
import { updateCompanyInDatabase } from "../../firebase/apis/company";
import { createPayout } from "../../firebase/apis/payout";
import { sendWebNotification } from "../../api/webNotification";

export async function payRentAndFees(props: UpdatePaidRentsProps) {
  const {
    propertyTitle,
    rents,
    tenantName,
    tenantEmail,
    selectedAdditionalFees,
    rentalRecord,
    transactionFee,
  } = props;

  const rentBatch = writeBatch(db);

  //Update fees statuses to paid
  if (selectedAdditionalFees.length > 0) {
    const fees = rentalRecord.fees.map((i) => {
      if (selectedAdditionalFees.findIndex((x) => x.id === i.id) > -1) {
        return { ...i, paid: true, paidOn: Date.now() };
      } else {
        return i;
      }
    });
    const updatedRentalRecord: RentalRecord = {
      ...rentalRecord,
      fees,
      updatedDate: Date.now(),
    };
    const thisRentalRecordRef = doc(
      db,
      FirebaseCollections.rentalRecords,
      updatedRentalRecord.id
    );
    await updateDoc(thisRentalRecordRef, updatedRentalRecord).catch(() => {});
  }

  //Update rents statuses to paid
  rents.forEach((rentdoc) => {
    var docRef = doc(collection(db, RENT_PATH), rentdoc.id);
    const rentData: Rent = {
      ...rentdoc,
      status: RentStatus["Paid - Rent has been paid."],
      paidOn: Date.now(),
    };
    rentBatch.update(docRef, rentData);
  });

  const propertyCompanyRef = doc(
    db,
    FirebaseCollections.companies,
    rentalRecord.company
  );
  const propertyCompanyDocSnap = await getDoc(propertyCompanyRef);
  const propertyCompany = propertyCompanyDocSnap.data() as Company;
  const receiptNumber = generateReceiptNumber(
    propertyCompany.name || "",
    propertyCompany.numberOfReceipts || 0
  );
  const updatedCompany: Company = {
    ...propertyCompany,
    numberOfReceipts: (propertyCompany?.numberOfReceipts || 0) + 1,
  };

  await updateCompanyInDatabase(updatedCompany);

  rentBatch.commit().catch(() => {
    toast.error("Error Updating Rents.");
  });

  var { transactionDescription, totalAmount } =
    getTransactionDescriptionAndAmount(
      rents,
      selectedAdditionalFees,
      tenantName,
      propertyTitle
    );

  /* Start: Add transaction for tenant and property company i.e landlord */
  const transactionForLandlordId = generateFirebaseId(
    FirebaseCollections.transaction
  );
  const transactionForTenantId = generateFirebaseId(
    FirebaseCollections.transaction
  );

  const transactionData: MoneyTransaction = {
    id: transactionForLandlordId,
    payer: tenantEmail,
    amount: totalAmount,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    currency: "NGN",
    description: transactionDescription,
    payee: propertyCompany.email,
    serviceFee: 0,
    status: "success",
    type: "plus",
    receiptNumber: receiptNumber,
    company: rentalRecord.company,
  };

  //Record credit transaction for property company i.e landlord
  await setDoc(doc(transactionRef, transactionForLandlordId), transactionData);

  //Record debit transaction for tenant
  await setDoc(doc(transactionRef, transactionForTenantId), {
    ...transactionData,
    type: "minus",
    id: transactionForTenantId,
  });

  const payments = [
    ...rents.map((rent) => {
      return {
        description: `Rent for ${moment(rent.dueDate).format(
          "MMM YYYY"
        )} - ${moment(rent.dueDate).add(1, rent.rentPer).format("MMM YYYY")}`,
        amount: formatPrice(rent.rent),
      };
    }),
    ...selectedAdditionalFees.map((fee) => {
      return {
        description: fee.feeTitle,
        amount: formatPrice(fee.feeAmount),
      };
    }),
  ];
  const paymentId = generateFirebaseId(FirebaseCollections.payment);
  const rentReceipt: ReceiptProps = {
    date: moment().format("LL"),
    duePayments: [],
    payments: payments,
    property: propertyTitle,
    propertyCompany: propertyCompany.name,
    receiptNumber: receiptNumber,
    receivedfrom: tenantName,
    totalAmountDue: "",
    totalPaid: formatPrice(totalAmount),
    extraComment: "",
    title: "",
    propertyCompanyLogo: propertyCompany.logo,
    paymentId,
  };
  /*Ends: Add transaction for tenant and property company i.e landlord */
  const { emailForTenant, emailForReceiver } = generateReceipt(rentReceipt);

  /* Add payment record */

  const payment: Payment = {
    amount: totalAmount,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    currency: PaymentCurrency.NGN,
    id: paymentId,
    invoiceId: "",
    method: PaymentMethod.Card,
    status: PaymentStatus.Paid,
    completedAt: Date.now(),
    receiptUrl: "",
    companyId: propertyCompany.id,
    client: tenantName,
    clientEmail: tenantEmail,
    details: transactionDescription,
    forRent: true,
    rentReceipt,
    propertyId: rentalRecord.property,
    propertyName: propertyTitle,
    rentalRecordId: rentalRecord.id,
  };

  await createPayment(payment);
  /* Add payment record */

  /* Add payout record */
  const remittanceAccount =
    rentalRecord.remittanceAccount || propertyCompany.remittanceAccount || "";
  const payoutId = generateFirebaseId(FirebaseCollections.payout);
  const payout: Payout = {
    id: payoutId,
    amount: totalAmount,
    companyId: propertyCompany.id,
    createdAt: Date.now(),
    errorMessage: "",
    eta: moment().add(3, "hour").toDate().getTime(),
    failedAt: 0,
    paidAt: 0,
    paymentGateway: "paystack",
    paymentId,
    remittanceAccoundId: remittanceAccount,
    status: "pending",
    transactionFee,
    type: "rent",
  };

  await createPayout(payout);
  /* Add payout record */

  const paragraphsForLandlord = [
    "The payment details are as follows:",
    `Tenant: ${tenantName}`,
    `Property: ${propertyTitle}`,
    `Total - ${formatPrice(totalAmount)}`,
    "Click on the link below to view rent details.",
  ];

  const paragraphsForTenant = [
    "The payment details are as follows:",
    `Property: ${propertyTitle}`,
    `Total - ${formatPrice(totalAmount)}`,
  ];

  const emailSubjectForPayer = `Receipt from ${propertyCompany.name} [${receiptNumber}]`;
  const emailSubjectForReceiver = `Payment of ${formatPrice(
    totalAmount
  )} from ${tenantName} [${receiptNumber}]`;
  if (tenantEmail) {
    await sendEmail(
      tenantEmail,
      emailSubjectForPayer,
      paragraphsForTenant.join(" \n"),
      emailForTenant
    );
  }

  if (propertyCompany.email) {
    await sendEmail(
      propertyCompany.email,
      emailSubjectForReceiver,
      paragraphsForLandlord.join(" \n"),
      emailForReceiver
    ).then(() => {
      toast.success("Payment was successfully obtained.");
    });
    sendWebNotification({
      title: emailSubjectForReceiver,
      description: emailSubjectForReceiver,
      recipientIDs: [
        propertyCompany.primaryOwner,
        ...propertyCompany.team,
        propertyCompany.email,
      ],
    });
  }

  return payment;
}
