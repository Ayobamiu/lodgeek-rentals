import { ToWords } from "to-words";
import { PaymentCurrency } from "../models";
export const convertNumToWord = (amount: number, currency: PaymentCurrency) => {
  const currencyOptions =
    currency === PaymentCurrency.EUR
      ? {
          // can be used to override defaults for the selected locale
          name: "Euro",
          plural: "Euros",
          symbol: "€",
          fractionalUnit: {
            name: "Cent",
            plural: "Cents",
            symbol: "",
          },
        }
      : currency === PaymentCurrency.USD
      ? {
          // can be used to override defaults for the selected locale
          name: "Dollar",
          plural: "Dollars",
          symbol: "$",
          fractionalUnit: {
            name: "Cent",
            plural: "Cents",
            symbol: "",
          },
        }
      : {
          // can be used to override defaults for the selected locale
          name: "Naira",
          plural: "Naira",
          symbol: "₦",
          fractionalUnit: {
            name: "Kobo",
            plural: "Kobos",
            symbol: "",
          },
        };
  const toWords = new ToWords({
    localeCode: "en-US",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
      currencyOptions: currencyOptions,
    },
  });

  return toWords.convert(amount, { currency: true });
};
