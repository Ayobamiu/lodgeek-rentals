import React from "react";
import styled from "styled-components";

const Input = ({
  value,
  onChange,
  label,
  className,
  required,
  placeholder,
  type,
}: {
  value: string | number;
  onChange: (val: any) => void;
  label?: string;
  className?: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
}) => {
  return (
    <MainInput className="w-full flex flex-col">
      {label && (
        <label className="mb-1 text-coolGray-500 font-medium text-sm">
          {label}
          {required && <sup className="text-red-500 text-sm">*</sup>}
        </label>
      )}

      <input
        className={`py-3 px-3 leading-5 w-full text-coolGray-400 font-normal border border-coolGray-200 outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-lg shadow-sm ${className} placeholder:text-gray-300 placeholder:text-sm`}
        type={type ? type : "text"}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
      />
    </MainInput>
  );
};

export default Input;

const MainInput = styled.div``;
