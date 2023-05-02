import moment from "moment";
import { Invoice } from "../models";
import formatPrice from "./formatPrice";

export const generateInvoiceHTML = (currentInvoice: Invoice): string => {
  const paymentLink = `${process.env.REACT_APP_BASE_URL}pay-for-invoice/${currentInvoice.id}`;

  const basicInvoiceHtml = `
   <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
 <html
   xmlns="http://www.w3.org/1999/xhtml"
   xmlns="http://www.w3.org/1999/xhtml"
   style="color-scheme: light dark; supported-color-schemes: light dark"
 >
   <head>
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
     <meta name="x-apple-disable-message-reformatting" />
     <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
     <meta name="color-scheme" content="light dark" />
     <meta name="supported-color-schemes" content="light dark" />
     <title>
       Invoice from ${currentInvoice.senderCompanyName} - Payment Required
     </title>
     <style type="text/css" rel="stylesheet" media="all">
       /* Base ------------------------------ */
 
       @import url("https://fonts.googleapis.com/css?family=Nunito+Sans:400,700&amp;display=swap");
       body {
         width: 100% !important;
         height: 100%;
         margin: 0;
         -webkit-text-size-adjust: none;
       }
 
       a {
         color: #3869d4;
       }
 
       a img {
         border: none;
       }
 
       td {
         word-break: break-word;
       }
 
       .preheader {
         display: none !important;
         visibility: hidden;
         mso-hide: all;
         font-size: 1px;
         line-height: 1px;
         max-height: 0;
         max-width: 0;
         opacity: 0;
         overflow: hidden;
       }
       /* Type ------------------------------ */
 
       body,
       td,
       th {
         font-family: "Nunito Sans", Helvetica, Arial, sans-serif;
       }
 
       h1 {
         margin-top: 0;
         color: #333333;
         font-size: 22px;
         font-weight: bold;
         text-align: left;
       }
 
       h2 {
         margin-top: 0;
         color: #333333;
         font-size: 16px;
         font-weight: bold;
         text-align: left;
       }
 
       h3 {
         margin-top: 0;
         color: #333333;
         font-size: 14px;
         font-weight: bold;
         text-align: left;
       }
 
       td,
       th {
         font-size: 16px;
       }
 
       p,
       ul,
       ol,
       blockquote {
         margin: 0.4em 0 1.1875em;
         font-size: 16px;
         line-height: 1.625;
       }
 
       p.sub {
         font-size: 13px;
       }
       /* Utilities ------------------------------ */
 
       .align-right {
         text-align: right;
       }
 
       .align-left {
         text-align: left;
       }
 
       .align-center {
         text-align: center;
       }
 
       .u-margin-bottom-none {
         margin-bottom: 0;
       }
       /* Buttons ------------------------------ */
 
       .button {
         background-color: #3869d4;
         border-top: 10px solid #3869d4;
         border-right: 18px solid #3869d4;
         border-bottom: 10px solid #3869d4;
         border-left: 18px solid #3869d4;
         display: inline-block;
         color: #fff;
         text-decoration: none;
         border-radius: 3px;
         box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16);
         -webkit-text-size-adjust: none;
         box-sizing: border-box;
       }
 
       .button--green {
         background-color: #22bc66;
         border-top: 10px solid #22bc66;
         border-right: 18px solid #22bc66;
         border-bottom: 10px solid #22bc66;
         border-left: 18px solid #22bc66;
       }
 
       .button--red {
         background-color: #ff6136;
         border-top: 10px solid #ff6136;
         border-right: 18px solid #ff6136;
         border-bottom: 10px solid #ff6136;
         border-left: 18px solid #ff6136;
       }
 
       @media only screen and (max-width: 500px) {
         .button {
           width: 100% !important;
           text-align: center !important;
         }
       }
       /* Attribute list ------------------------------ */
 
       .attributes {
         margin: 0 0 21px;
       }
 
       .attributes_content {
         background-color: #f4f4f7;
         padding: 16px;
       }
 
       .attributes_item {
         padding: 0;
       }
       /* Related Items ------------------------------ */
 
       .related {
         width: 100%;
         margin: 0;
         padding: 25px 0 0 0;
         -premailer-width: 100%;
         -premailer-cellpadding: 0;
         -premailer-cellspacing: 0;
       }
 
       .related_item {
         padding: 10px 0;
         color: #cbcccf;
         font-size: 15px;
         line-height: 18px;
       }
 
       .related_item-title {
         display: block;
         margin: 0.5em 0 0;
       }
 
       .related_item-thumb {
         display: block;
         padding-bottom: 10px;
       }
 
       .related_heading {
         border-top: 1px solid #cbcccf;
         text-align: center;
         padding: 25px 0 10px;
       }
       /* Discount Code ------------------------------ */
 
       .discount {
         width: 100%;
         margin: 0;
         padding: 24px;
         -premailer-width: 100%;
         -premailer-cellpadding: 0;
         -premailer-cellspacing: 0;
         background-color: #f4f4f7;
         border: 2px dashed #cbcccf;
       }
 
       .discount_heading {
         text-align: center;
       }
 
       .discount_body {
         text-align: center;
         font-size: 15px;
       }
       /* Social Icons ------------------------------ */
 
       .social {
         width: auto;
       }
 
       .social td {
         padding: 0;
         width: auto;
       }
 
       .social_icon {
         height: 20px;
         margin: 0 8px 10px 8px;
         padding: 0;
       }
       /* Data table ------------------------------ */
 
       .purchase {
         width: 100%;
         margin: 0;
         padding: 35px 0;
         -premailer-width: 100%;
         -premailer-cellpadding: 0;
         -premailer-cellspacing: 0;
       }
 
       .purchase_content {
         width: 100%;
         margin: 0;
         padding: 25px 0 0 0;
         -premailer-width: 100%;
         -premailer-cellpadding: 0;
         -premailer-cellspacing: 0;
       }
 
       .purchase_item {
         padding: 10px 0;
         color: #51545e;
         font-size: 15px;
         line-height: 18px;
       }
 
       .purchase_heading {
         padding-bottom: 8px;
         border-bottom: 1px solid #eaeaec;
       }
 
       .purchase_heading p {
         margin: 0;
         color: #85878e;
         font-size: 12px;
       }
 
       .purchase_footer {
         padding-top: 15px;
         border-top: 1px solid #eaeaec;
       }
 
       .purchase_total {
         margin: 0;
         text-align: right;
         font-weight: bold;
         color: #333333;
       }
 
       .purchase_total--label {
         padding: 0 15px 0 0;
       }
 
       body {
         background-color: #f2f4f6;
         color: #51545e;
       }
 
       p {
         color: #51545e;
       }
 
       .email-wrapper {
         width: 100%;
         margin: 0;
         padding: 0;
         -premailer-width: 100%;
         -premailer-cellpadding: 0;
         -premailer-cellspacing: 0;
         background-color: #f2f4f6;
       }
 
       .email-content {
         width: 100%;
         margin: 0;
         padding: 0;
         -premailer-width: 100%;
         -premailer-cellpadding: 0;
         -premailer-cellspacing: 0;
       }
       /* Masthead ----------------------- */
 
       .email-masthead {
         padding: 25px 0;
         text-align: center;
       }
 
       .email-masthead_logo {
         width: 94px;
       }
 
       .email-masthead_name {
         font-size: 16px;
         font-weight: bold;
         color: #a8aaaf;
         text-decoration: none;
         text-shadow: 0 1px 0 white;
       }
       /* Body ------------------------------ */
 
       .email-body {
         width: 100%;
         margin: 0;
         padding: 0;
         -premailer-width: 100%;
         -premailer-cellpadding: 0;
         -premailer-cellspacing: 0;
       }
 
       .email-body_inner {
         width: 570px;
         margin: 0 auto;
         padding: 0;
         -premailer-width: 570px;
         -premailer-cellpadding: 0;
         -premailer-cellspacing: 0;
         background-color: #ffffff;
       }
 
       .email-footer {
         width: 570px;
         margin: 0 auto;
         padding: 0;
         -premailer-width: 570px;
         -premailer-cellpadding: 0;
         -premailer-cellspacing: 0;
         text-align: center;
       }
 
       .email-footer p {
         color: #a8aaaf;
       }
 
       .body-action {
         width: 100%;
         margin: 30px auto;
         padding: 0;
         -premailer-width: 100%;
         -premailer-cellpadding: 0;
         -premailer-cellspacing: 0;
         text-align: center;
       }
 
       .body-sub {
         margin-top: 25px;
         padding-top: 25px;
         border-top: 1px solid #eaeaec;
       }
 
       .content-cell {
         padding: 20px;
       }
       /*Media Queries ------------------------------ */
 
       @media only screen and (max-width: 600px) {
         .email-body_inner,
         .email-footer {
           width: 100% !important;
         }
       }
 
       @media (prefers-color-scheme: dark) {
         body,
         .email-body,
         .email-body_inner,
         .email-content,
         .email-wrapper,
         .email-masthead,
         .email-footer {
           background-color: #333333 !important;
           color: #fff !important;
         }
         p,
         ul,
         ol,
         blockquote,
         h1,
         h2,
         h3,
         span,
         .purchase_item {
           color: #fff !important;
         }
         .attributes_content,
         .discount {
           background-color: #222 !important;
         }
         .email-masthead_name {
           text-shadow: none !important;
         }
       }
 
       :root {
         color-scheme: light dark;
         supported-color-schemes: light dark;
       }
     </style>
     <!--[if mso]>
       <style type="text/css">
         .f-fallback {
           font-family: Arial, sans-serif;
         }
       </style>
     <![endif]-->
     <style type="text/css" rel="stylesheet" media="all">
       body {
         width: 100% !important;
         height: 100%;
         margin: 0;
         -webkit-text-size-adjust: none;
       }
 
       body {
         font-family: "Nunito Sans", Helvetica, Arial, sans-serif;
       }
 
       body {
         background-color: #f2f4f6;
         color: #51545e;
       }
     </style>
   </head>
   <body
     style="
       width: 100% !important;
       height: 100%;
       -webkit-text-size-adjust: none;
       font-family: 'Nunito Sans', Helvetica, Arial, sans-serif;
       background-color: #f2f4f6;
       color: #51545e;
       margin: 0;
     "
     bgcolor="#F2F4F6"
   >
     <span
       class="preheader"
       style="
         display: none !important;
         visibility: hidden;
         mso-hide: all;
         font-size: 1px;
         line-height: 1px;
         max-height: 0;
         max-width: 0;
         opacity: 0;
         overflow: hidden;
       "
       >This is an invoice for your purchase on ${moment(
         currentInvoice.date
       ).format("ll")}.
        ${
          currentInvoice.dueDate
            ? `Please submit payment by ${moment(currentInvoice.dueDate).format(
                "ll"
              )}`
            : ""
        }
       
       </span
     >
     <table
       class="email-wrapper"
       width="100%"
       cellpadding="0"
       cellspacing="0"
       role="presentation"
       style="
         width: 100%;
         -premailer-width: 100%;
         -premailer-cellpadding: 0;
         -premailer-cellspacing: 0;
         background-color: #f2f4f6;
         margin: 0;
         padding: 0;
       "
       bgcolor="#F2F4F6"
     >
       <tr>
         <td
           align="center"
           style="
             word-break: break-word;
             font-family: 'Nunito Sans', Helvetica, Arial, sans-serif;
             font-size: 16px;
           "
         >
           <table
             class="email-content"
             width="100%"
             cellpadding="0"
             cellspacing="0"
             role="presentation"
             style="
               width: 100%;
               -premailer-width: 100%;
               -premailer-cellpadding: 0;
               -premailer-cellspacing: 0;
               margin: 0;
               padding: 0;
             "
           >
             <tr>
               <td
                 class="email-masthead"
                 style="
                   word-break: break-word;
                   font-family: 'Nunito Sans', Helvetica, Arial, sans-serif;
                   font-size: 16px;
                   text-align: center;
                   padding: 25px 0;
                 "
                 align="center"
               >
                 <a
                   href="https://lodgeek.com"
                   class="f-fallback email-masthead_name"
                   style="
                     color: #a8aaaf;
                     font-size: 16px;
                     font-weight: bold;
                     text-decoration: none;
                     text-shadow: 0 1px 0 white;
                   "
                 >
                   Lodgeek
                 </a>
               </td>
             </tr>
             <!-- Email Body -->
             <tr>
               <td
                 class="email-body"
                 width="570"
                 cellpadding="0"
                 cellspacing="0"
                 style="
                   word-break: break-word;
                   font-family: 'Nunito Sans', Helvetica, Arial, sans-serif;
                   font-size: 16px;
                   width: 100%;
                   -premailer-width: 100%;
                   -premailer-cellpadding: 0;
                   -premailer-cellspacing: 0;
                   margin: 0;
                   padding: 0;
                 "
               >
                 <table
                   class="email-body_inner"
                   align="center"
                   width="570"
                   cellpadding="0"
                   cellspacing="0"
                   role="presentation"
                   style="
                     width: 570px;
                     -premailer-width: 570px;
                     -premailer-cellpadding: 0;
                     -premailer-cellspacing: 0;
                     background-color: #ffffff;
                     margin: 0 auto;
                     padding: 0;
                   "
                   bgcolor="#FFFFFF"
                 >
                   <!-- Body content -->
                   <tr>
                     <td
                       class="content-cell"
                       style="
                         word-break: break-word;
                         font-family: 'Nunito Sans', Helvetica, Arial, sans-serif;
                         font-size: 16px;
                         padding: 20px;
                       "
                     >
                       <div class="f-fallback">
                       <table
                       class="attributes"
                       width="100%"
                       cellpadding="0"
                       cellspacing="0"
                       role="presentation"
                       style="margin: 0 0 21px"
                     >
                       <tr>
                         <td
                           class="attributes_content"
                           style="
                             word-break: break-word;
                             font-family: 'Nunito Sans', Helvetica, Arial,
                               sans-serif;
                             font-size: 16px;
                             background-color: #f4f4f7;
                             padding: 16px;
                             text-align: center;
                           "
                           bgcolor="#F4F4F7"
                           width="100%"
                         >
                           <span class="f-fallback">
                             <strong>Invoice from ${
                               currentInvoice.senderCompanyName
                             } </strong>
                           </span>
                         </td>
                       </tr>
                     </table>
                         <h1
                           style="
                             margin-top: 0;
                             color: #333333;
                             font-size: 22px;
                             font-weight: bold;
                             text-align: left;
                           "
                           align="left"
                         >
                           Hi ${currentInvoice.customerName},
                         </h1>
                         <p
                           style="
                             font-size: 16px;
                             line-height: 1.625;
                             color: #51545e;
                             margin: 0.4em 0 1.1875em;
                           "
                         >
                           Your invoice has been created and is ready for
                           payment.
                         </p>
                         <table
                           class="attributes"
                           width="100%"
                           cellpadding="0"
                           cellspacing="0"
                           role="presentation"
                           style="margin: 0 0 21px"
                         >
                           <tr>
                             <td
                               class="attributes_content"
                               style="
                                 word-break: break-word;
                                 font-family: 'Nunito Sans', Helvetica, Arial,
                                   sans-serif;
                                 font-size: 16px;
                                 background-color: #f4f4f7;
                                 padding: 16px;
                               "
                               bgcolor="#F4F4F7"
                             >
                               <table
                                 width="100%"
                                 cellpadding="0"
                                 cellspacing="0"
                                 role="presentation"
                               >
                                 <tr>
                                   <td
                                     class="attributes_item"
                                     style="
                                       word-break: break-word;
                                       font-family: 'Nunito Sans', Helvetica,
                                         Arial, sans-serif;
                                       font-size: 16px;
                                       padding: 0;
                                     "
                                   >
                                     <span class="f-fallback">
                                       <strong>Amount Due:</strong> ${formatPrice(
                                         currentInvoice.amount
                                       )}
                                     </span>
                                   </td>
                                 </tr>
                                ${
                                  currentInvoice.dueDate
                                    ? ` <tr>
                                   <td
                                     class="attributes_item"
                                     style="
                                       word-break: break-word;
                                       font-family: 'Nunito Sans', Helvetica,
                                         Arial, sans-serif;
                                       font-size: 16px;
                                       padding: 0;
                                     "
                                   >
                                     <span class="f-fallback">
                                       <strong>Due By:</strong> ${moment(
                                         currentInvoice.dueDate
                                       ).format("ll")}
                                     </span>
                                   </td>
                                 </tr>`
                                    : ""
                                }
                               </table>
                             </td>
                           </tr>
                         </table>
                         <!-- Action -->
                         <table
                           class="body-action"
                           align="center"
                           width="100%"
                           cellpadding="0"
                           cellspacing="0"
                           role="presentation"
                           style="
                             width: 100%;
                             -premailer-width: 100%;
                             -premailer-cellpadding: 0;
                             -premailer-cellspacing: 0;
                             text-align: center;
                             margin: 30px auto;
                             padding: 0;
                           "
                         >
                           <tr>
                             <td
                               align="center"
                               style="
                                 word-break: break-word;
                                 font-family: 'Nunito Sans', Helvetica, Arial,
                                   sans-serif;
                                 font-size: 16px;
                               "
                             >
                               <!-- Border based button
            https://litmus.com/blog/a-guide-to-bulletproof-buttons-in-email-design -->
                               <table
                                 width="100%"
                                 border="0"
                                 cellspacing="0"
                                 cellpadding="0"
                                 role="presentation"
                               >
                                 <tr>
                                   <td
                                     align="center"
                                     style="
                                       word-break: break-word;
                                       font-family: 'Nunito Sans', Helvetica,
                                         Arial, sans-serif;
                                       font-size: 16px;
                                     "
                                   >
                                     <a
                                       href="${paymentLink}"
                                       class="f-fallback button button--green"
                                       target="_blank"
                                       style="
                                         color: #fff;
                                         background-color: #22bc66;
                                         display: inline-block;
                                         text-decoration: none;
                                         border-radius: 3px;
                                         box-shadow: 0 2px 3px
                                           rgba(0, 0, 0, 0.16);
                                         -webkit-text-size-adjust: none;
                                         box-sizing: border-box;
                                         border-color: #22bc66;
                                         border-style: solid;
                                         border-width: 10px 18px;
                                       "
                                       >Pay Invoice</a
                                     >
                                   </td>
                                 </tr>
                               </table>
                             </td>
                           </tr>
                         </table>
                         <table
                           class="purchase"
                           width="100%"
                           cellpadding="0"
                           cellspacing="0"
                           style="
                             width: 100%;
                             -premailer-width: 100%;
                             -premailer-cellpadding: 0;
                             -premailer-cellspacing: 0;
                             margin: 0;
                             padding: 35px 0;
                           "
                         >
                           <tr>
                             <td
                               style="
                                 word-break: break-word;
                                 font-family: 'Nunito Sans', Helvetica, Arial,
                                   sans-serif;
                                 font-size: 16px;
                               "
                             >
                               <h3
                                 style="
                                   margin-top: 0;
                                   color: #333333;
                                   font-size: 14px;
                                   font-weight: bold;
                                   text-align: left;
                                 "
                                 align="left"
                               >
                                 ${currentInvoice.invoiceNumber}
                               </h3>
                             </td>
                             <td
                               style="
                                 word-break: break-word;
                                 font-family: 'Nunito Sans', Helvetica, Arial,
                                   sans-serif;
                                 font-size: 16px;
                               "
                             >
                               <h3
                                 class="align-right"
                                 style="
                                   margin-top: 0;
                                   color: #333333;
                                   font-size: 14px;
                                   font-weight: bold;
                                   text-align: right;
                                 "
                                 align="right"
                               >
                                 ${moment(currentInvoice.date).format("ll")}
                               </h3>
                             </td>
                           </tr>
                           <tr>
                             <td
                               colspan="2"
                               style="
                                 word-break: break-word;
                                 font-family: 'Nunito Sans', Helvetica, Arial,
                                   sans-serif;
                                 font-size: 16px;
                               "
                             >
                               <table
                                 class="purchase_content"
                                 width="100%"
                                 cellpadding="0"
                                 cellspacing="0"
                                 style="
                                   width: 100%;
                                   -premailer-width: 100%;
                                   -premailer-cellpadding: 0;
                                   -premailer-cellspacing: 0;
                                   margin: 0;
                                   padding: 25px 0 0;
                                 "
                               >
                                 <tr>
                                   <th
                                     class="purchase_heading"
                                     align="left"
                                     style="
                                       font-family: 'Nunito Sans', Helvetica,
                                         Arial, sans-serif;
                                       font-size: 16px;
                                       padding-bottom: 8px;
                                       border-bottom-width: 1px;
                                       border-bottom-color: #eaeaec;
                                       border-bottom-style: solid;
                                     "
                                   >
                                     <p
                                       class="f-fallback"
                                       style="
                                         font-size: 12px;
                                         line-height: 1.625;
                                         color: #85878e;
                                         margin: 0;
                                       "
                                     >
                                       Description
                                     </p>
                                   </th>
                                   <th
                                     class="purchase_heading"
                                     align="right"
                                     style="
                                       font-family: 'Nunito Sans', Helvetica,
                                         Arial, sans-serif;
                                       font-size: 16px;
                                       padding-bottom: 8px;
                                       border-bottom-width: 1px;
                                       border-bottom-color: #eaeaec;
                                       border-bottom-style: solid;
                                     "
                                   >
                                     <p
                                       class="f-fallback"
                                       style="
                                         font-size: 12px;
                                         line-height: 1.625;
                                         color: #85878e;
                                         margin: 0;
                                       "
                                     >
                                       Amount
                                     </p>
                                   </th>
                                 </tr>
                               ${currentInvoice.lineItems.map(
                                 (i) =>
                                   `  <tr key={${i.key}} >
                                <td
                                  width="80%"
                                  class="purchase_item"
                                  style="
                                    word-break: break-word;
                                    font-family: 'Nunito Sans', Helvetica,
                                      Arial, sans-serif;
                                    font-size: 15px;
                                    color: #51545e;
                                    line-height: 18px;
                                    padding: 10px 0;
                                  "
                                >
                                  <span class="f-fallback"
                                    >${i.name}</span
                                  >
                                </td>
                                <td
                                  class="align-right"
                                  width="20%"
                                  style="
                                    word-break: break-word;
                                    font-family: 'Nunito Sans', Helvetica,
                                      Arial, sans-serif;
                                    font-size: 16px;
                                    text-align: right;
                                  "
                                  align="right"
                                >
                                  <span class="f-fallback">${formatPrice(
                                    i.amount
                                  )}</span>
                                </td>
                              </tr>`
                               )}
                                 <tr>
                                   <td
                                     width="80%"
                                     class="purchase_footer"
                                     valign="middle"
                                     style="
                                       word-break: break-word;
                                       font-family: 'Nunito Sans', Helvetica,
                                         Arial, sans-serif;
                                       font-size: 16px;
                                       padding-top: 15px;
                                       border-top-width: 1px;
                                       border-top-color: #eaeaec;
                                       border-top-style: solid;
                                     "
                                   >
                                     <p
                                       class="f-fallback purchase_total purchase_total--label"
                                       style="
                                         font-size: 16px;
                                         line-height: 1.625;
                                         text-align: right;
                                         font-weight: bold;
                                         color: #333333;
                                         margin: 0;
                                         padding: 0 15px 0 0;
                                       "
                                       align="right"
                                     >
                                       Total
                                     </p>
                                   </td>
                                   <td
                                     width="20%"
                                     class="purchase_footer"
                                     valign="middle"
                                     style="
                                       word-break: break-word;
                                       font-family: 'Nunito Sans', Helvetica,
                                         Arial, sans-serif;
                                       font-size: 16px;
                                       padding-top: 15px;
                                       border-top-width: 1px;
                                       border-top-color: #eaeaec;
                                       border-top-style: solid;
                                     "
                                   >
                                     <p
                                       class="f-fallback purchase_total"
                                       style="
                                         font-size: 16px;
                                         line-height: 1.625;
                                         text-align: right;
                                         font-weight: bold;
                                         color: #333333;
                                         margin: 0;
                                       "
                                       align="right"
                                     >
                                     ${formatPrice(currentInvoice.amount)}
                                     </p>
                                   </td>
                                 </tr>
                               </table>
                             </td>
                           </tr>
                         </table>
                         <p
                           style="
                             font-size: 16px;
                             line-height: 1.625;
                             color: #51545e;
                             margin: 0.4em 0 1.1875em;
                           "
                         >
                           If you have any questions about this invoice, simply
                           reply to this email or reach out to our
                           <a
                             href="mailto:contact@lodgeek.com"
                             style="color: #3869d4"
                             >support team</a
                           >
                           for help.
                         </p>
                         <p
                           style="
                             font-size: 16px;
                             line-height: 1.625;
                             color: #51545e;
                             margin: 0.4em 0 1.1875em;
                           "
                         >
                           Cheers, <br />The Lodgeek team
                         </p>
                         <!-- Sub copy -->
                         <table
                           class="body-sub"
                           role="presentation"
                           style="
                             margin-top: 25px;
                             padding-top: 25px;
                             border-top-width: 1px;
                             border-top-color: #eaeaec;
                             border-top-style: solid;
                           "
                         >
                           <tr>
                             <td
                               style="
                                 word-break: break-word;
                                 font-family: 'Nunito Sans', Helvetica, Arial,
                                   sans-serif;
                                 font-size: 16px;
                               "
                             >
                               <p
                                 class="f-fallback sub"
                                 style="
                                   font-size: 13px;
                                   line-height: 1.625;
                                   color: #51545e;
                                   margin: 0.4em 0 1.1875em;
                                 "
                               >
                                 If you’re having trouble with the button above,
                                 copy and paste the URL below into your web
                                 browser.
                               </p>
                               <p
                                 class="f-fallback sub"
                                 style="
                                   font-size: 13px;
                                   line-height: 1.625;
                                   color: #51545e;
                                   margin: 0.4em 0 1.1875em;
                                 "
                               >
                                 ${paymentLink}
                               </p>
                             </td>
                           </tr>
                         </table>
                       </div>
                     </td>
                   </tr>
                 </table>
               </td>
             </tr>
             <tr>
               <td
                 style="
                   word-break: break-word;
                   font-family: 'Nunito Sans', Helvetica, Arial, sans-serif;
                   font-size: 16px;
                 "
               >
                 <table
                   class="email-footer"
                   align="center"
                   width="570"
                   cellpadding="0"
                   cellspacing="0"
                   role="presentation"
                   style="
                     width: 570px;
                     -premailer-width: 570px;
                     -premailer-cellpadding: 0;
                     -premailer-cellspacing: 0;
                     text-align: center;
                     margin: 0 auto;
                     padding: 0;
                   "
                 >
                   <tr>
                     <td
                       class="content-cell"
                       align="center"
                       style="
                         word-break: break-word;
                         font-family: 'Nunito Sans', Helvetica, Arial, sans-serif;
                         font-size: 16px;
                         padding: 20px;
                       "
                     >
                       <p
                         class="f-fallback sub align-center"
                         style="
                           font-size: 13px;
                           line-height: 1.625;
                           text-align: center;
                           color: #a8aaaf;
                           margin: 0.4em 0 1.1875em;
                         "
                         align="center"
                       >
                         Lodgeek Inc.
                         <br />Femi Coker Dr, Lekki, Lagos<br />105101
                       </p>
                     </td>
                   </tr>
                 </table>
               </td>
             </tr>
           </table>
         </td>
       </tr>
     </table>
   </body>
 </html>
 
     `;

  return basicInvoiceHtml;
};
