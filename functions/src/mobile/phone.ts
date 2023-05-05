import axios from "axios";

export const sendSMS = async (phone: string, sms: string) => {
  const url = "https://api.ng.termii.com/api/sms/send";
  const data = {
    to: phone,
    from: "Lodgeek",
    sms,
    type: "plain",
    channel: "generic",
    api_key: process.env.REACT_APP_TERMII_API_KEY,
  };
  await axios.post(url, data);
};
