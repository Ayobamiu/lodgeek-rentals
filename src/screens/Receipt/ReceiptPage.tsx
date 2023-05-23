import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InvoiceReceipt, Payment, ReceiptProps } from "../../models";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPayment } from "../../firebase/apis/payment";
import FullScreenActivityIndicator from "../../components/shared/FullScreenActivityIndicator";
import { InvoiceReceiptComponent } from "./InvoiceReceiptComponent";
import { RentReceiptComponent } from "./RentReceiptComponent";

const ReceiptPage = () => {
  const [receiptData, setReceiptData] = useState<InvoiceReceipt>();
  const [payment, setPayment] = useState<Payment>();
  const [rentReceipt, setRentReceipt] = useState<ReceiptProps>();
  const [loading, setLoading] = useState(false);
  let { paymentId } = useParams();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const payment = await getPayment(paymentId as string).finally(() => {
        setLoading(false);
      });
      if (payment) {
        setPayment(payment);
        setReceiptData(payment.receiptData);
        setRentReceipt(payment.rentReceipt);
      }
    })();
  }, [paymentId]);

  useEffect(() => {
    document.title = `Receipt - ${receiptData?.receiptNumber || ""}`;
  }, [receiptData]);

  return (
    <div>
      {loading && <FullScreenActivityIndicator />}
      <div className="bg-coolGray-100 p-4 flex items-center gap-x-2 print:hidden ">
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
      </div>

      {payment?.forRent ? (
        <RentReceiptComponent rentReceipt={rentReceipt} />
      ) : (
        <InvoiceReceiptComponent receiptData={receiptData} />
      )}
    </div>
  );
};

export default ReceiptPage;
