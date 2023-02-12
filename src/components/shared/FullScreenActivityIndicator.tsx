import React from "react";
export default function FullScreenActivityIndicator({
  color,
}: {
  color?: string;
}) {
  return (
    <div className="fixed w-screen h-screen flex justify-center items-center bg-black opacity-80 z-50">
      <svg
        className={`animate-spin h-5 w-5 mr-3 rounded-full border-t-2 border-r-2  border-b-2  ${
          color ? `border-[${color}]` : "border-white"
        } ml-2`}
        viewBox="0 0 24 24"
      ></svg>
    </div>
  );
}
