import { faEdit, faPrint, faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { message } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { selectSelectedCompany } from "../../app/features/companySlice";
import {
  selectInvoice,
  updateCurrentInvoice,
  updateInvoice,
} from "../../app/features/invoiceSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import DashboardWrapper from "../../components/dashboard/DashboardWrapper";
import ActivityIndicator from "../../components/shared/ActivityIndicator";
import { updateInvoiceInDatabase } from "../../firebase/apis/invoice";
import useInvoice from "../../hooks/useInvoice";
import { Invoice, InvoiceStatus } from "../../models";
import { InvoicePrintTemplate } from "./InvoicePrintTemplate";

const InvoiceDetails = () => {
  const { sendInvoiceToClient } = useInvoice();
  const { currentInvoice } = useAppSelector(selectInvoice);
  const selectedCompany = useAppSelector(selectSelectedCompany);

  const [sendingInvoice, setSendingInvoice] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.title = `${currentInvoice.senderCompanyName} - ${currentInvoice.invoiceNumber}`;
  }, [currentInvoice]);

  return (
    <DashboardWrapper>
      <div className="bg-coolGray-100 p-4 flex items-center gap-x-2 print:hidden ">
        <button
          type="button"
          onClick={async () => {
            setSendingInvoice(true);
            await sendInvoiceToClient(currentInvoice, currentInvoice.url)
              .then(async () => {
                if (currentInvoice.status === InvoiceStatus.Draft) {
                  const newInvoice: Invoice = {
                    ...currentInvoice,
                    updatedAt: Date.now(),
                    status: InvoiceStatus.Sent,
                  };

                  await updateInvoiceInDatabase(newInvoice).then(async () => {
                    dispatch(updateInvoice(newInvoice));
                    dispatch(updateCurrentInvoice(newInvoice));
                    message.success("Invoice updated.");
                  });
                }
                message.success("Invoice sent to client.");
              })
              .finally(() => {
                setSendingInvoice(false);
              });
          }}
          disabled={sendingInvoice}
          className="gap-x-2 disabled:bg-gray-400 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <FontAwesomeIcon icon={faShare} />
          Send {sendingInvoice && <ActivityIndicator size="4" />}
        </button>
        <button
          type="button"
          className="gap-x-2 text-white bg-coolGray-400 hover:bg-coolGray-800 focus:ring-4 focus:outline-none focus:ring-coolGray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-coolGray-600 dark:hover:bg-coolGray-700 dark:focus:ring-coolGray-800"
          onClick={() => {
            window.print();
          }}
        >
          <FontAwesomeIcon icon={faPrint} />
          Print
        </button>
        <Link
          to={`/dashboard/${selectedCompany?.id}/invoices/edit/${currentInvoice.id}`}
          className="ml-auto gap-x-2 text-white bg-coolGray-400 hover:bg-coolGray-800 focus:ring-4 focus:outline-none focus:ring-coolGray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-coolGray-600 dark:hover:bg-coolGray-700 dark:focus:ring-coolGray-800"
        >
          <FontAwesomeIcon icon={faEdit} />
          Edit
        </Link>
      </div>
      <InvoicePrintTemplate />
    </DashboardWrapper>
  );
};

export default InvoiceDetails;
