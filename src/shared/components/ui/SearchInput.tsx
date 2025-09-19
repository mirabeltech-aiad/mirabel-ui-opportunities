import React, { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from './input'
import { Button } from './button'
import { cn } from '../../utils/cn'

export interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  debounceMs?: number
  showClearButton?: boolean
  onClear?: () => void
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ 
    value, 
    onChange, 
    placeholder = "Search...", 
    className, 
    disabled = false,
    debounceMs = 300,
    showClearButton = true,
    onClear,
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value)
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
          <Input
            ref={ref}
            type="text"
            value={internalValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "h-9",
              showClearButton && internalValue && "pr-10",
              !showClearButton && "pr-3"
            )}
            aria-label="Search"
            {...props}
          />
          {showClearButton && internalValue && !disabled && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-1 hover:bg-gray-100 hover:scale-110 transition-all duration-200 rounded-full z-10"
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

SearchInput.displayName = "SearchInput"

export { SearchInput }