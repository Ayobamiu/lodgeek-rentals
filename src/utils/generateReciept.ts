import { RecieptProps } from "../models";

export const generateReciept = (props: RecieptProps): string => {
  const {
    date,
    duePayments,
    payments,
    property,
    propertyCompany,
    receiptNumber,
    receivedfrom,
    totalPaid,
    extraComment,
    title,
    totalAmountDue,
    propertyCompanyLogo,
  } = props;

  const email = `

  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title || "Payment Receipt"}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 12px;
          line-height: 1.4;
        }
  
        .container {

          margin: 0 auto;
          padding: 20px;
          border: 2px solid #000;
        }
  
        h1 {
          font-size: 24px;
          margin-top: 0;
        }
  
        table {
          border-collapse: collapse;
          width: 100%;
        }
  
        table td,
        table th {
          padding: 8px;
          border: 1px solid #ddd;
        }
  
        table th {
          background-color: #f2f2f2;
        }
  
        .text-right {
          text-align: right;
        }

        .text-left {
          text-align: left;
        }
        .logo {
          max-width: 20px
        }
      </style>
    </head>
    <body>
      <div class="container" >
        ${
          propertyCompanyLogo
            ? `<img class="logo" src=${propertyCompanyLogo} alt=${propertyCompany} />`
            : ""
        }
        <h1>${title || "Receipt"}</h1>
        <p><strong>Received from:</strong> ${receivedfrom}</p>
        <p><strong>Property:</strong> ${property}</p>
        <p>
          <strong>Property Manager:</strong> ${propertyCompany}
        </p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Receipt Number:</strong> ${receiptNumber}</p>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
          ${payments.map(
            (payment) =>
              `<tr>
              <td>${payment.description}</td>
              <td class="text-right">${payment.amount}</td>
            </tr>`
          )}
          </tbody>
        </table>
        <p><strong>Total Paid:</strong> ${totalPaid}</p>
        ${
          duePayments.length > 0
            ? `
              <>
                <p><strong>Due Payments</strong></p>
                <table>
                  <thead>
                    <tr>
                      <th class="text-left">Description</th>
                      <th>Amount</th>
                      <th class="text-right">Due date</th>
                    </tr>
                  </thead>
                  <tbody>
                  ${duePayments.map(
                    (payment) =>
                      `
                      <tr>
                        <td class="text-left">${payment.description}</td>
                        <td>${payment.amount}</td>
                        <td class="text-right">${payment.dueDate}</td>
                      </tr>
                    `
                  )}
                  </tbody>
                </table>
                <p><strong>Total Amount Due:</strong> ${totalAmountDue}</p>
              </>
          `
            : ""
        }

        <p>
          ${extraComment}
        </p>
        <div class="p-10">
        <div><strong>Processed by:</strong></div>
          <div class="flex">
            <a href="${process.env.REACT_APP_BASE_URL}"
              ><small class="grey">Lodgeek Inc.</small></a
            >
          </div>
          <div class="flex">
            <small class="grey">Femi Coker Dr, Lekki, Lagos</small>
          </div>
        </div>
      </div>
    </body>
  </html>  
    `;

  return email;
};
