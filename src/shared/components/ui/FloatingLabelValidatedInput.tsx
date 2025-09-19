import React, { useState, useEffect } from 'react'
import { FloatingLabelInput } from './FloatingLabelInput'
import { Check, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

interface ValidationRule {
  validate: (value: string) => Promise<boolean> | boolean
  message: string
  trigger?: 'onChange' | 'onBlur' | 'onSubmit'
}

interface FloatingLabelValidatedInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  onValidationChange?: (isValid: boolean, error?: string) => void
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'tel' | 'url'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  modal?: boolean
  step?: string
  min?: string
  max?: string
  autoComplete?: string
  validationRules?: ValidationRule[]
  validateOnBlur?: boolean
  validateOnChange?: boolean
  showValidationIcon?: boolean
  debounceMs?: number
  'data-testid'?: string
}

export const FloatingLabelValidatedInput: React.FC<FloatingLabelValidatedInputProps> = ({
  label,
  value,
  onChange,
  onBlur,
  onValidationChange,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  className = '',
  modal = false,
  step,
  min,
  max,
  autoComplete,
  validationRules = [],
  validateOnBlur = true,
  validateOnChange = false,
  showValidationIcon = true,
  debounceMs = 300,
  'data-testid': testId,
  ...props
}) => {
  const [error, setError] = useState<string>('')
  const [isValidating, setIsValidating] = useState(false)
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null)

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout)
      }
    }
  }, [debounceTimeout])

  const validateValue = async (inputValue: string, trigger: 'onChange' | 'onBlur' | 'onSubmit') => {
    // Required field validation
    if (required && !inputValue.trim()) {
      const errorMessage = `${label} is required`
      setError(errorMessage)
      setIsValid(false)
      onValidationChange?.(false, errorMessage)
      return false
    }

    // Skip other validations if field is empty and not required
    if (!inputValue.trim() && !required) {
      setError('')
      setIsValid(null)
      onValidationChange?.(true)
      return true
    }

    // Run validation rules
    for (const rule of validationRules) {
      // Skip rule if trigger doesn't match
      if (rule.trigger && rule.trigger !== trigger) {
        continue
      }

      try {
        setIsValidating(true)
        const isRuleValid = await rule.validate(inputValue)
        
        if (!isRuleValid) {
          setError(rule.message)
          setIsValid(false)
          setIsValidating(false)
          onValidationChange?.(false, rule.message)
          return false
        }
      } catch (validationError) {
        console.error('Validation error:', validationError)
        const errorMessage = 'Validation failed'
        setError(errorMessage)
        setIsValid(false)
        setIsValidating(false)
        onValidationChange?.(false, errorMessage)
        return false
      }
    }

    // All validations passed
    setError('')
    setIsValid(true)
    setIsValidating(false)
    onValidationChange?.(true)
    return true
  }

  const handleChange = (newValue: string) => {
    onChange(newValue)

    // Clear previous timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }

    // Reset validation state immediately on change
    if (validateOnChange) {
      setIsValid(null)
      setError('')
    }

    // Debounced validation on change
    if (validateOnChange && newValue !== value) {
      const timeout = setTimeout(() => {
        validateValue(newValue, 'onChange')
      }, debounceMs)
      setDebounceTimeout(timeout)
    }
  }

  const handleBlur = () => {
    onBlur?.()

    // Clear any pending debounced validation
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
      setDebounceTimeout(null)
    }

    // Validate on blur if enabled
    if (validateOnBlur) {
      validateValue(value, 'onBlur')
    }
  }

  // Public method to trigger validation (useful for form submission)
  const validate = () => validateValue(value, 'onSubmit')

  // Note: validate method is available but not exposed via ref
  // If ref access is needed, convert this component to use forwardRef

  // Determine validation icon
  const getValidationIcon = () => {
    if (!showValidationIcon || (!value.trim() && !required)) {
      return null
    }

    if (isValidating) {
      return <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
    }

    if (isValid === true) {
      return <Check className="h-4 w-4 text-green-500" />
    }

    if (isValid === false || error) {
      return <AlertCircle className="h-4 w-4 text-red-500" />
    }

    return null
  }

  const validationIcon = getValidationIcon()

  return (
    <div className={cn("relative", className)}>
      <FloatingLabelInput
        label={label}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        type={type}
        placeholder={placeholder}
        required={required}
        error={error}
        disabled={disabled}
        modal={modal}
        step={step}
        min={min}
        max={max}
        autoComplete={autoComplete}
        data-testid={testId}
        className={cn(
          // Add padding for validation icon if present
          validationIcon && "pr-10"
        )}
        {...props}
      />
      
      {/* Validation Icon */}
      {validationIcon && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          {validationIcon}
        </div>
      )}
    </div>
  )
}

// Export validation rule helpers
export const createValidationRule = (
  validate: (value: string) => Promise<boolean> | boolean,
  message: string,
  trigger: 'onChange' | 'onBlur' | 'onSubmit' = 'onBlur'
): ValidationRule => ({
  validate,
  message,
  trigger
})

// Common validation rules
export const validationRules = {
  email: createValidationRule(
    (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value)
    },
    'Please enter a valid email address'
  ),

  minLength: (length: number) => createValidationRule(
    (value: string) => value.length >= length,
    `Must be at least ${length} characters long`
  ),

  maxLength: (length: number) => createValidationRule(
    (value: string) => value.length <= length,
    `Must be no more than ${length} characters long`
  ),

  pattern: (regex: RegExp, message: string) => createValidationRule(
    (value: string) => regex.test(value),
    message
  ),

  custom: (
    validator: (value: string) => Promise<boolean> | boolean,
    message: string,
    trigger?: 'onChange' | 'onBlur' | 'onSubmit'
  ) => createValidationRule(validator, message, trigger),

  // Async validation example (like SKU availability)
  asyncUnique: (
    checkUnique: (value: string) => Promise<boolean>,
    message: string = 'This value is already taken'
  ) => createValidationRule(
    async (value: string) => {
      if (!value.trim()) return true // Skip if empty
      return await checkUnique(value)
    },
    message,
    'onBlur' // Only check on blur to avoid too many API calls
  )
}