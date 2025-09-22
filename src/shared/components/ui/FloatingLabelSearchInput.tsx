import React, { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { FloatingLabelInput } from './FloatingLabelInput'
import { Button } from './button'
import { cn } from '../../utils/cn'

export interface FloatingLabelSearchInputProps {
  id:string,
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  className?: string
  disabled?: boolean
  debounceMs?: number
  showClearButton?: boolean
  onClear?: () => void
  modal?: boolean  // true = 36px height, false = 40px height
  'data-testid'?: string
  isLoading?: boolean
  onClick?: (e: React.MouseEvent) => void
}

const FloatingLabelSearchInput = React.forwardRef<HTMLInputElement, FloatingLabelSearchInputProps>(
  ({
    value,
    onChange,
    label = "Search",
    placeholder = "Search...",
    className,
    disabled = false,
    debounceMs = 300,
    showClearButton = true,
    onClear,
    modal = false,
    'data-testid': testId,
    ...props
  }, ref) => {
    const [internalValue, setInternalValue] = useState(value)
    const debounceTimeoutRef = useRef<NodeJS.Timeout>()

    // Update internal value when external value changes
    useEffect(() => {
      setInternalValue(value)
    }, [value])

    // Debounced onChange handler
    useEffect(() => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }

      debounceTimeoutRef.current = setTimeout(() => {
        if (internalValue !== value) {
          onChange(internalValue)
        }
      }, debounceMs)

      return () => {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current)
        }
      }
    }, [internalValue, onChange, debounceMs, value])

    const handleInputChange = (newValue: string) => {
      setInternalValue(newValue)
    }

    const handleClear = () => {
      setInternalValue('')
      onChange('')
      onClear?.()
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        handleClear()
      }
      
    }

    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
        <div className="relative">
          <FloatingLabelInput
            label={label}
            value={internalValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            modal={modal}
            data-testid={testId}
            className={cn(
              // Add padding for clear button only
              showClearButton && internalValue && "pr-10"
            )}
            {...props}
          />

          {/* Clear Button */}
          {showClearButton && internalValue && !disabled && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "absolute right-1 h-8 w-8 p-1 hover:bg-gray-100 hover:scale-110 transition-all duration-200 rounded-full z-10",
                // Position based on modal size - center vertically in the input field
                "top-1/2 transform -translate-y-1/2"
              )}
              onClick={handleClear}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    )
  }
)

FloatingLabelSearchInput.displayName = "FloatingLabelSearchInput"

export { FloatingLabelSearchInput }