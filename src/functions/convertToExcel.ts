import * as XLSX from "xlsx";

export function convertPaymentDataToExcel(paymentData: any[]) {
  const worksheet = XLSX.utils.json_to_sheet(paymentData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  return excelBuffer;
}
