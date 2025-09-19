// ⚠️  DEPRECATED: This component causes CSS conflicts in modal contexts
// Use SimpleMultiSelect instead for all multi-selection needs
// See: .kiro/steering/multi-select-standards.md

logger.warn('FloatingLabelMultiSelect is deprecated. Use SimpleMultiSelect instead.')

import { logger } from '../../utils/logger'

import React, { useState, useRef, useId } from 'react'
import { FloatingDropdown } from './FloatingDropdown'
import { ChevronDown, Check, X } from 'lucide-react'
import { Button } from './button'
import { useFloatingField } from '../../hooks/useFloatingField'
import { cn } from '../../utils/cn'

interface SelectOption {
  value: string
  label: string
  description?: string
  icon?: React.ReactNode
}

interface FloatingLabelMultiSelectProps {
  label: string
  value: string[]
  onChange: (value: string[]) => void
  onBlur?: () => void
  options: SelectOption[]
  placeholder?: string
  required?: boolean
  error?: string
  disabled?: boolean
  className?: string
  modal?: boolean  // true = 36px height, false = 40px height
  searchable?: boolean
  clearable?: boolean
  maxSelections?: number
  showSelectedCount?: boolean
  'data-testid'?: string
}

export const FloatingLabelMultiSelect: React.FC<FloatingLabelMultiSelectProps> = ({
  label,
  value,
  onChange,
  onBlur,
  options,
  placeholder,
  required = false,
  error,
  disabled = false,
  className = '',
  modal = false,
  searchable = false,
  maxSelections,
  showSelectedCount = true,
  'data-testid': testId
}) => {
  const { state, toggle, close } = useFloatingField()
  const [searchTerm, setSearchTerm] = useState('')
  const triggerRef = useRef<HTMLButtonElement>(null)
  const id = useId()
  const labelId = `${id}-label`
  const errorId = `${id}-error`
  
  const selectedOptions = options.filter(option => value.includes(option.value))
  const hasValue = selectedOptions.length > 0
  const isFloating = state.isOpen || hasValue

  const filteredOptions = searchable 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options

  const handleSelect = (optionValue: string) => {
    const isSelected = value.includes(optionValue)
    let newValue: string[]

    if (isSelected) {
      // Remove from selection
      newValue = value.filter(v => v !== optionValue)
    } else {
      // Add to selection (check max limit)
      if (maxSelections && value.length >= maxSelections) {
        return // Don't add if at max limit
      }
      newValue = [...value, optionValue]
    }

    onChange(newValue)
    setSearchTerm('')
    
    // Don't close dropdown for multi-select
    // close()
    // onBlur?.()
  }

  const handleRemoveSelection = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newValue = value.filter(v => v !== optionValue)
    onChange(newValue)
  }

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange([])
    close()
    onBlur?.()
  }

  const handleToggle = () => {
    if (!disabled) {
      toggle()
    }
  }

  const getDisplayText = () => {
    if (!hasValue) return ''
    
    if (selectedOptions.length === 1) {
      return selectedOptions[0].label
    }
    
    // Always show count for more than 3 selections to prevent overflow
    if (selectedOptions.length > 3 || showSelectedCount) {
      return `${selectedOptions.length} selected`
    }
    
    return selectedOptions.map(opt => opt.label).join(', ')
  }

  const displayText = getDisplayText()

  return (
    <div className={cn("relative mb-4", className)}>
      <FloatingDropdown
        isOpen={state.isOpen}
        onClose={close}
        width="w-full"
        trigger={
          <div className="relative">
            {/* Select Button */}
            <button
              ref={triggerRef}
              id={id}
              type="button"
              disabled={disabled}
              onClick={handleToggle}
              data-testid={testId}
              aria-labelledby={labelId}
              aria-describedby={error ? errorId : undefined}
              aria-invalid={!!error}
              aria-required={required}
              aria-expanded={state.isOpen}
              aria-haspopup="listbox"
              className={cn(
                // Base styles
                "w-full px-3 border rounded-md transition-all duration-200 ease-out text-left",
                "bg-white text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent",
                
                // Exact height specifications with proper text centering
                modal 
                  ? "h-9 text-sm" // 36px height for modals
                  : "h-10 text-base", // 40px height for regular pages
                
                // Padding adjustments based on floating state - better centering
                isFloating
                  ? (modal ? "pt-2 pb-2" : "pt-2.5 pb-2.5") // Reduced top padding to lift text up
                  : (modal ? "py-2" : "py-2.5"), // Match input field padding
                
                // Focus ring colors - ocean blue
                "focus:ring-ocean-500/20 focus:border-ocean-600",
                
                // Error states
                error 
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" 
                  : "border-gray-300",
                
                // Open state
                state.isOpen && !error && "ring-2 ring-ocean-500/20 border-ocean-600",
                
                // Disabled state
                disabled && "bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200",
                
                // Ensure proper z-index for floating label
                "relative z-10"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  {hasValue ? (
                    <div className="flex items-center gap-1 flex-wrap">
                      {selectedOptions.length <= 3 ? (
                        // Show individual tags for small selections
                        selectedOptions.map((option) => (
                          <span
                            key={option.value}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-ocean-100 text-ocean-800 text-xs rounded-md"
                          >
                            {option.label}
                            <button
                              type="button"
                              onClick={(e) => handleRemoveSelection(option.value, e)}
                              className="hover:bg-ocean-200 rounded-sm p-0.5"
                              aria-label={`Remove ${option.label}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))
                      ) : (
                        // Show count for large selections
                        <span className="text-gray-900 truncate">
                          {displayText}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-transparent">
                      {placeholder || 'Select options'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                  {hasValue && (
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="p-0.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
                      aria-label="Clear all selections"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                  <ChevronDown 
                    className={cn(
                      "h-4 w-4 transition-transform duration-200 text-gray-400",
                      state.isOpen && "rotate-180"
                    )} 
                  />
                </div>
              </div>
            </button>
            
            {/* Floating Label */}
            <label
              id={labelId}
              htmlFor={id}
              onClick={() => triggerRef.current?.focus()}
              className={cn(
                "absolute left-3 transition-all duration-200 ease-out cursor-text select-none",
                "pointer-events-none bg-white px-1",
                
                // Floating state positioning
                isFloating
                  ? cn(
                      // Floating position - above the input
                      modal ? "-top-2 text-xs" : "-top-2.5 text-xs",
                      "font-medium z-20",
                      // Ocean blue color for active floating labels
                      error ? "text-red-600" : "text-ocean-600"
                    )
                  : cn(
                      // Inside input position
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
        }
      >
        {searchable && (
          <div className="p-3 border-b border-gray-100">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search options..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500/20 focus:border-ocean-600"
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>
        )}

        <div className="py-1 max-h-60 overflow-y-auto">
          {maxSelections && (
            <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">
              {value.length}/{maxSelections} selected
            </div>
          )}
          
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => {
              const isSelected = value.includes(option.value)
              const isDisabled = Boolean(maxSelections && !isSelected && value.length >= maxSelections)
              
              return (
                <Button
                  key={option.value}
                  variant="ghost"
                  size="sm"
                  disabled={isDisabled}
                  className={cn(
                    "w-full justify-start h-auto p-3 text-left hover:bg-gray-50",
                    isSelected && "bg-ocean-50 text-ocean-700 hover:bg-ocean-100",
                    isDisabled && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => handleSelect(option.value)}
                >
                  <div className="flex items-center gap-3 w-full">
                    {option.icon && (
                      <span className="flex-shrink-0 text-gray-500">
                        {option.icon}
                      </span>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">
                          {option.label}
                        </span>
                        {isSelected && (
                          <Check className="h-4 w-4 text-ocean-600 flex-shrink-0" />
                        )}
                      </div>
                      {option.description && (
                        <p className="text-xs text-gray-500 mt-1">
                          {option.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Button>
              )
            })
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">
              {searchable && searchTerm ? 'No options match your search' : 'No options available'}
            </div>
          )}
        </div>
      </FloatingDropdown>
      
      {/* Error Message */}
      {error && (
        <p id={errorId} className="text-red-600 text-sm mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}