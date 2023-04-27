import moment from "moment";
import { ReceiptProps } from "../../models";

export function RentReceiptComponent({
  rentReceipt,
}: {
  rentReceipt: ReceiptProps | undefined;
}) {
  return (
    <div className="container mx-auto py-6 px-4">
      <div
        id="invoice_"
        className="relative m-0 text-[#001028] bg-white text-xs p-3"
      >
        <header className="invoice_clearfix">
          <div id="invoice_logo">
            <img src={rentReceipt?.propertyCompanyLogo} alt="Logo" />
          </div>

          <h1>Receipt from {rentReceipt?.propertyCompany}</h1>
          <div className="p-4 bg-gray-100 border-b border-b-[#5D6975]">
            <div>
              <strong>Received from</strong>: {rentReceipt?.receivedfrom}
            </div>
          </div>
          <div className="p-4 bg-gray-100 border-b border-b-[#5D6975]">
            <div>
              <strong>Paid to</strong>: {rentReceipt?.propertyCompany}
            </div>
          </div>
          <div className="p-4 bg-gray-100 border-b border-b-[#5D6975]">
            <div>
              <strong>Date</strong>: {moment(rentReceipt?.date).format("LL")}
            </div>
          </div>
          <div className="p-4 bg-gray-100 border-b border-b-[#5D6975]">
            <div>
              <strong>Receipt Number</strong>: {rentReceipt?.receiptNumber}
            </div>
          </div>
          <div className="p-4 bg-gray-100 border-b border-b-[#5D6975]">
            <div>
              <strong>Property</strong>: {rentReceipt?.property}
            </div>
          </div>
        </header>
        <main>
          <table>
            <thead>
              <tr>
                <th className="invoice_desc">DESCRIPTION</th>
                <th>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {rentReceipt?.payments.map((i, index) => (
                <tr key={index}>
                  <td className="invoice_desc">{i.description}</td>
                  <td className="invoice_unit">{i.amount}</td>
                </tr>
              ))}

              <tr>
                <td className="invoice_grand invoice_total">GRAND TOTAL</td>
                {rentReceipt && (
                  <td className="invoice_grand invoice_total">
                    {rentReceipt?.totalPaid}
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
