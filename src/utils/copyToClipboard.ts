import { message } from "antd";

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    message.success("Copied to clipboard!");
  } catch (err) {
    message.error("Failed to copy: ");
  }
};
