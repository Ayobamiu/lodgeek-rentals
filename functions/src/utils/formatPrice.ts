const formatPrice = (price: number) => {
  return typeof price === "number"
    ? `₦ ${price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`
    : "NaN";
};
export default formatPrice;
