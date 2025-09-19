import React, { useState, useRef, useEffect } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { getFilterClasses, filterA11y, filterPerformance } from '../../styles/filterStyles'

interface EnhancedSearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  loading?: boolean
  debounceMs?: number
  showClearButton?: boolean
  'aria-label'?: string
  onFocus?: () => void
  onBlur?: () => void
  onClear?: () => void
}

export const EnhancedSearchInput: React.FC<EnhancedSearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  disabled = false,
  loading = false,
  debounceMs = 300,
  showClearButton = true,
  'aria-label': ariaLabel,
  onFocus,
  onBlur,
  onClear
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [internalValue, setInternalValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounced onChange handler
  const debouncedOnChange = React.useMemo(
    () => filterPerformance.debounce(onChange, debounceMs),
    [onChange, debounceMs]
  )

  // Update internal value when external value changes
  useEffect(() => {
    setInternalValue(value)
  }, [value])

  // Handle input change with debouncing
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setInternalValue(newValue)
    debouncedOnChange(newValue)
  }

  // Handle clear button
  const handleClear = () => {
    setInternalValue('')
    onChange('')
    onClear?.()
    inputRef.current?.focus()
  }

  // Handle focus events
  const handleFocus = () => {
    setIsFocused(true)
    onFocus?.()
  }

  const handleBlur = () => {
    setIsFocused(false)
    onBlur?.()
  }

  // Handle keyboard events
  const handleKeyDown = (event: React.KeyboardEvent) => {
    filterA11y.keyboard.handleKeyDown(event, {
      onEscape: () => {
        if (internalValue) {
          handleClear()
        } else {
          inputRef.current?.blur()
        }
      }
    })
  }

  const isActive = internalValue.trim() !== ''
  const searchClasses = getFilterClasses.search(isActive || isFocused)

  return (
    <div className={`relative ${className}`}>
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {loading ? (
          <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
        ) : (
          <Search className={getFilterClasses.icon(isActive)} />
        )}
      </div>

      {/* Input Field */}
      <input
        ref={inputRef}
        type="text"
        value={internalValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled || loading}
        className={`${searchClasses} pl-10 ${showClearButton && isActive ? 'pr-10' : 'pr-3'}`}
        aria-label={ariaLabel || `Search input. ${isActive ? `Current search: ${internalValue}` : 'No search active'}`}
        aria-describedby={isActive ? 'search-status' : undefined}
      />

      {/* Clear Button */}
      {showClearButton && isActive && !loading && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-md transition-colors duration-150"
          aria-label={filterA11y.labels.clearFilter('search')}
          tabIndex={-1} // Prevent tab focus, use keyboard shortcut instead
        >
          <X className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors duration-150" />
        </button>
      )}

      {/* Screen reader status */}
      {isActive && (
        <div id="search-status" className="sr-only">
          Search active with query: {internalValue}
        </div>
      )}
    </div>
  )
}

// Export both enhanced and legacy versions for compatibility
export { SearchInput } from './SearchInput' // Re-export legacy version
export default EnhancedSearchInput