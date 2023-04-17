import React from "react";

const SinglePropertyDetail = ({
  text,
  title,
}: {
  text: string;
  title: string;
}) => {
  return (
    <div className="">
      <p className="sm:text-sm text-gray-800 font-medium text-wrap text-xs">
        {text}
      </p>
      <p className="text-[#95bce3] font-semibold sm:text-sm text-[10px]">
        {title}
      </p>
    </div>
  );
};

export default SinglePropertyDetail;
