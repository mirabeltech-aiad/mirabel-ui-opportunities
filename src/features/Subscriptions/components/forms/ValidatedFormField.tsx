/**
 * @fileoverview Enhanced Form Field with Validation
 * 
 * Form field component with comprehensive validation, error messaging,
 * and sanitization support.
 */

import { useState, useCallback, useEffect } from 'react';
import { FieldError, FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { FieldValidationResult, ErrorMessageFormatter } from '@/lib/validation/formValidation';
import { createSanitizer, SanitizationConfig } from '@/lib/validation/sanitization';

/**
 * Enhanced form field props
 */
interface ValidatedFormFieldProps<T extends FieldValues> {
  /** Field name */
  name: FieldPath<T>;
  /** Field label */
  label: string;
  /** Field type */
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'textarea' | 'number';
  /** Required field */
  required?: boolean;
  /** Help text */
  helpText?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Form instance */
  form: UseFormReturn<T>;
  /** Custom validation function */
  customValidation?: (value: any) => FieldValidationResult;
  /** Real-time validation */
  validateOnChange?: boolean;
  /** Validation debounce delay */
  debounceMs?: number;
  /** Sanitization configuration */
  sanitization?: SanitizationConfig;
  /** Column span */
  span?: 1 | 2 | 3;
  /** Disabled state */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Show validation icons */
  showValidationIcons?: boolean;
  /** Show character count */
  showCharCount?: boolean;
  /** Maximum character length */
  maxLength?: number;
}

/**
 * Enhanced form field with validation and sanitization
 */
export function ValidatedFormField<T extends FieldValues>({
  name,
  label,
  type = 'text',
  required = false,
  helpText,
  placeholder,
  form,
  customValidation,
  validateOnChange = false,
  debounceMs = 300,
  sanitization,
  span = 1,
  disabled = false,
  className,
  showValidationIcons = true,
  showCharCount = false,
  maxLength,
}: ValidatedFormFieldProps<T>) {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<FieldValidationResult>({ isValid: true });
  const [charCount, setCharCount] = useState(0);

  // Create sanitizer if configuration provided
  const sanitizer = sanitization ? createSanitizer(sanitization) : null;

  // Get form field state
  const fieldState = form.formState.errors[name];
  const fieldValue = form.watch(name);
  const hasError = !!fieldState;

  // Update character count
  useEffect(() => {
    if (showCharCount && typeof fieldValue === 'string') {
      setCharCount(fieldValue.length);
    }
  }, [fieldValue, showCharCount]);

  // Debounced validation
  const debouncedValidation = useCallback(
    debounce((value: any) => {
      if (customValidation) {
        setIsValidating(true);
        const result = customValidation(value);
        setValidationResult(result);
        setIsValidating(false);
      }
    }, debounceMs),
    [customValidation, debounceMs]
  );

  // Handle field change with sanitization and validation
  const handleChange = useCallback(
    (value: any) => {
      let sanitizedValue = value;

      // Apply sanitization if configured
      if (sanitizer && typeof value === 'string') {
        sanitizedValue = sanitizer(value);
      }

      // Update form value
      form.setValue(name, sanitizedValue, {
        shouldValidate: !validateOnChange,
        shouldDirty: true,
        shouldTouch: true,
      });

      // Real-time validation
      if (validateOnChange && customValidation) {
        debouncedValidation(sanitizedValue);
      }
    },
    [form, name, sanitizer, validateOnChange, customValidation, debouncedValidation]
  );

  // Get validation state
  const getValidationState = () => {
    if (hasError) return 'error';
    if (validateOnChange && customValidation) {
      if (isValidating) return 'validating';
      if (!validationResult.isValid) return 'error';
      if (fieldValue && validationResult.isValid) return 'success';
    }
    return 'default';
  };

  // Get error message
  const getErrorMessage = () => {
    if (hasError) {
      const error = fieldState as FieldError;
      return ErrorMessageFormatter.formatFieldError(
        error.message || 'Invalid value',
        label,
        fieldValue
      );
    }
    
    if (validateOnChange && !validationResult.isValid) {
      return validationResult.error;
    }
    
    return null;
  };

  // Get validation icon
  const getValidationIcon = () => {
    if (!showValidationIcons) return null;

    const state = getValidationState();
    const iconClasses = "h-4 w-4";

    switch (state) {
      case 'error':
        return <AlertCircle className={cn(iconClasses, "text-destructive")} />;
      case 'success':
        return <CheckCircle className={cn(iconClasses, "text-green-600")} />;
      case 'validating':
        return <div className={cn(iconClasses, "animate-spin rounded-full border-2 border-primary border-t-transparent")} />;
      default:
        return null;
    }
  };

  // Span classes
  const spanClass = {
    1: 'col-span-1',
    2: 'col-span-1 md:col-span-2',
    3: 'col-span-1 md:col-span-2 lg:col-span-3'
  };

  const validationState = getValidationState();
  const errorMessage = getErrorMessage();

  return (
    <div className={cn("space-y-2", spanClass[span], className)}>
      {/* Label */}
      <Label 
        htmlFor={name}
        className={cn(
          "text-sm font-medium",
          hasError ? "text-destructive" : "text-foreground"
        )}
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      {/* Input container */}
      <div className="relative">
        {/* Input field */}
        {type === 'textarea' ? (
          <Textarea
            id={name}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            className={cn(
              "pr-10",
              hasError && "border-destructive focus:border-destructive",
              validationState === 'success' && "border-green-600 focus:border-green-600"
            )}
            {...form.register(name, {
              onChange: (e) => handleChange(e.target.value),
            })}
          />
        ) : (
          <Input
            id={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            className={cn(
              "pr-10",
              hasError && "border-destructive focus:border-destructive",
              validationState === 'success' && "border-green-600 focus:border-green-600"
            )}
            {...form.register(name, {
              onChange: (e) => handleChange(e.target.value),
            })}
          />
        )}

        {/* Validation icon */}
        {showValidationIcons && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {getValidationIcon()}
          </div>
        )}
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="flex items-start gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Help text */}
      {helpText && !errorMessage && (
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
          <span>{helpText}</span>
        </div>
      )}

      {/* Character count */}
      {showCharCount && maxLength && (
        <div className="text-xs text-muted-foreground text-right">
          {charCount}/{maxLength}
        </div>
      )}

      {/* Warnings */}
      {validationResult.warnings && validationResult.warnings.length > 0 && (
        <div className="text-xs text-amber-600">
          {validationResult.warnings.map((warning, index) => (
            <div key={index} className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>{warning}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Debounce utility function
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default ValidatedFormField;