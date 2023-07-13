import { PlanDuration } from "../../models";

export function getPlanPriceAndCode(duration: PlanDuration): () => {
  basicPlanPrice: number;
  basicPlanDiscountedPrice: number;
  proPlanPrice: number;
  proPlanDiscountedPrice: number;
  premiumPlanPrice: number;
  premiumPlanDiscountedPrice: number;
  basicPlanCode: string | undefined;
  proPlanCode: string | undefined;
  premiumPlanCode: string | undefined;
} {
  return () => {
    const discountOnBiAnnual = 0.95;
    const discountOnAnnual = 0.9;
    const basicMonthly = 10000;
    const proMonthly = 25000;
    const premiumMonthly = 50000;
    return {
      basicPlanPrice:
        duration === PlanDuration.Monthly
          ? basicMonthly
          : duration === PlanDuration["Bi-Annually"]
          ? 6 * basicMonthly
          : 12 * basicMonthly,
      basicPlanDiscountedPrice:
        duration === PlanDuration.Monthly
          ? basicMonthly
          : duration === PlanDuration["Bi-Annually"]
          ? Math.round(6 * discountOnBiAnnual * basicMonthly)
          : Math.round(12 * discountOnAnnual * basicMonthly),
      proPlanPrice:
        duration === PlanDuration.Monthly
          ? proMonthly
          : duration === PlanDuration["Bi-Annually"]
          ? 6 * proMonthly
          : 12 * proMonthly,
      proPlanDiscountedPrice:
        duration === PlanDuration.Monthly
          ? proMonthly
          : duration === PlanDuration["Bi-Annually"]
          ? Math.round(6 * discountOnBiAnnual * proMonthly)
          : Math.round(12 * discountOnAnnual * proMonthly),
      premiumPlanPrice:
        duration === PlanDuration.Monthly
          ? premiumMonthly
          : duration === PlanDuration["Bi-Annually"]
          ? 6 * premiumMonthly
          : 12 * premiumMonthly,
      premiumPlanDiscountedPrice:
        duration === PlanDuration.Monthly
          ? premiumMonthly
          : duration === PlanDuration["Bi-Annually"]
          ? Math.round(6 * discountOnBiAnnual * premiumMonthly)
          : Math.round(12 * discountOnAnnual * premiumMonthly),

      basicPlanCode:
        duration === PlanDuration.Monthly
          ? process.env.REACT_APP_PAYSTACK_BASIC_PLAN_CODE
          : duration === PlanDuration["Bi-Annually"]
          ? process.env.REACT_APP_PAYSTACK_BASIC_PLAN_BIANNUALLY_CODE
          : process.env.REACT_APP_PAYSTACK_BASIC_PLAN_YEARLY_CODE,
      proPlanCode:
        duration === PlanDuration.Monthly
          ? process.env.REACT_APP_PAYSTACK_PRO_PLAN_CODE
          : duration === PlanDuration["Bi-Annually"]
          ? process.env.REACT_APP_PAYSTACK_PRO_PLAN_BIANNUALLY_CODE
          : process.env.REACT_APP_PAYSTACK_PRO_PLAN_YEARLY_CODE,
      premiumPlanCode:
        duration === PlanDuration.Monthly
          ? process.env.REACT_APP_PAYSTACK_PREMIUM_PLAN_CODE
          : duration === PlanDuration["Bi-Annually"]
          ? process.env.REACT_APP_PAYSTACK_PREMIUM_PLAN_BIANNUALLY_CODE
          : process.env.REACT_APP_PAYSTACK_PREMIUM_PLAN_YEARLY_CODE,
    };
  };
}
