import React from "react";

const TextAreaInput = ({
  value,
  onChange,
  label,
  className,
  required,
  placeholder,
}: {
  value: string;
  onChange: (val: any) => void;
  label?: string;
  className?: string;
  required?: boolean;
  placeholder?: string;
}) => {
  return (
    <div className="w-full flex flex-col">
      {label && (
        <label className="mb-1 text-coolGray-500 font-medium text-sm">
          {label}
          {required && <sup className="text-red-500 text-sm">*</sup>}
        </label>
      )}

      <textarea
        className={`py-3 px-3 leading-5 w-full text-coolGray-400 font-normal border border-coolGray-200 outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-lg shadow-sm ${className} placeholder:text-gray-300 placeholder:text-sm`}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        // minLength={100}
      />
    </div>
  );
};

export default TextAreaInput;
