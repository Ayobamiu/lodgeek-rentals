export type SelectProps = React.SelectHTMLAttributes<
  HTMLSelectElement | HTMLInputElement
> & {
  className?: string;
  id: string;
  error?: boolean | string;
  label?: string;
  errorText?: string;
  options?: readonly {
    readonly value: string;
    readonly label: string;
  }[];
  onChangeValue?: (
    field: string,
    value: string,
    shouldValidate?: boolean | undefined
  ) => void;
  onBlurEvent?: (
    field: string,
    touched?: boolean | undefined,
    shouldValidate?: boolean | undefined
  ) => void;
};
export type MultiSelectProps = React.SelectHTMLAttributes<
  HTMLSelectElement | HTMLInputElement
> & {
  className?: string;
  id: string;
  error?: boolean | string;
  label?: string;
  errorText?: string;
  options?: readonly {
    readonly value: string;
    readonly label: string;
  }[];
  onChange: (e: any) => void;
  onBlurEvent?: (
    field: string,
    touched?: boolean | undefined,
    shouldValidate?: boolean | undefined
  ) => void;
};
