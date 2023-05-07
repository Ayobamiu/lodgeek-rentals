import { Payment } from "../models";

export function getPaymentsBetweenDates(
  startDate: number,
  endDate: number,
  payments: Payment[]
): Payment[] {
  return payments.filter((payment) => {
    const paymentDate = new Date(payment.completedAt || payment.createdAt); // use completedAt if available, otherwise use createdAt
    return (
      paymentDate >= new Date(startDate) && paymentDate <= new Date(endDate)
    );
  });
}
