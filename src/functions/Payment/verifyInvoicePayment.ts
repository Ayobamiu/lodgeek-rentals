import {
  Company,
  FirebaseCollections,
  Invoice,
  InvoiceItem,
  InvoiceReceipt,
  InvoiceStatus,
  MoneyTransaction,
  Payment,
  PaymentStatus,
  Payout,
} from "../../models";
import formatPrice from "../../utils/formatPrice";
import { updateInvoiceInDatabase } from "../../firebase/apis/invoice";
import axios from "axios";
import { generateFirebaseId } from "../../firebase/config";
import {
  getCompany,
  updateCompanyInDatabase,
} from "../../firebase/apis/company";
import { generateReceiptNumber } from "../../utils/generateInvoiceNumber";
import { generateReceiptEmailForInvoice } from "../../utils/generateReceiptForInvoice";
import { htmlStringToImage } from "../../utils/generateInvoicePDF";
import { sendEmail } from "../../api/email";
import { createPayment } from "../../firebase/apis/payment";
import { createTransaction } from "../../firebase/apis/transaction";
import { summarizeList } from "../../utils/summarizeList";
import moment from "moment";
import { createPayout } from "../../firebase/apis/payout";

export const verifyInvoicePayment = async (
  transactionReference: string,
  currentInvoice: Invoice,
  totalPay: number,
  totalDue: number,
  itemsPaid: InvoiceItem[],
  itemsDue: InvoiceItem[],
  transactionFee: number
) => {
  const options = {
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  };
  return await axios
    .get(
      `https://api.paystack.co/transaction/verify/${transactionReference}`,
      options
    )
    .then(async (transactionResponse) => {
      const data = transactionResponse.data.data;
      const authorization = transactionResponse.data.data.authorization;
      const company = await getCompany(currentInvoice.companyId);
      const receiptNumber = generateReceiptNumber(
        company?.name || "",
        company?.numberOfReceipts || 0
      );

      const paymentId = generateFirebaseId(FirebaseCollections.payment);
      //Add Invoice receipt
      const invoiceReceipt: InvoiceReceipt = {
        amountPaid: totalPay,
        // authorization,
        balanceDue: totalDue,
        datePaid: Date.now(),
        invoice: currentInvoice,
        itemsPaid,
        paymentMethod: data.channel,
        receiptNumber,
        itemsDue,
        paymentId,
        currency: data.currency,
        customerCompanyName: currentInvoice.customerName,
        senderCompanyLogo: currentInvoice.senderCompanyLogo,
        senderCompanyName: currentInvoice.senderCompanyName,
      };

      //Generate receipt
      const { emailForPayer, emailForReceiver } =
        generateReceiptEmailForInvoice(invoiceReceipt);
      let receiptUrl = await htmlStringToImage(emailForPayer);

      //Add payment
      const payment: Payment = {
        amount: totalPay,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        currency: data.currency,
        id: paymentId,
        invoiceId: currentInvoice.id,
        method: data.channel,
        status: PaymentStatus.Paid,
        completedAt: Date.now(),
        receiptUrl: receiptUrl || "",
        companyId: company.id,
        receiptData: invoiceReceipt,
        client: currentInvoice.customerName,
        clientEmail: currentInvoice.customerCompanyEmail,
        details: summarizeList(
          itemsPaid.map((i) => i.name),
          50
        ),
        forRent: false,
        propertyId: currentInvoice.propertyId,
        propertyName: currentInvoice.propertyName || "",
      };

      await createPayment(payment);

      //Add Transaction

      const transaction: MoneyTransaction = {
        amount: totalPay,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        currency: data.currency,
        description: currentInvoice?.invoiceNumber || "",
        id: generateFirebaseId(FirebaseCollections.transaction),
        payee: currentInvoice?.senderCompanyEmail,
        payer: currentInvoice?.customerCompanyEmail,
        receiptNumber: receiptNumber,
        serviceFee: 200,
        status: "success",
        type: "plus",
        company: company.id,
      };
      await createTransaction(transaction);

      const transactionForPayer: MoneyTransaction = {
        ...transaction,
        type: "minus",
      };
      await createTransaction(transactionForPayer);

      //Update invoice
      const updatedLineItems = currentInvoice.lineItems.map((i) => {
        if (itemsPaid.find((x) => x.key === i.key)) {
          const updatedItem: InvoiceItem = { ...i, paid: true };
          return updatedItem;
        } else {
          return i;
        }
      });

      const updatedInvoice: Invoice = {
        ...currentInvoice,
        lineItems: updatedLineItems,
        status: totalDue > 0 ? InvoiceStatus.Sent : InvoiceStatus.Paid,
        amountPaid: totalPay,
        balanceDue: totalDue,
        partialPayments: [
          ...currentInvoice.partialPayments,
          { amount: totalPay, date: Date.now(), paymentMethod: data.channel },
        ],
        paymentDate: Date.now(),
        updatedAt: Date.now(),
      };

      await updateInvoiceInDatabase(updatedInvoice).then(() => {
        //   setCurrentInvoice(updatedInvoice);
      });

      //Update company
      const updatedCompany: Company = {
        ...company,
        numberOfReceipts: (company?.numberOfReceipts || 0) + 1,
        balance: (company.balance || 0) + totalPay,
      };

      /* Add payout record */
      const remittanceAccount =
        currentInvoice.remittanceAccount || company.remittanceAccount || "";
      const payoutId = generateFirebaseId(FirebaseCollections.payout);
      const payout: Payout = {
        id: payoutId,
        amount: totalPay,
        companyId: company.id,
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
        type: "invoice",
      };

      await createPayout(payout);
      /* Add payout record */

      await updateCompanyInDatabase(updatedCompany);

      /* Send receipt email */
      const textForPayer = [
        "The payment details are as follows:",
        `Total - ${formatPrice(totalPay)}`,
      ];

      const emailSubjectForPayer = `Receipt from ${currentInvoice.senderCompanyName} [${receiptNumber}]`;
      const emailSubjectForReceiver = `Payment of ${formatPrice(
        totalPay
      )} from ${currentInvoice.customerName}`;

      await sendEmail(
        currentInvoice.customerCompanyEmail,
        emailSubjectForPayer,
        textForPayer.join(" \n"),
        emailForPayer
      );
      await sendEmail(
        currentInvoice.senderCompanyEmail,
        emailSubjectForReceiver,
        textForPayer.join(" \n"),
        emailForReceiver
      );
      return updatedInvoice;
    });
};
