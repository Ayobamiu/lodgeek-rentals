import { AdditionalFee, Rent } from "../models";
import formatPrice from "../utils/formatPrice";

type ReturnTypes = {
  totalRentPaid: number;
  transactionDescription: string;
  totalAmount: number;
};

export function getTransactionDescriptionAndAmount(
  rents: Rent[],
  selectedAdditionalFees: AdditionalFee[],
  tenantName: string,
  propertyTitle: string
): ReturnTypes {
  const totalRentPaid = rents.reduce((p, a) => p + a.rent, 0);
  const totalFeesPaid = selectedAdditionalFees.reduce(
    (p, a) => p + a.feeAmount,
    0
  );
  const totalAmount = totalRentPaid + totalFeesPaid;
  const userPaidRents = rents.length > 0;
  const userPaidFees = selectedAdditionalFees.length > 0;
  const userPaidFeesAndRents = userPaidFees && userPaidRents;

  const transactionDescription = userPaidFeesAndRents
    ? `${tenantName} paid ${formatPrice(
        totalAmount
      )} in rent and fees for ${propertyTitle}`
    : userPaidRents
    ? `${tenantName} paid ${formatPrice(
        totalRentPaid
      )} in rent for ${propertyTitle}`
    : userPaidFees
    ? `${tenantName} paid ${formatPrice(
        totalFeesPaid
      )} in rent for ${propertyTitle}`
    : `${tenantName} paid ${formatPrice(totalAmount)} for ${propertyTitle}`;

  return {
    totalRentPaid,
    transactionDescription,
    totalAmount,
  };
}
