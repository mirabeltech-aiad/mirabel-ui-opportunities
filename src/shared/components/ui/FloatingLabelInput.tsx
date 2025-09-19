import React, { useState, useRef, useId } from 'react'
import { cn } from '../../utils/cn'

interface FloatingLabelInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: () => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'tel' | 'url' | 'datetime-local'
  placeholder?: string
  required?: boolean
  error?: string
  disabled?: boolean
  className?: string
  modal?: boolean  // true = 36px height, false = 40px height
  step?: string
  min?: string
  max?: string
  autoComplete?: string
  'data-testid'?: string
  clearOnFocusIfZero?: boolean
}

export const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  type = 'text',
  placeholder,
  required = false,
  error,
  disabled = false,
  className = '',
  modal = false,  // false = 40px (regular), true = 36px (modal)
  step,
  min,
  max,
  autoComplete,
  'data-testid': testId,
  clearOnFocusIfZero,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const id = useId()
  const labelId = `${id}-label`
  const errorId = `${id}-error`

  const hasValue = value && value.length > 0
  // For date inputs, always float the label to avoid conflicts with browser placeholder
  const isFloating = isFocused || hasValue || type === 'date'

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    if (clearOnFocusIfZero) {
      const normalized = (value || '').trim()
      if (normalized === '0' || normalized === '0.0' || normalized === '0.00') {
        onChange('')
      }
    }
    onFocus?.(e)
  }

  const handleBlur = () => {
    setIsFocused(false)
    onBlur?.()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleLabelClick = () => {
    inputRef.current?.focus()
  }

  return (
    <div className={cn("relative mb-4 mt-3", className)}>
      <div className="relative">
        {/* Input Field */}
        <input
          ref={inputRef}
          id={id}
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={onKeyDown}
          disabled={disabled}
          placeholder={isFloating && type !== 'date' ? placeholder : ''}
          step={step}
          min={min}
          max={max}
          autoComplete={autoComplete}
          data-testid={testId}
          aria-labelledby={labelId}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={!!error}
          aria-required={required}
          className={cn(
            // Base styles
            "w-full px-3 border rounded-md transition-all duration-200 ease-out",
            "bg-white text-gray-900 placeholder-gray-400",
            "focus:outline-none focus:ring-0",

            // Exact height specifications with proper text centering
            modal
              ? "h-9 text-sm" // 36px height for modals
              : "h-10 text-base", // 40px height for regular pages

            // Padding adjustments based on floating state - better centering
            isFloating
              ? (modal ? "pt-2 pb-2" : "pt-2.5 pb-2.5") // Reduced top padding to lift text up
              : (modal ? "py-2" : "py-2.5"), // Perfectly centered when label is inside

            // Focus border colors - ocean blue
            "focus:border-ocean-600",

            // Error states
            error
              ? "border-red-300 focus:border-red-500"
              : "border-gray-300",

            // Disabled state
            disabled && "bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200",

            // Ensure proper z-index for floating label
            "relative z-0"
          )}
          {...props}
        />

        {/* Floating Label */}
        <label
          id={labelId}
          htmlFor={id}
          onClick={handleLabelClick}
          className={cn(
            "absolute left-3 transition-all duration-200 ease-out cursor-text select-none",
            "pointer-events-none bg-white px-1",

            // Floating state positioning
            isFloating
              ? cn(
                // Floating position - above the input
                modal ? "-top-2 text-xs" : "-top-2.5 text-xs",
                "font-medium z-10",
                // Ocean blue color for active floating labels
                error ? "text-red-600" : "text-ocean-600"
              )
              : cn(
                // Inside input position - better centered
                modal ? "top-2 text-sm" : "top-2.5 text-base",
                "text-gray-500 z-10"
              ),

            // Disabled state
            disabled && "text-gray-400"
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <p id={errorId} className="text-red-600 text-sm mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}