
// Form-related type definitions
export interface FormFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  className?: string;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectFieldProps extends Omit<FormFieldProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface FieldValidation {
  [fieldName: string]: ValidationRule;
}
