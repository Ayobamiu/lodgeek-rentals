export function generateInvoiceNumber(
  companyName: string,
  invoiceCount: number
) {
  const companyInitials = companyName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  const invoiceNumber = invoiceCount.toString().padStart(6, "0");
  return `INV-${companyInitials}-${invoiceNumber}`;
}
export function generateReceiptNumber(
  companyName: string,
  invoiceCount: number
) {
  const companyInitials = companyName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  const invoiceNumber = invoiceCount.toString().padStart(6, "0");
  return `RCP-${companyInitials}-${invoiceNumber}`;
}
