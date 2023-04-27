import { message, Modal, ModalFuncProps } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { sendEmail } from "../api/email";
import {
  selectSelectedCompany,
  setSelectedCompany,
  updateCompany,
} from "../app/features/companySlice";
import {
  addInvoice,
  deleteInvoice,
  selectInvoice,
  setInvoices,
  updateCurrentInvoice,
  updateInvoice,
} from "../app/features/invoiceSlice";
import { selectUser } from "../app/features/userSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { updateCompanyInDatabase } from "../firebase/apis/company";
import {
  createInvoice,
  deleteInvoiceFromDatabase,
  getInvoicesForCompany,
  updateInvoiceInDatabase,
} from "../firebase/apis/invoice";
import { generateFirebaseId } from "../firebase/config";
import {
  FirebaseCollections,
  Invoice,
  InvoiceStatus,
  PaymentCurrency,
  RecurringInvoiceStatus,
} from "../models";
import { generateInvoiceHTML } from "../utils/generateInvoiceHTML";
import { generateInvoiceNumber } from "../utils/generateInvoiceNumber";
import { htmlStringToImage } from "../utils/generateInvoicePDF";

const useInvoice = () => {
  const { currentInvoice } = useAppSelector(selectInvoice);
  const selectedCompany = useAppSelector(selectSelectedCompany);
  const loggedInUser = useAppSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [savingInvoice, setSavingInvoice] = useState(false);
  const { invoices } = useAppSelector(selectInvoice);
  let { invoiceId } = useParams();

  useEffect(() => {
    if (!invoices.length) {
      loadCompanyInvoices();
    }
  }, [selectedCompany?.id]);

  //Set invoice Number
  useEffect(() => {
    resetInvoice();
  }, [selectedCompany, loggedInUser]);

  const loadCompanyInvoices = async () => {
    if (selectedCompany?.id) {
      const invoicesList = await getInvoicesForCompany(selectedCompany?.id);
      dispatch(setInvoices(invoicesList));
    }
  };

  const { total, totalUnpaid } = useMemo(() => {
    const subTotal = currentInvoice.lineItems.reduce(
      (n, { price, quantity }) => n + price * quantity,
      0
    );
    const subTotalOfUnpaidItems = currentInvoice.lineItems
      .filter((i) => !i.paid)
      .reduce((n, { price, quantity }) => n + price * quantity, 0);
    return {
      subTotal,
      total: subTotal + currentInvoice.transactionFee,
      totalUnpaid: subTotalOfUnpaidItems + currentInvoice.transactionFee,
    };
  }, [currentInvoice.lineItems]);

  const invoiceStats = useMemo(() => {
    const sentInvoices = invoices.filter(
      (i) => i.status === InvoiceStatus.Sent
    );
    const paidInvoices = invoices.filter(
      (i) => i.status === InvoiceStatus.Paid
    );
    const unpaidInvoices = invoices.filter(
      (i) => i.status !== InvoiceStatus.Paid
    );
    const overDueInvoices = invoices.filter(
      (i) => i.status === InvoiceStatus.Overdue
    );

    return {
      paidInvoicesCount: paidInvoices.length,
      paidInvoicesAmount: paidInvoices.reduce((n, { amount }) => n + amount, 0),

      sentInvoicesCount: sentInvoices.length,
      sentInvoicesAmount: sentInvoices.reduce((n, { amount }) => n + amount, 0),
      unpaidInvoicesCount: unpaidInvoices.length,
      unpaidInvoicesAmount: unpaidInvoices.reduce(
        (n, { amount }) => n + amount,
        0
      ),
      overDueInvoicesCount: overDueInvoices.length,
      overDueInvoicesAmount: overDueInvoices.reduce(
        (n, { amount }) => n + amount,
        0
      ),
    };
  }, [invoices]);

  function resetInvoice() {
    if (invoiceId && !currentInvoice.id && selectedCompany) {
      return navigate(`/dashboard/${selectedCompany}/invoices`);
    }

    if (!currentInvoice.id) {
      const invoiceNumber = generateInvoiceNumber(
        selectedCompany?.name || "",
        selectedCompany?.numberOfInvoices || 0
      );
      dispatch(
        updateCurrentInvoice({
          invoiceNumber,
          senderCompanyAddress: selectedCompany?.address,
          senderCompanyLogo: selectedCompany?.logo,
          senderCompanyName: selectedCompany?.name,
          senderCompanyPhone: selectedCompany?.phone,
          senderCompanyEmail: selectedCompany?.email,
          currency: PaymentCurrency.NGN,
          remittanceAccount: selectedCompany?.remittanceAccount,
          senderName: `${loggedInUser?.firstName} ${loggedInUser?.lastName}`,
        })
      );
    }
  }

  const saveInvoice = async (type: "saveAsDraft" | "saveAndSend") => {
    if (!currentInvoice.customer) {
      return message.error("Select a client.");
    }

    if (!currentInvoice.customerCompanyAddress) {
      return message.error("Customer Address is required.");
    }
    if (!currentInvoice.senderCompanyName) {
      return message.error("Your Company Name is required.");
    }
    if (!currentInvoice.senderCompanyAddress) {
      return message.error("Your Company Address is required.");
    }
    if (!currentInvoice.remittanceAccount) {
      return message.error("Select a Remittance Account.");
    }
    if (!currentInvoice.lineItems.length) {
      return message.error("Add at least one item.");
    }

    setSavingInvoice(true);
    const invoiceUrl = await htmlStringToImage(
      generateInvoiceHTML(currentInvoice)
    );
    const newInvoice: Invoice = {
      ...currentInvoice,
      companyId: selectedCompany?.id || "",
      id: generateFirebaseId(FirebaseCollections.invoice),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      amount: total,
      balanceDue: total,
      status: type === "saveAndSend" ? InvoiceStatus.Sent : InvoiceStatus.Draft,
      url: invoiceUrl || "",
    };

    await createInvoice(newInvoice)
      .then(async () => {
        if (selectedCompany) {
          const numberOfInvoices = (selectedCompany.numberOfInvoices || 0) + 1;
          const updatedCompany = {
            ...selectedCompany,
            numberOfInvoices,
          };
          await updateCompanyInDatabase(updatedCompany).then(() => {
            dispatch(updateCompany(updatedCompany));
            dispatch(setSelectedCompany(updatedCompany));
          });
        }
        dispatch(addInvoice(newInvoice));
        if (type === "saveAndSend") {
          //Email recipient
          await sendInvoiceToClient(newInvoice, invoiceUrl);
          message.success("Invoice saved and sent to client.");
        } else {
          message.success("Invoice saved.");
        }

        navigate(`/dashboard/${selectedCompany?.id}/invoices`);
      })
      .finally(() => {
        setSavingInvoice(false);
      });
  };

  const updateSavedInvoice = async () => {
    if (!currentInvoice.customer) {
      return message.error("Select a client.");
    }

    if (!currentInvoice.customerCompanyAddress) {
      return message.error("Customer Address is required.");
    }
    if (!currentInvoice.senderCompanyName) {
      return message.error("Your Company Name is required.");
    }
    if (!currentInvoice.senderCompanyAddress) {
      return message.error("Your Company Address is required.");
    }
    if (!currentInvoice.remittanceAccount) {
      return message.error("Select a Remittance Account.");
    }
    if (!currentInvoice.lineItems.length) {
      return message.error("Add at least one item.");
    }
    setSavingInvoice(true);

    const invoiceUrl = await htmlStringToImage(
      generateInvoiceHTML(currentInvoice)
    );

    const updatedInvoice: Invoice = {
      ...currentInvoice,
      updatedAt: Date.now(),
      amount: total,
      balanceDue: totalUnpaid,
      url: invoiceUrl || "",
    };

    await updateInvoiceInDatabase(updatedInvoice)
      .then(async () => {
        dispatch(updateInvoice(updatedInvoice));
        message.success("Invoice updated.");
        navigate(`/dashboard/${selectedCompany?.id}/invoices`);
      })
      .finally(() => {
        setSavingInvoice(false);
      });
  };

  const deleteSavedInvoice = async (id: string) => {
    const config: ModalFuncProps = {
      title: "Delete Invoice!",
      content: "All data about this invoice will be lost.",
      okButtonProps: { className: "bg-blue-500", type: "primary" },
      onOk: async () => {
        await deleteInvoiceFromDatabase(id).then(() => {
          dispatch(deleteInvoice(id));
          message.success("Invoice deleted");
        });
      },
    };
    Modal.confirm(config);
  };

  const updateRecurringInvoiceStatus = async (
    invoice: Invoice,
    status: RecurringInvoiceStatus
  ) => {
    let title = "";
    let content = "";
    if (status === RecurringInvoiceStatus.Active) {
      title = "Resume Invoice's recurring process.";
      content =
        "The invoice will now regenerate at the set frequency. You can pause it at anytime.";
    }
    if (status === RecurringInvoiceStatus.Paused) {
      title = "Pause Invoice's recurring process.";
      content =
        "The invoice will not regenerate at the set frequency. You can resume it at anytime.";
    }
    if (status === RecurringInvoiceStatus.Cancelled) {
      title = "Cancel Invoice's recurring process.";
      content =
        "The invoice will not regenerate at the set frequency. You CANNOT resume it again.";
    }
    const config: ModalFuncProps = {
      title,
      content,
      okButtonProps: { className: "bg-blue-500", type: "primary" },
      onOk: async () => {
        const newInvoice: Invoice = {
          ...invoice,
          updatedAt: Date.now(),
          recurringInvoiceStatus: status,
        };

        await updateInvoiceInDatabase(newInvoice)
          .then(async () => {
            dispatch(updateInvoice(newInvoice));
            message.success("Invoice updated.");
          })
          .finally(() => {});
      },
    };
    Modal.confirm(config);
  };

  async function sendInvoiceToClient(
    newInvoice: Invoice,
    _invoiceUrl: string | null | undefined
  ) {
    const paymentLink = `${process.env.REACT_APP_BASE_URL}pay-for-invoice/${newInvoice.id}`;
    const emailSubject = `Invoice from ${newInvoice.senderCompanyName} - Payment Required`;
    const paragraphs = [
      `Dear ${newInvoice.customerName}`,
      `I hope this email finds you well. We're reaching out to let you know that your invoice has been created and is ready for payment.
              `,
      `You can access the invoice by clicking on the following link: <a href="${paymentLink}">Invoice link</a>. You will be able to view the details of the invoice, including the amount due and the due date.
              `,
      `To make a payment, please click on the payment link provided in the invoice or use the following link: <a href="${paymentLink}">Payment link</a>. Please note that payment is due by the due date indicated on the invoice.
              `,
      `If you have any questions or concerns about the invoice, please don't hesitate to contact us. We appreciate your prompt attention to this matter.
              `,

      `Thank you for choosing ${newInvoice.senderCompanyName} 
              `,
      `Best regards,`,
      `${newInvoice.senderName}`,
    ];

    const emailText = generateInvoiceHTML(newInvoice);

    await sendEmail(
      newInvoice.customerCompanyEmail,
      emailSubject,
      paragraphs.join(" \n"),
      emailText
    );
  }

  return {
    total,
    saveInvoice,
    savingInvoice,
    loadCompanyInvoices,
    invoiceStats,
    updateSavedInvoice,
    deleteSavedInvoice,
    updateRecurringInvoiceStatus,
    sendInvoiceToClient,
  };
};
export default useInvoice;
