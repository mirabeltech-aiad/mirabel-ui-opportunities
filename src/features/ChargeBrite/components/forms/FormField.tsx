
import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  required?: boolean;
  helpText?: string;
  className?: string;
  children: React.ReactNode;
  span?: 1 | 2 | 3;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  helpText,
  className,
  children,
  span = 1
}) => {
  const spanClass = {
    1: 'col-span-1',
    2: 'col-span-1 md:col-span-2',
    3: 'col-span-1 md:col-span-2 lg:col-span-3'
  };

  return (
    <div className={cn("space-y-2", spanClass[span], className)}>
      <Label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
      {helpText && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

export default FormField;
