import axios from "axios";
import { toast } from "react-toastify";

const sendToken = async (phone: string) => {
  const url = "https://api.ng.termii.com/api/sms/otp/send";
  const data = {
    api_key: process.env.REACT_APP_TERMII_API_KEY,
    message_type: "NUMERIC",
    to: phone,
    from: "Usman",
    channel: "generic",
    pin_attempts: 10,
    pin_time_to_live: 5,
    pin_length: 6,
    pin_placeholder: `< 1234 >`,
    message_text: `Welcome to Lodgeek! Please use the following PIN to verify your phone number: < 1234 >. Thank you for choosing Lodgeek.`,
    pin_type: "NUMERIC",
  };

  await axios
    .post(url, data)
    .then((response) => {
      const phoneVerificationData = JSON.stringify({
        phone,
        pinId: response.data.pinId,
      });

      window.localStorage.setItem(
        "phoneVerificationData",
        phoneVerificationData
      );

      toast.success(`Verification code sent to ${phone}`);
    })
    .catch(() => {
      toast.error(
        "Error sending verification code, check you number and try again!"
      );
    });
};

const verifyToken = async (pin: string) => {
  const url = "https://api.ng.termii.com/api/sms/otp/verify";

  const phoneVerificationData = JSON.parse(
    window.localStorage.getItem("phoneVerificationData") || ""
  );

  const data = {
    api_key: process.env.REACT_APP_TERMII_API_KEY,
    pin_id: phoneVerificationData.pinId,
    pin: pin,
  };

  await axios
    .post(url, data)
    .then(() => {
      toast.success(`Phone verified.`);
    })
    .catch(() => {
      toast.error("Error verifying code, check you number and try again!");
    });
};
export { sendToken, verifyToken };
