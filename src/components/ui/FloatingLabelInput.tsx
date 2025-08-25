
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FloatingLabelInputProps {
  id: string;
  label: string;
  value: string | number;
  onChange?: (value: string) => void;
  type?: "text" | "email" | "tel" | "number" | "date" | "password" | "url";
  readOnly?: boolean;
  required?: boolean;
  className?: string;
  title?: string;
  isTextarea?: boolean;
  rows?: number;
  minHeight?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  
}

/**
 * Standardized Lovable Bootstrap Basic Floating Label Input Component
 * Provides consistent floating label behavior across the entire application
 */
const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  id,
  label,
  value,
  onChange,
  type = "text",
  readOnly = false,
  required = false,
  className = "",
  title,
  isTextarea = false,
  rows = 3,
  minHeight = "80px",
  placeholder,
  disabled = false,
  error=""
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (onChange && !readOnly && !disabled) {
      onChange(e.target.value);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const hasValue = value !== undefined && value !== null && value.toString().trim() !== '';
  const shouldLiftLabel = isFocused || hasValue;
  
  const baseInputClasses = "pt-6 pb-2 px-3 peer w-full border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  
  const readOnlyClasses = readOnly ? "bg-gray-100 border-gray-300 text-gray-600" : "";
  const disabledClasses = disabled ? "cursor-not-allowed opacity-50" : "";
  
  // Add error border and focus ring if error is present
  const hasError = !!error && error.length > 0;
  const errorInputClasses = hasError ? "border-red-500 focus-visible:ring-red-500" : "";
  const inputClasses = isTextarea 
    ? cn(`min-h-[${minHeight}] rounded-md`, baseInputClasses, readOnlyClasses, disabledClasses, className, errorInputClasses)
    : cn("h-12 rounded-md", baseInputClasses, readOnlyClasses, disabledClasses, className, errorInputClasses);

  const labelClasses = cn(
    "absolute left-3 transition-all duration-200 pointer-events-none z-10 px-1",
    shouldLiftLabel || (isTextarea && rows > 1)
      ? "top-1.5 text-xs text-primary bg-background" 
      : "top-3.5 text-base text-muted-foreground bg-transparent"
  );

  return (
    <div className="relative w-full">
      {isTextarea ? (
        <Textarea
          id={id}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={inputClasses}
          rows={rows}
          readOnly={readOnly}
          disabled={disabled}
          title={title}
          placeholder={placeholder}
          aria-label={label}
          aria-required={required}
        />
      ) : (
        <>
          <Input
            id={id}
            type={type}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            readOnly={readOnly}
            disabled={disabled}
            className={inputClasses}
            title={title}
            placeholder={placeholder}
            aria-label={label}
            aria-required={required}
          />
          {type === "date" && (
            <style>{`
              #${id}::-webkit-datetime-edit-text,
              #${id}::-webkit-datetime-edit-month-field,
              #${id}::-webkit-datetime-edit-day-field,
              #${id}::-webkit-datetime-edit-year-field {
                color: ${hasValue ? 'inherit' : 'transparent'};
              }
              #${id}::-webkit-calendar-picker-indicator {
                opacity: ${hasValue ? 1 : 0.3};
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
              }
            `}</style>
          )}
        </>
      )}
      <Label 
        htmlFor={id}
        className={labelClasses}
      >
        {label}{required ? " *" : ""}
      </Label>
      {hasError && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default FloatingLabelInput;
