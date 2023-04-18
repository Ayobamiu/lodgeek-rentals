type PaymentCardDetailsProp = {
  cardHolderName: string;
  lastFourDigits: string;
  expiryDate: string;
  brand: string;
};

export function PaymentCardDetails(props: PaymentCardDetailsProp) {
  const { cardHolderName, lastFourDigits, expiryDate, brand } = props;
  return (
    <div className="bg-white shadow-md p-6 rounded-lg my-5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Payment Card Details
        </h2>
        <i title={brand} className={`fa fa-cc-${brand} fa-2x`}></i>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="text-gray-800 text-sm">Cardholder Name</div>
        <div className="text-gray-800 font-medium">{cardHolderName}</div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="text-gray-800 text-sm">Card Number</div>
        <div className="text-gray-800 font-medium">
          <span>**** **** **** {lastFourDigits}</span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-gray-800 text-sm">Expiry Date</div>
        <div className="text-gray-800 font-medium">{expiryDate}</div>
      </div>
    </div>
  );
}
