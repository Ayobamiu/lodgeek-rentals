import { getInvoiceTransactionFee } from "../../functions/Payment/getInvoiceTransactionFee";
import { AdditionalFee, Company, Rent } from "../../models";

/* 
Lodgeek Pricing
For each payment made by tenants, Paystack will charge a 1.5% transaction fee, capped at N2,000. 
This fee will be passed on to the property manager, except for the free plan, which will have a fixed transaction fee of N500.
*/

export function getRentsAndFees(
  selectedRents: Rent[],
  selectedAdditionalFees: AdditionalFee[],
  propertyCompany?: Company
) {
  const isFreePlan = !propertyCompany?.subscriptionCode;
  const totalFeeMinusTransactionFee =
    selectedRents
      .map((i) => i.rent)
      .reduce((partialSum, a) => partialSum + a, 0) +
    selectedAdditionalFees
      .map((i) => i.feeAmount)
      .reduce((partialSum, a) => partialSum + a, 0);

  const transactionFee = isFreePlan
    ? getInvoiceTransactionFee(totalFeeMinusTransactionFee)
    : 0;
  return { transactionFee, totalFeeMinusTransactionFee };
}
