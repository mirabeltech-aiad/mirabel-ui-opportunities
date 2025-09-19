import React from 'react';
import { FloatingLabelInput } from '@/shared/components/ui/FloatingLabelInput';

interface FormInputProps {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  error?: string | null;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  disabled = false,
  required = false,
  className = ''
}) => {
  return (
    <FloatingLabelInput
      id={"txtinput"+label}
      label={label}
      value={value}
      onChange={onChange}
      type={type as any}
      placeholder={placeholder}
      error={error || undefined}
      disabled={disabled}
      required={required}
      className={className}
    />
  );
};