import moment from "moment";
import { useMemo } from "react";
import { selectInvoice } from "../../app/features/invoiceSlice";
import { useAppSelector } from "../../app/hooks";
import { convertNumToWord } from "../../utils/convertNumToWord";
import formatPrice from "../../utils/formatPrice";

export function InvoicePrintTemplate() {
  const { currentInvoice } = useAppSelector(selectInvoice);
  const { subTotal, total } = useMemo(() => {
    const subTotal = currentInvoice.lineItems.reduce(
      (n, { price, quantity }) => n + price * quantity,
      0
    );
    return { subTotal, total: subTotal + currentInvoice.transactionFee };
  }, [currentInvoice.lineItems]);

  return (
    <div className="container mx-auto py-6 px-4">
      <div
        id="invoice_"
        className="relative m-0 text-[#001028] bg-white text-xs p-3"
      >
        <header className="invoice_clearfix">
          <div id="invoice_logo">
            <img src={currentInvoice.senderCompanyLogo} alt="Logo" />
          </div>
          <h1>{currentInvoice.invoiceNumber}</h1>
          <div id="invoice_company" className="invoice_clearfix">
            <div>{currentInvoice.senderCompanyName}</div>
            <div>{currentInvoice.senderCompanyAddress}</div>
            <div>{currentInvoice.senderCompanyPhone}</div>
            <div>
              <a href="mailto:company@example.com">
                {currentInvoice.senderCompanyEmail}
              </a>
            </div>
            <div>{currentInvoice.senderAdditionalInfo}</div>
          </div>
          <div id="invoice_project">
            <div>
              <span>CLIENT</span> {currentInvoice.customerCompanyName}
            </div>
            <div>
              <span>ADDRESS</span> {currentInvoice.customerCompanyAddress}
            </div>
            <div>
              <span>EMAIL</span>
              <a href={`mailto:${currentInvoice.customerCompanyEmail}`}>
                {currentInvoice.customerCompanyEmail}
              </a>
            </div>
            <div>
              <span>DATE</span> {moment(currentInvoice.date).format("LL")}
            </div>
            <div>
              <span>DUE DATE</span>{" "}
              {moment(currentInvoice.dueDate).format("LL")}
            </div>
            {currentInvoice.propertyName && (
              <div>
                <span>PROPERTY</span> {currentInvoice.propertyName}
              </div>
            )}
            <div>
              <span>OTHER INFO</span> {currentInvoice.customerAdditionalInfo}
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
              {currentInvoice.lineItems.map((i) => (
                <tr key={i.key}>
                  <td className="invoice_desc">{i.name}</td>
                  <td className="invoice_unit">{formatPrice(i.price)}</td>
                  <td className="invoice_qty"> {i.quantity}</td>
                  <td className="invoice_total">{formatPrice(i.amount)}</td>
                </tr>
              ))}

              <tr>
                <td colSpan={3}>SUBTOTAL</td>
                <td className="invoice_total">{formatPrice(subTotal)}</td>
              </tr>
              <tr>
                <td colSpan={3}>FEES</td>
                <td className="invoice_total">
                  {formatPrice(currentInvoice.transactionFee)}
                </td>
              </tr>
              <tr>
                <td colSpan={3} className="invoice_grand invoice_total">
                  GRAND TOTAL
                </td>
                <td className="invoice_grand invoice_total">
                  {formatPrice(total)}
                </td>
              </tr>
              <tr>
                <td colSpan={4} className="invoice_grand invoice_total">
                  {convertNumToWord(total, currentInvoice.currency)}
                </td>
              </tr>
            </tbody>
          </table>
          {currentInvoice.notes && (
            <div id="invoice_notices">
              <div>NOTICE:</div>
              <div className="invoice_notice">{currentInvoice.notes}</div>
            </div>
          )}
        </main>
        <footer>
          Visit Lodgeek.com to learn more about our invoicing and accounting
          software.
        </footer>
      </div>
    </div>
  );
}
