import { AdditionalFee, Rent } from "../../models";

/* 
Lodgeek Pricing
1.7% Transaction Costs
Local transaction fees are capped at 5,000 Naira, meaning that's the maximum you'll ever pay in fees per transaction.
*/
const transactionFeePercent = 0.017;
const transactionCostsCap = 5000;
export function getRentsAndFees(
  selectedRents: Rent[],
  selectedAdditionalFees: AdditionalFee[]
) {
  const totalFeeMinusTransactionFee =
    selectedRents
      .map((i) => i.rent)
      .reduce((partialSum, a) => partialSum + a, 0) +
    selectedAdditionalFees
      .map((i) => i.feeAmount)
      .reduce((partialSum, a) => partialSum + a, 0);
  const transactionFee =
    totalFeeMinusTransactionFee * transactionFeePercent <= transactionCostsCap
      ? totalFeeMinusTransactionFee * transactionFeePercent
      : transactionCostsCap;
  return { transactionFee, totalFeeMinusTransactionFee };
}
