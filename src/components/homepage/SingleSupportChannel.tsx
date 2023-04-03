import { MdCall, MdMail } from "react-icons/md";
import { IoCopy } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import { useState } from "react";

const SingleSupportChannel = ({
  className,
  value,
  iconName,
}: {
  className?: string;
  value: string;
  iconName: string;
}) => {
  const [isCopied, setIsCopied] = useState(false);
  async function copyTextToClipboard(text: string) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    }
  }

  const handleCopyClick = (text: string) => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(text)
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div
      className={`w-full pl-3 mb-5 h-[50px] flex flex-row items-center justify-between border border-gray-200 rounded-md ${className}`}
    >
      <div className="flex flex-row items-center w-[70%]">
        {iconName === "phone" ? (
          <MdCall className="text-xl text-gray-400" />
        ) : (
          <MdMail className="text-xl text-gray-400" />
        )}
        <p className="text-base text-gray-500 pl-4">{value}</p>
      </div>
      {isCopied ? (
        <div
          role="button"
          className="w-[20%] h-full bg-green-500 flex flex-row items-center justify-center  rounded-r-md"
        >
          <FaCheck className="text-white text-lg" />
        </div>
      ) : (
        <div
          role="button"
          className="w-[20%] h-full bg-gray-400 flex flex-row items-center justify-center  rounded-r-md"
          onClick={() => handleCopyClick(value)}
        >
          <IoCopy className="text-white text-lg" />
        </div>
      )}
    </div>
  );
};

export default SingleSupportChannel;
