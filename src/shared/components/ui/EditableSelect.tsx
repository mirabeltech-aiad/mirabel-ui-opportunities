import React, { useState, useRef, useEffect } from 'react'
import { Plus, X, Check } from 'lucide-react'
import { useEditableOptions } from '../../hooks/useEditableOptions'

interface Option {
  value: string
  label: string
}

interface EditableSelectProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  storageKey: string
  defaultOptions: Option[]
  className?: string
  disabled?: boolean
}

export function EditableSelect({
  value,
  onChange,
  placeholder = "Select option",
  label,
  storageKey,
  defaultOptions,
  className = "",
  disabled = false
}: EditableSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const {
    options,
    isAdding,
    newOptionLabel,
    setNewOptionLabel,
    startAdding,
    cancelAdding,
    confirmAdd
  } = useEditableOptions({ storageKey, defaultOptions })

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        if (isAdding) cancelAdding()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, isAdding, cancelAdding])

  // Focus input when starting to add
  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isAdding])

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  const handleAddNew = () => {
    startAdding()
  }

  const handleConfirmAdd = () => {
    if (confirmAdd()) {
      // Select the newly added option
      const newValue = newOptionLabel.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      onChange(newValue)
      setIsOpen(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleConfirmAdd()
    } else if (e.key === 'Escape') {
      cancelAdding()
    }
  }

  const selectedOption = options.find(opt => opt.value === value)

  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium text-ocean-600">{label}</label>
      )}
      
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full h-9 px-3 text-sm border border-gray-300 rounded-md focus:border-ocean-500 focus:outline-none bg-white text-left flex items-center justify-between ${
            disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'hover:border-gray-400'
          } ${className}`}
        >
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {/* Empty option */}
            <button
              type="button"
              onClick={() => handleSelect('')}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-gray-500"
            >
              {placeholder}
            </button>
            
            {/* Existing options */}
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                  value === option.value ? 'bg-ocean-50 text-ocean-700' : 'text-gray-900'
                }`}
              >
                {option.label}
              </button>
            ))}
            
            {/* Add new option */}
            <div className="border-t border-gray-100">
              {isAdding ? (
                <div className="p-2 space-y-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newOptionLabel}
                    onChange={(e) => setNewOptionLabel(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter new option name"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-ocean-500 focus:outline-none"
                  />
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={handleConfirmAdd}
                      disabled={!newOptionLabel.trim()}
                      className="flex-1 px-2 py-1 bg-ocean-600 text-white text-xs rounded hover:bg-ocean-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={cancelAdding}
                      className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleAddNew}
                  className="w-full px-3 py-2 text-left text-sm text-ocean-600 hover:bg-ocean-50 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add new option
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}