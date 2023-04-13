import React from "react";

const SinglePropertyFacility = ({ text }: { text: string }) => {
  return (
    <div className="px-4 py-2 rounded flex flex-row items-center justify-center bg-[#95bce3] text-xs lg:text-sm text-coolGray-700 font-medium  ">
      {text}
    </div>
  );
};

export default SinglePropertyFacility;
