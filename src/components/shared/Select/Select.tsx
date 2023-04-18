import ReactSelect from "react-select";

import { SelectWrapper } from "./styled";
import { SelectProps } from "./types";

type Option = { readonly value: string };

const Select: React.FC<SelectProps> = ({
  label,
  id,
  error,
  options,
  errorText,
  onChangeValue,
  onFocus,
  disabled,
  required,
  onBlurEvent,
  placeholder,
  name,
}) => {
  const handleChange = (option: Option | null) => {
    // logic here
    if (onChangeValue && option) {
      onChangeValue(id, option.value, true);
    }
  };

  const handleBlur = () => {
    if (onBlurEvent) {
      onBlurEvent(id, true, true);
    }
  };

  return (
    <SelectWrapper className="flex w-full flex-col" error={error}>
      {label && (
        <label
          htmlFor="options"
          className="mb-1 text-coolGray-500 font-medium text-sm"
        >
          {label}
          {required && <sup className="text-red-500 text-sm">*</sup>}
        </label>
      )}
      <ReactSelect
        placeholder={`Select ${placeholder || label || "option"}`}
        options={options}
        onBlur={handleBlur}
        onFocus={onFocus}
        id={id}
        onChange={handleChange}
        isDisabled={disabled}
        required={required}
        name={name}
        captureMenuScroll={true}
        classNames={{
          option: (state) =>
            `hover:bg-amali-green cursor-pointer bg-transparent text-xs lg:text-sm px-2 md:px-6 py-2 focus:bg-amali-green focus-within:bg-amali-green ${
              state.isSelected ? "font-bold" : ""
            } `,
          control: () =>
            `w-full border-x-0 border-b-2 border-t-0 px-2 py-2 md:py-[0.375rem] text-xs outline-none transition-all duration-300 ease-in placeholder:text-xs md:px-4 lg:py-3 lg:text-sm xl:placeholder:text-sm flex react-select`,
        }}
        styles={{
          control: () => {
            return {};
          },
          option: () => ({}),
          valueContainer: (baseStyles) => ({
            ...baseStyles,
            padding: 0,
            margin: 0,
          }),
          input: (baseStyles) => ({ ...baseStyles, margin: 0 }),
          indicatorSeparator: () => ({}),
          placeholder: (base) => ({ ...base, margin: 0, padding: 0 }),
        }}
        // onChange={onChange}
      />
    </SelectWrapper>
  );
};

export default Select;
