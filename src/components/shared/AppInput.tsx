import React from "react";

const AppInput = (
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) => {
  return (
    <div className="mb-4 flex p-4 py-3 px-3 leading-5 w-full text-coolGray-400 font-normal border border-coolGray-200 outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-lg shadow-sm">
      <input
        className="w-full outline-none leading-5 text-coolGray-400 font-normal"
        {...props}
      />
    </div>
  );
};

export default AppInput;
