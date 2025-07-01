
import React from "react";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface FloatingLabelSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[] | SelectOption[];
  placeholder?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  allowClear?: boolean;
}

/**
 * Standardized Lovable Bootstrap Basic Floating Label Select Component
 * Provides consistent floating label behavior for select fields across the application
 */
const FloatingLabelSelect: React.FC<FloatingLabelSelectProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "Select option",
  required = false,
  className = "",
  disabled = false,
  allowClear = true,
}) => {
  const isStringArray = (opts: string[] | SelectOption[]): opts is string[] => {
    // Add validation to handle undefined, null, or empty arrays
    if (!opts || !Array.isArray(opts) || opts.length === 0) {
      return false;
    }
    return typeof opts[0] === "string";
  };

  // Safely handle value - convert to string and handle null/undefined
  const safeValue = value != null ? String(value) : '';
  const hasValue = safeValue && safeValue.trim() !== '';

  // Check if the current value exists in the options
  const valueExistsInOptions = () => {
    if (!options || !Array.isArray(options) || options.length === 0) {
      return false;
    }
    
    if (isStringArray(options)) {
      return options.includes(safeValue);
    } else {
      return options.some(option => option.value === safeValue);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  const handleSelectChange = (newValue: string) => {
    // Handle the special clear value
    if (newValue === "__CLEAR_SELECTION__") {
      onChange("");
    } else {
      onChange(newValue);
    }
  };

  const renderOptions = () => {
    const optionElements = [];
    
    // Add validation to ensure options exists and is an array
    if (!options || !Array.isArray(options) || options.length === 0) {
      return [];
    }
    
    // Add clear option if there's a value and clearing is allowed
    if (hasValue && allowClear) {
      optionElements.push(
        <SelectItem key="__clear__" value="__CLEAR_SELECTION__">
          <span className="text-muted-foreground italic">Clear selection</span>
        </SelectItem>
      );
    }

    // Add current value as an option if it doesn't exist in the list
    if (hasValue && !valueExistsInOptions()) {
      optionElements.push(
        <SelectItem key={`current-${safeValue}`} value={safeValue}>
          <span className="text-amber-600">{safeValue} (current)</span>
        </SelectItem>
      );
    }

    if (isStringArray(options)) {
      optionElements.push(
        ...options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))
      );
    } else {
      optionElements.push(
        ...options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))
      );
    }

    return optionElements;
  };

  const labelClasses = cn(
    "absolute left-3 transition-all duration-200 pointer-events-none z-10 px-1",
    hasValue 
      ? "top-1.5 text-xs text-primary bg-background" 
      : "top-3.5 text-base text-muted-foreground bg-transparent"
  );

  return (
    <div className={cn("relative w-full", className)}>
      <Select 
        value={hasValue ? safeValue : ""} 
        onValueChange={handleSelectChange}
        disabled={disabled}
      >
        <SelectTrigger 
          id={id} 
          className="h-12 pt-6 pb-2 px-3 w-full min-w-0 focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2" 
          aria-required={required}
        >
          <SelectValue placeholder="">
            {hasValue ? safeValue : ""}
          </SelectValue>
          {hasValue && allowClear && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-8 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded-sm transition-colors flex-shrink-0"
              aria-label="Clear selection"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
        </SelectTrigger>
        <SelectContent className="bg-background border border-border shadow-md z-50 max-w-[var(--radix-select-trigger-width)] w-full">
          {renderOptions()}
        </SelectContent>
      </Select>
      <Label 
        htmlFor={id}
        className={labelClasses}
      >
        {label}{required ? " *" : ""}
      </Label>
    </div>
  );
};

export default FloatingLabelSelect;
