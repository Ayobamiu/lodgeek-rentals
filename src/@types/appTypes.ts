export type InputPasswordType = "password";
export type InputTextType = "text";
export type InputEmailType = "email";
export type InputDateType = "date";
export type InputFileType = "file";
export type InputSelectType = "select";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  error?: boolean | string;
  label?: string;
  errorText?: string;
  type: InputPasswordType | InputTextType | InputEmailType | InputDateType;
}
