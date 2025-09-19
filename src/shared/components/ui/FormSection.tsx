import React from 'react';
import { cn } from '../../utils/cn';
import { Settings } from 'lucide-react';

interface FormSectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  children,
  className,
  title,
  description
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      {title && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-ocean-800 border-b border-ocean-200 pb-2 flex items-center gap-2">
            <div className="w-1 h-6 rounded-full bg-blue-500" />
            <Settings className="h-5 w-5 text-ocean-600" />
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

interface FormFieldProps {
  children: React.ReactNode;
  className?: string;
  label?: string;
  error?: string;
  required?: boolean;
  modal?: boolean; // Use modal styling for compact forms
}

export const FormField: React.FC<FormFieldProps> = ({
  children,
  className,
  label,
  error,
  required,
  modal = false
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-ocean-600">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div>
        {children}
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};