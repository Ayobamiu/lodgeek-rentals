import moment from "moment";
import { convertNumToWord } from "../../utils/convertNumToWord";
import formatPrice from "../../utils/formatPrice";
import { InvoiceReceipt } from "../../models";

export function InvoiceReceiptComponent({
  receiptData,
}: {
  receiptData: InvoiceReceipt | undefined;
}) {
  return (
    <div className="container mx-auto py-6 px-4">
      <div
        id="invoice_"
        className="relative m-0 text-[#001028] bg-white text-xs p-3"
      >
        <header className="invoice_clearfix">
          <div id="invoice_logo">
            <img src={receiptData?.senderCompanyLogo} alt="Logo" />
          </div>

          <h1>Receipt from {receiptData?.senderCompanyName}</h1>
          <div className="p-4 bg-gray-100 border-b border-b-[#5D6975]">
            <div>
              <strong>Received from</strong>: {receiptData?.customerCompanyName}
            </div>
          </div>
          <div className="p-4 bg-gray-100 border-b border-b-[#5D6975]">
            <div>
              <strong>Paid to</strong>: {receiptData?.senderCompanyName}
            </div>
          </div>
          <div className="p-4 bg-gray-100 border-b border-b-[#5D6975]">
            <div>
              <strong>Date</strong>:{" "}
              {moment(receiptData?.datePaid).format("LL")}
            </div>
          </div>
          <div className="p-4 bg-gray-100 border-b border-b-[#5D6975]">
            <div>
              <strong>Receipt Number</strong>: {receiptData?.receiptNumber}
            </div>
          </div>
        </header>
        <main>
          <table>
            <thead>
              <tr>
                <th className="invoice_desc">DESCRIPTION</th>
                <th>PRICE</th>
                <th>QTY</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {receiptData?.itemsPaid.map((i) => (
                <tr key={i.key}>
                  <td className="invoice_desc">{i.name}</td>
                  <td className="invoice_unit">{formatPrice(i.price)}</td>
                  <td className="invoice_qty"> {i.quantity}</td>
                  <td className="invoice_total">{formatPrice(i.amount)}</td>
                </tr>
              ))}

              <tr>
                <td colSpan={3} className="invoice_grand invoice_total">
                  GRAND TOTAL
                </td>
                {receiptData && (
                  <td className="invoice_grand invoice_total">
                    {formatPrice(receiptData?.amountPaid)}
                  </td>
                )}
              </tr>
              <tr>
                {receiptData && (
                  <td colSpan={4} className="invoice_grand invoice_total">
                    {convertNumToWord(
                      receiptData?.amountPaid,
                      receiptData?.currency
                    )}
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </main>
        <footer>
          Visit Lodgeek.com to learn more about our invoicing and accounting
          software.
        </footer>
      </div>
    </div>
  );
}
