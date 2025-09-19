import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, X, Search } from 'lucide-react'

interface SelectOption {
  value: string
  label: string
}

interface SimpleSelectProps {
  placeholder: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
  clearable?: boolean
  searchable?: boolean
  searchPlaceholder?: string
}

export const SimpleSelect: React.FC<SimpleSelectProps> = ({
  placeholder,
  value,
  options,
  onChange,
  className = '',
  disabled = false,
  clearable = false,
  searchable = false,
  searchPlaceholder = 'Search...'
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen, searchable])

  // Filter options based on search term
  const filteredOptions = searchable && searchTerm
    ? options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.value.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : options

  const handleSelectOption = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(optionValue)
    setIsOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
  }

  const handleToggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!disabled) {
      setIsOpen(!isOpen)
      if (!isOpen) {
        setSearchTerm('') // Reset search when opening
      }
    }
  }

  const getDisplayText = () => {
    if (!value) {
      return placeholder
    }
    const option = options.find(opt => opt.value === value)
    return option?.label || value
  }

  const hasSelection = Boolean(value)

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={handleToggleDropdown}
        className={`
          w-full h-9 px-3 text-sm border rounded-md transition-colors duration-200 ease-out text-left
          bg-white focus:outline-none focus:ring-2 focus:border-transparent
          ${disabled 
            ? 'bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200' 
            : 'border-gray-300 focus:border-ocean-500 focus:ring-ocean-500/20 hover:border-gray-400'
          }
          ${isOpen ? 'ring-2 ring-ocean-500/20 border-ocean-500' : ''}
          flex items-center justify-between
        `}
      >
        <span className={`truncate ${hasSelection ? 'text-gray-900' : 'text-gray-500'}`}>
          {getDisplayText()}
        </span>
        <div className="flex items-center gap-1 ml-2">
          {hasSelection && clearable && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
              aria-label="Clear selection"
            >
              <X className="h-3 w-3" />
            </button>
          )}
          <ChevronDown 
            className={`h-4 w-4 transition-transform duration-200 text-gray-400 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </div>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          {searchable && (
            <div className="p-2 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          {/* Options */}
          <div className="py-1 overflow-y-auto max-h-48">
            {filteredOptions.map((option) => {
              const isSelected = value === option.value
              return (
                <div
                  key={option.value}
                  className={`
                    px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors text-sm
                    ${isSelected ? 'bg-ocean-50 text-ocean-900 font-medium' : 'text-gray-900'}
                  `}
                  onClick={(e) => handleSelectOption(option.value, e)}
                >
                  {option.label}
                </div>
              )
            })}
          </div>

          {/* Empty state */}
          {filteredOptions.length === 0 && (
            <div className="p-4 text-center text-sm text-gray-500">
              {searchable && searchTerm ? 'No matching options found' : 'No options available'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}