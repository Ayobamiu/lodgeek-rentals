import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { selectInvoice } from "../../app/features/invoiceSlice";
import { useAppSelector } from "../../app/hooks";
import InvoiceSettingsDrawer from "./InvoiceSettingsDrawer";
import { InvoicePrintTemplate } from "./InvoicePrintTemplate";
import { InvoiceEditor } from "./InvoiceEditor";
import useInvoice from "../../hooks/useInvoice";
import FullScreenActivityIndicator from "../../components/shared/FullScreenActivityIndicator";

function InvoiceBuilder() {
  const { currentInvoice } = useAppSelector(selectInvoice);
  const [openSettings, setOpenSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { saveInvoice, savingInvoice, updateSavedInvoice } = useInvoice();

  return (
    <div className="p-10">
      {savingInvoice && <FullScreenActivityIndicator />}
      <div className="flex justify-between items-start flex-wrap mb-6">
        <h2 className="text-2xl font-bold pb-2 tracking-wider uppercase">
          Invoice
        </h2>
        <Controls />
      </div>
      <div className="mx-auto max-w-5xl bg-white">
        <InvoiceSettingsDrawer
          open={openSettings}
          onClose={() => {
            setOpenSettings(false);
          }}
        />
        {showPreview ? <InvoicePrintTemplate /> : <InvoiceEditor />}
      </div>
    </div>
  );

  function Controls() {
    return (
      <div className="flex justify-between items-start gap-1">
        {currentInvoice.id ? (
          <button
            type="button"
            onClick={() => updateSavedInvoice()}
            className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
          >
            Update
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => saveInvoice("saveAndSend")}
              className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
            >
              Save and Send
            </button>
            <button
              type="button"
              onClick={() => saveInvoice("saveAsDraft")}
              className="text-white bg-green-300 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
            >
              Draft
            </button>
          </>
        )}

        <button
          onClick={() => {
            setShowPreview(!showPreview);
          }}
          className="text-gray-500 bg-gray-300 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
          title={showPreview ? "Edit" : "Preview"}
        >
          {showPreview ? "Edit" : "Preview"}
        </button>
        <button
          onClick={() => {
            setOpenSettings(true);
          }}
          className="text-gray-500 cursor-pointer w-10 h-10 rounded-full bg-gray-300 hover:bg-gray-300 inline-flex items-center justify-center"
        >
          <FontAwesomeIcon
            icon={faEllipsisV}
            className="icon icon-tabler icon-tabler-printer"
          />
        </button>
      </div>
    );
  }
}
export default InvoiceBuilder;
