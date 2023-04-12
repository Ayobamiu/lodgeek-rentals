import React from "react";

const InputSelect = ({
  value,
  onChange,
  label,
  className,
  required,
  placeholder,
  options,
}: {
  value: string;
  onChange: (val: any) => void;
  label?: string;
  className?: string;
  required?: boolean;
  placeholder: string;
  options: string[];
}) => {
  return (
    <div className={`w-full flex flex-col ${className}`}>
      {label && (
        <label
          htmlFor="options"
          className="mb-1 text-coolGray-500 font-medium text-sm"
        >
          {label}
          {required && <sup className="text-red-500 text-sm">*</sup>}
        </label>
      )}
      <select
        id="options"
        className="bg-transparent border border-coolGray-200 text-coolGray-400 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full py-3 px-3 placeholder:text-gray-300 placeholder:text-sm"
        value={value}
        onChange={onChange}
      >
        <option className="text-gray-300 text-sm">{placeholder}</option>
        {options.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};

export default InputSelect;
