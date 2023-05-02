import { nFormatter } from "./nFormatter";

const formatPrice = (price: number, formatKM?: boolean) => {
  return typeof price === "number"
    ? formatKM
      ? `₦ ${nFormatter(price, 1)}`
      : `₦ ${price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`
    : "NaN";
};
export default formatPrice;
