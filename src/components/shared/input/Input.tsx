import React from "react";

const Input = ({
  value,
  onChange,
  label,
  className,
  required,
  placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  className?: string;
  required?: boolean;
  placeholder?: string;
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1 text-coolGray-800 font-medium">{label}</label>
      )}

      <input
        className={`py-3 px-3 leading-5 w-full text-coolGray-400 font-normal border border-coolGray-200 outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-lg shadow-sm ${className}`}
        type="text"
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default Input;
