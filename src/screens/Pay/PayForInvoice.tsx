//@ts-nocheck
import React, { useEffect, useMemo, useState } from "react";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Button, message, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Invoice, InvoiceItem, InvoiceStatus } from "../../models";
import formatPrice from "../../utils/formatPrice";
import { TableRowSelection } from "antd/es/table/interface";
import { useNavigate, useParams } from "react-router-dom";
import { getInvoice } from "../../firebase/apis/invoice";
import FullScreenActivityIndicator from "../../components/shared/FullScreenActivityIndicator";
import LostPage from "../../components/shared/LostPage";
import moment from "moment";
import { usePaystackPayment } from "react-paystack";
import { PaystackProps } from "react-paystack/dist/types";
import { verifyInvoicePayment } from "../../functions/verifyInvoicePayment";

const columns: ColumnsType<InvoiceItem> = [
  {
    title: "Description",
    dataIndex: "name",
  },
  {
    title: "Price",
    dataIndex: "price",
    render: (value) => <a>{formatPrice(value)}</a>,
  },
  {
    title: "Qty",
    dataIndex: "quantity",
  },
  {
    title: "Total",
    dataIndex: "amount",
    render: (_, record) => (
      <a> {formatPrice(record.price * record.quantity)}</a>
    ),
  },
];

const PayForInvoice = () => {
  let { invoiceId } = useParams();
  const navigate = useNavigate();

  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([
    ...(currentInvoice?.lineItems.filter((i) => !i.paid).map((i) => i.key) ||
      []),
  ]);
  const [loadingInvoiceDetails, setLoadingInvoiceDetails] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"success" | "failed">();
  const [confirming, setConfirming] = useState(false);

  const config: PaystackProps = {
    reference: new Date().getTime().toString(),
    email: currentInvoice?.customerCompanyEmail || "",
    amount: ((currentInvoice?.amount || 0) + 200) * 100, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
    publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || "",
  };

  const onError:
    | ((reason: any) => void | PromiseLike<void>)
    | null
    | undefined = () => {
    setPaymentStatus("failed");
    setConfirming(false);
  };
  const onFinally = () => {
    setConfirming(false);
  };

  const verify = async (id: string) => {
    if (!currentInvoice) return message.error("Error verifying payment.");

    setConfirming(true);
    const updatedInvoice = await verifyInvoicePayment(
      id,
      currentInvoice,
      totalPay,
      totalDue,
      itemsPaid,
      itemsDue
    )
      .catch(onError)
      .finally(onFinally);
    if (updatedInvoice) {
      setCurrentInvoice(updatedInvoice);
    }
  };
  // you can call this function anything
  const onSuccess = (reference: any) => {
    verify(reference.reference);
  };

  // you can call this function anything
  const onClose = () => {};
  const initializePayment = usePaystackPayment(config);

  //load invoice docs
  useEffect(() => {
    (async () => {
      setLoadingInvoiceDetails(true);
      const invoice_ = await getInvoice(invoiceId as string).finally(() => {
        setLoadingInvoiceDetails(false);
      });
      if (invoice_) {
        setCurrentInvoice(invoice_);
        setSelectedRowKeys([
          ...(invoice_?.lineItems.filter((i) => !i.paid).map((i) => i.key) ||
            []),
        ]);
      }
    })();
  }, [invoiceId]);

  //Do caculations of totalPay, totalDue, itemsPaid, itemsDue based on selections
  const { totalPay, totalDue, itemsPaid, itemsDue } = useMemo(() => {
    const itemsPaid =
      currentInvoice?.lineItems.filter((i) =>
        selectedRowKeys.includes(i.key)
      ) || [];
    const allItemsDue =
      currentInvoice?.lineItems.filter(
        (i) => !selectedRowKeys.includes(i.key) && !i.paid
      ) || [];
    const total = itemsPaid.reduce(
      (n, { price, quantity }) => n + price * quantity,
      0
    );
    const totalDue = allItemsDue.reduce(
      (n, { price, quantity }) => n + price * quantity,
      0
    );
    return { totalPay: total, totalDue, itemsPaid, itemsDue: allItemsDue };
  }, [selectedRowKeys]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const hasSelected = selectedRowKeys.length > 0;
  const hasPaidItems =
    (currentInvoice?.lineItems.filter((i) => i.paid) || []).length > 0;

  const rowSelection: TableRowSelection<InvoiceItem> | undefined = {
    selectedRowKeys,
    onChange: onSelectChange,
    hideSelectAll: hasPaidItems,
    getCheckboxProps: (record: InvoiceItem) => ({
      disabled: record.paid, // Column configuration not to be checked
    }),
  };

  if (!loadingInvoiceDetails && !currentInvoice) return <LostPage />;
  return (
    <div>
      {(loadingInvoiceDetails || confirming) && <FullScreenActivityIndicator />}
      <div
        id="js-print-template"
        x-ref="printTemplate"
        className="container mx-auto py-6 px-4"
      >
        <div id="invoice_" className="w-auto " style={{ width: "auto" }}>
          <header className="invoice_clearfix">
            <div id="invoice_logo">
              <img src={currentInvoice?.senderCompanyLogo} alt="Logo" />
            </div>
            <h1>{currentInvoice?.invoiceNumber}</h1>
            <div id="invoice_company" className="invoice_clearfix">
              <div>{currentInvoice?.senderCompanyName}</div>
              <div>{currentInvoice?.senderCompanyAddress}</div>
              <div>{currentInvoice?.senderCompanyPhone}</div>
              <div>
                <a href="mailto:company@example.com">
                  {currentInvoice?.senderCompanyEmail}
                </a>
              </div>
              <div>{currentInvoice?.senderAdditionalInfo}</div>
            </div>
            <div id="invoice_project">
              <div>
                <span>CLIENT</span> {currentInvoice?.customerCompanyName}
              </div>
              <div>
                <span>ADDRESS</span> {currentInvoice?.customerCompanyAddress}
              </div>
              <div>
                <span>EMAIL</span>
                <a href={`mailto:${currentInvoice?.customerCompanyEmail}`}>
                  {currentInvoice?.customerCompanyEmail}
                </a>
              </div>
              <div>
                <span>DATE</span> {moment(currentInvoice?.date).format("LL")}
              </div>
              <div>
                <span>DUE DATE</span>{" "}
                {moment(currentInvoice?.dueDate).format("LL")}
              </div>
              {currentInvoice?.propertyName && (
                <div>
                  <span>PROPERTY</span> {currentInvoice?.propertyName}
                </div>
              )}
              <div>
                <span>OTHER INFO</span> {currentInvoice?.customerAdditionalInfo}
              </div>
            </div>
          </header>
        </div>

        <div className="bg-coolGray-100 p-4 flex items-center gap-x-2 my-5">
          <button
            onClick={() => {
              initializePayment(onSuccess, onClose);
            }}
            disabled={!hasSelected}
            type="button"
            className="disabled:bg-gray-500 disabled:cursor-not-allowed gap-x-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <FontAwesomeIcon icon={faCreditCard} />
            Pay for{" "}
            {selectedRowKeys.length === currentInvoice?.lineItems.length
              ? "All"
              : selectedRowKeys.length}{" "}
            items
          </button>
        </div>

        <Space direction="vertical">
          {currentInvoice?.status === InvoiceStatus.Paid && (
            <Alert
              message="Invoice Paid"
              description="This invoice has been paid and no further payment is required. Thank you for your prompt payment. If you have any questions or concerns, please do not hesitate to contact us."
              type="success"
              showIcon
              action={
                <>
                  <Button
                    onClick={() => {
                      navigate(`/`, { replace: true });
                    }}
                    type="link"
                    key="console"
                  >
                    Go Home
                  </Button>
                </>
              }
            />
          )}
          {paymentStatus === "success" && (
            <Alert
              message="Payment Successful"
              description="Thank you for your payment! Your invoice has been successfully processed. Please check your email for the payment receipt. If you have any questions or concerns, please do not hesitate to contact our customer support team."
              type="success"
              showIcon
              closable
            />
          )}
          {paymentStatus === "failed" && (
            <Alert
              message="Payment Failed"
              description="We're sorry, but there was an issue processing your payment for this invoice. Please double-check your payment information and try again. If you continue to experience difficulties, please contact our customer support team for assistance."
              type="error"
              showIcon
              closable
            />
          )}
          {currentInvoice?.status === InvoiceStatus.Overdue && (
            <Alert
              message="Invoice Overdue"
              description="We regret to inform you that your invoice is currently overdue. Please take immediate action to settle the outstanding balance to avoid any further delays or additional charges. If you have any questions or concerns, please don't hesitate to contact us. Thank you for your prompt attention to this matter."
              type="warning"
              showIcon
            />
          )}
        </Space>
        <div>
          <Table
            rowSelection={
              !currentInvoice?.acceptPartialPayment ? undefined : rowSelection
            }
            columns={columns}
            dataSource={currentInvoice?.lineItems}
            pagination={{ position: [] }}
            key="id"
          />
        </div>

        <div className="py-2 ml-auto mt-20 w-80">
          <div className="flex justify-between mb-3">
            <div className="text-gray-800 text-right flex-1">Sub total</div>
            <div className="text-right w-40">
              <div className="text-gray-800 font-medium" x-html="netTotal">
                {formatPrice(totalPay)}
              </div>
            </div>
          </div>
          <div className="flex justify-between mb-4">
            <div className="text-sm text-gray-600 text-right flex-1">Fees</div>
            <div className="text-right w-40">
              <div className="text-sm text-gray-600" x-html="totalGST">
                {formatPrice(200)}
              </div>
            </div>
          </div>

          <div className="py-2 border-t border-b">
            <div className="flex justify-between">
              <div className="text-xl text-gray-600 text-right flex-1">
                Total
              </div>
              <div className="text-right w-40">
                <div
                  className="text-xl text-gray-800 font-bold"
                  x-html="netTotal"
                >
                  {formatPrice(totalPay)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayForInvoice;
