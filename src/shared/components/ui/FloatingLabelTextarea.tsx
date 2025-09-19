import React, { useState, useRef, useId } from 'react'
import { cn } from '../../utils/cn'

interface FloatingLabelTextareaProps {
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  required?: boolean
  error?: string
  disabled?: boolean
  className?: string
  rows?: number
  maxLength?: number
  modal?: boolean  // Affects padding and font size for modal contexts
  'data-testid'?: string
}

export const FloatingLabelTextarea: React.FC<FloatingLabelTextareaProps> = ({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  error,
  disabled = false,
  className = '',
  rows = 3,
  maxLength,
  modal = false,
  'data-testid': testId
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const id = useId()
  const labelId = `${id}-label`
  const errorId = `${id}-error`
  
  const hasValue = value && value.length > 0
  const isFloating = isFocused || hasValue

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
    onBlur?.()
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const handleLabelClick = () => {
    textareaRef.current?.focus()
  }

  return (
    <div className={cn("relative mb-4", className)}>
      <div className="relative">
        {/* Textarea Field */}
        <textarea
          ref={textareaRef}
          id={id}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={isFloating ? placeholder : ''}
          rows={rows}
          maxLength={maxLength}
          data-testid={testId}
          aria-labelledby={labelId}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={!!error}
          aria-required={required}
          className={cn(
            // Base styles
            "w-full px-3 border rounded-md transition-all duration-200 ease-out resize-none",
            "bg-white text-gray-900 placeholder-gray-400",
            "focus:outline-none focus:ring-2 focus:border-transparent",
            
            // Modal vs regular padding and font size
            modal 
              ? "pt-4 pb-2 text-sm" // Compact padding for modals
              : "pt-5 pb-2 text-base", // Regular padding for pages
            
            // Focus ring colors - ocean blue
            "focus:ring-ocean-500/20 focus:border-ocean-600",
            
            // Error states
            error 
              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" 
              : "border-gray-300",
            
            // Disabled state
            disabled && "bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200",
            
            // Ensure proper z-index for floating label
            "relative z-10"
          )}
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
                  // Floating position - above the textarea
                  modal ? "-top-2 text-xs" : "-top-2.5 text-xs",
                  "font-medium z-20",
                  // Ocean blue color for active floating labels
                  error ? "text-red-600" : "text-ocean-600"
                )
              : cn(
                  // Inside textarea position
                  modal ? "top-2 text-sm" : "top-2.5 text-base",
                  "text-gray-500 z-20"
                ),
            
            // Disabled state
            disabled && "text-gray-400"
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      
      {/* Character Count and Error Message */}
      {(maxLength || error) && (
        <div className="flex justify-between items-start mt-1">
          <div className="flex-1">
            {error && (
              <p id={errorId} className="text-red-600 text-sm" role="alert">
                {error}
              </p>
            )}
          </div>
          {maxLength && (
            <span className={cn(
              "text-xs flex-shrink-0 ml-2",
              value.length > maxLength * 0.9 ? "text-orange-500" : "text-gray-500",
              value.length >= maxLength ? "text-red-500 font-medium" : ""
            )}>
              {value.length}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  )
}