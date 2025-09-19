import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface SelectOption {
  value: string
  label: string
  description?: string
}

interface SimpleFloatingSelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  label?: string
  icon?: React.ReactNode
  error?: string
  disabled?: boolean
  searchable?: boolean
}

export const SimpleFloatingSelect: React.FC<SimpleFloatingSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  label,
  icon,
  error,
  disabled = false,
  searchable = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(option => option.value === value)
  const displayLabel = selectedOption?.label || placeholder

  const filteredOptions = searchable 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-ocean-600 mb-2">
          {label}
        </label>
      )}
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`
          w-full h-10 px-3 flex items-center justify-between gap-2 
          border rounded-md bg-white text-left transition-all duration-200
          ${error 
            ? 'border-red-300 bg-red-50 text-red-700' 
            : selectedOption 
              ? 'border-blue-300 bg-blue-50 text-blue-700' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }
          ${isOpen ? 'ring-2 ring-blue-300 ring-opacity-50' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {icon && (
            <span className={`flex-shrink-0 ${selectedOption ? 'text-blue-600' : 'text-gray-500'}`}>
              {icon}
            </span>
          )}
          <span className={`text-sm font-medium truncate ${!selectedOption ? 'text-gray-500' : ''}`}>
            {displayLabel}
          </span>
        </div>
        
        <ChevronDown 
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          } ${selectedOption ? 'text-blue-600' : 'text-gray-400'}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-hidden">
          {searchable && (
            <div className="p-3 border-b border-gray-100">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search options..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          <div className="py-1 max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`
                    w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center justify-between
                    ${option.value === value ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}
                  `}
                >
                  <div className="flex-1">
                    <div className="font-medium">{option.label}</div>
                    {option.description && (
                      <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                    )}
                  </div>
                  {option.value === value && (
                    <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  )}
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                {searchable && searchTerm ? 'No options match your search' : 'No options available'}
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="text-red-600 text-sm mt-1">{error}</p>
      )}
    </div>
  )
}