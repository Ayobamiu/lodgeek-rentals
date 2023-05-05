export function getInvoiceTransactionFee(amount: number) {
  const feeCap = 200;
  const fee: number = (amount * 1.5) / 100;
  return fee < feeCap ? fee : feeCap;
}
