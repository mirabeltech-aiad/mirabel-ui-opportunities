
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

type AnyOption = Record<string, unknown>;
interface SelectOption {
  value: string;
  label: string;
}

interface FloatingLabelSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<string | AnyOption>;
  placeholder?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  allowClear?: boolean;
  optionValueKey?: string; // key to read the option's value (default: "value")
  optionLabelKey?: string; // key to read the option's label/text (default: "label")
  error?: string;
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
  optionValueKey = "value",
  optionLabelKey = "label",
  error = "",
}) => {
  const isStringArray = (opts: Array<string | AnyOption>): opts is string[] => {
    // Add validation to handle undefined, null, or empty arrays
    if (!opts || !Array.isArray(opts) || opts.length === 0) {
      return false;
    }
    return typeof opts[0] === "string";
  };

  // Safely handle value - convert to string and handle null/undefined
  const safeValue = value != null ? String(value) : '';
  const hasValue = safeValue && safeValue.trim() !== '';
  const hasError = typeof error === 'string' && error.trim().length > 0;

  // Utilities to extract value/label from an option object
  const getObjValue = (obj: AnyOption): string => {
    const v = (obj?.[optionValueKey] ?? obj?.value ?? obj?.Value ?? obj?.id ?? obj?.ID);
    return v != null ? String(v) : '';
  };
  const getObjLabel = (obj: AnyOption): string => {
    const v = (obj?.[optionLabelKey] ?? obj?.label ?? obj?.Label ?? obj?.Display ?? obj?.Source);
    return v != null ? String(v) : '';
  };

  const getOptionValue = (opt: string | AnyOption): string =>
    typeof opt === 'string' ? opt : getObjValue(opt);

  const getOptionLabel = (opt: string | AnyOption): string =>
    typeof opt === 'string' ? opt : getObjLabel(opt);

  // Check if the current value exists in the options
  const valueExistsInOptions = () => {
    if (!options || !Array.isArray(options) || options.length === 0) {
      return false;
    }
    return options.some((opt) => getOptionValue(opt) === safeValue);
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

    optionElements.push(
      ...options.map((opt) => {
        const v = getOptionValue(opt);
        const l = getOptionLabel(opt);
        return (
          <SelectItem key={v} value={v}>
            {l}
          </SelectItem>
        );
      })
    );

    return optionElements;
  };

  const labelClasses = cn(
    "absolute left-3 transition-all duration-200 pointer-events-none z-10 px-1",
    hasValue 
      ? cn("top-1.5 text-xs bg-background", hasError ? "text-red-600" : "text-primary") 
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
          className={cn(
            "h-12 pt-6 pb-2 px-3 w-full min-w-0 border focus:ring-2 focus:ring-offset-2",
            hasError ? "border-red-500 focus:ring-red-500" : "border-input focus:ring-ocean-500"
          )}
          aria-required={required}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? `${id}-error` : undefined}
          title={hasError ? error : undefined}
        >
          <SelectValue placeholder="">
            {hasValue
              ? (options.find((opt) => getOptionValue(opt) === safeValue) 
                  ? getOptionLabel(options.find((opt) => getOptionValue(opt) === safeValue) as string | AnyOption)
                  : safeValue)
              : ""}
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
      {hasError && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default FloatingLabelSelect;
