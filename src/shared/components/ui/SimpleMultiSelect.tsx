import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, X, Check } from 'lucide-react'

interface MultiSelectOption {
  value: string
  label: string
}

interface SimpleMultiSelectProps {
  placeholder: string
  value: string[]
  options: readonly MultiSelectOption[]
  onChange: (values: string[]) => void
  className?: string
  disabled?: boolean
  // Visual variant
  variant?: 'default' | 'filter'
  // Future enhancements (not implemented yet, but interface ready)
  searchable?: boolean        // Add search functionality
  maxSelections?: number      // Limit number of selections
  groupBy?: string           // Group options by category
  virtualized?: boolean      // For very large option lists
  showSelectAll?: boolean    // Add "Select All" option
  sortOptions?: boolean      // Auto-sort options alphabetically
  showSelectedTools?: boolean // Show search input and selected-only toggle
  sortSelectedToTop?: boolean // Move selected options to the top for visibility
  // Creation footer
  allowCreate?: boolean
  createPlaceholder?: string
  createButtonLabel?: string
  onCreateOption?: (label: string) => MultiSelectOption | undefined
}

export const SimpleMultiSelect: React.FC<SimpleMultiSelectProps> = React.memo(({
  placeholder,
  value,
  options,
  onChange,
  className = '',
  disabled = false,
  variant = 'default',
  // Future enhancement props (not implemented yet)
  searchable,
  maxSelections,
  groupBy,
  virtualized,
  showSelectAll,
  sortOptions,
  showSelectedTools = false,
  sortSelectedToTop = false,
  allowCreate = false,
  createPlaceholder = 'Add new…',
  createButtonLabel = 'Add',
  onCreateOption
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [query, setQuery] = useState('')
  const [showSelectedOnly, setShowSelectedOnly] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const [createText, setCreateText] = useState('')

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

  // Recalculate position on scroll/resize
  useEffect(() => {
    if (isOpen) {
      const handleScroll = () => calculateDropdownPosition()
      const handleResize = () => calculateDropdownPosition()
      
      window.addEventListener('scroll', handleScroll, true)
      window.addEventListener('resize', handleResize)
      
      return () => {
        window.removeEventListener('scroll', handleScroll, true)
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [isOpen])

  const handleToggleOption = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue]
    onChange(newValue)
  }

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange([])
  }

  const calculateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width
      })
    }
  }

  const handleToggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!disabled) {
      if (!isOpen) {
        // Small delay to ensure the button is rendered
        setTimeout(() => {
          calculateDropdownPosition()
        }, 0)
      }
      setIsOpen(!isOpen)
    }
  }

  const getDisplayText = () => {
    if (value.length === 0) {
      return placeholder
    }
    if (value.length === 1) {
      const option = options.find(opt => opt.value === value[0])
      return option?.label || value[0]
    }
    return `${value.length} selected`
  }

  const hasSelection = value.length > 0

  // Preserve the original option order to keep numeric sequences stable
  const originalIndexMap = React.useMemo(() => {
    const map = new Map<string, number>()
    ;(options as MultiSelectOption[]).forEach((opt, idx) => map.set(opt.value, idx))
    return map
  }, [options])

  const normalizedOptions = React.useMemo(() => {
    let list = options as MultiSelectOption[]
    if (showSelectedTools && query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(opt => (opt.label || '').toLowerCase().includes(q))
    }
    if (showSelectedTools && showSelectedOnly) {
      list = list.filter(opt => value.includes(opt.value))
    }
    // Stable ordering:
    // - If sortSelectedToTop: selected items first, but keep each group in original order
    // - Else if sortOptions: natural alphabetical as a fallback, otherwise original order
    list = list.slice().sort((a, b) => {
      if (sortSelectedToTop) {
        const aSel = value.includes(a.value) ? 1 : 0
        const bSel = value.includes(b.value) ? 1 : 0
        if (aSel !== bSel) return bSel - aSel
        // Within the same selection group, preserve original sequence
        return (originalIndexMap.get(a.value) || 0) - (originalIndexMap.get(b.value) || 0)
      }
      if (sortOptions) {
        // Basic natural-ish compare: try numeric suffix first
        const numA = parseInt((a.label || '').replace(/\D+/g, ''), 10)
        const numB = parseInt((b.label || '').replace(/\D+/g, ''), 10)
        if (!isNaN(numA) && !isNaN(numB) && numA !== numB) return numA - numB
        const cmp = (a.label || '').localeCompare(b.label || '')
        if (cmp !== 0) return cmp
      }
      // Default: original order
      return (originalIndexMap.get(a.value) || 0) - (originalIndexMap.get(b.value) || 0)
    })
    return list
  }, [options, value, query, showSelectedOnly, sortSelectedToTop, sortOptions, showSelectedTools, originalIndexMap])

  const canCreate = React.useMemo(() => {
    if (!allowCreate) return false
    const label = createText.trim()
    if (!label) return false
    const exists = (options as MultiSelectOption[]).some(opt => (opt.label || '').trim().toLowerCase() === label.toLowerCase())
    return !exists
  }, [allowCreate, createText, options])

  const handleCreate = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.stopPropagation()
    if (!canCreate || !onCreateOption) return
    const label = createText.trim()
    const created = onCreateOption(label)
    if (created) {
      if (!value.includes(created.value)) {
        onChange([...value, created.value])
      }
      setCreateText('')
    }
  }

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={handleToggleDropdown}
        className={`
          w-full h-9 px-3 text-sm transition-colors duration-200 ease-out text-left
          ${variant === 'filter'
            ? 'bg-transparent border-0 rounded-none focus:outline-none focus:ring-0'
            : `border rounded-md bg-white focus:outline-none focus:ring-2 focus:border-transparent ${disabled 
                ? 'bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200' 
                : 'border-gray-300 focus:border-ocean-500 focus:ring-ocean-500/20 hover:border-gray-400'
              } ${isOpen ? 'ring-2 ring-ocean-500/20 border-ocean-500' : ''}`
          }
          flex items-center justify-between
        `}
      >
        <span className={`truncate ${hasSelection ? 'text-gray-900' : 'text-gray-500'}`}>
          {getDisplayText()}
        </span>
        <div className="flex items-center gap-1 ml-2">
          {hasSelection && !disabled && (
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
            className={`h-4 w-4 transition-transform duration-200 text-gray-400 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </div>
      </button>

      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          data-dropdown="true"
          className="fixed z-[9999] bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-y-auto"
          style={{
            top: dropdownPosition.top || 0,
            left: dropdownPosition.left || 0,
            width: Math.max(dropdownPosition.width || 200, 200),
            minWidth: '200px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {showSelectedTools && (
            <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    e.stopPropagation()
                    setQuery(e.target.value)
                  }}
                  placeholder="Search..."
                  className="flex-1 h-8 px-2 text-sm border border-gray-300 rounded-md focus:border-ocean-500 focus:outline-none"
                />
                <label className="flex items-center gap-1 text-xs text-gray-600 select-none">
                  <input
                    type="checkbox"
                    checked={showSelectedOnly}
                    onChange={(e) => {
                      e.stopPropagation()
                      setShowSelectedOnly(e.target.checked)
                    }}
                    className="h-3.5 w-3.5"
                  />
                  Selected only
                </label>
              </div>
            </div>
          )}
          {/* Header with clear all */}
          {hasSelection && (
            <div className="flex items-center justify-between p-2 border-b border-gray-100">
              <span className="text-xs text-gray-500">{value.length} selected</span>
              <button
                type="button"
                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded"
                onClick={handleClearAll}
              >
                Clear all
              </button>
            </div>
          )}

          {/* Options */}
          <div className="py-1">
            {normalizedOptions.map((option) => {
              const isSelected = value.includes(option.value)
              return (
                <div
                  key={option.value}
                  className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={(e) => handleToggleOption(option.value, e)}
                >
                  <div className={`
                    w-4 h-4 border rounded flex items-center justify-center mr-3 flex-shrink-0
                    ${isSelected 
                      ? 'bg-ocean-600 border-ocean-600' 
                      : 'border-gray-300 hover:border-gray-400'
                    }
                  `}>
                    {isSelected && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <span className="text-sm flex-1">{option.label}</span>
                </div>
              )
            })}
          </div>

          {/* Footer */}
          {(allowCreate || options.length === 0) && (
            <div className="p-2 border-t border-gray-100">
              {options.length === 0 && !allowCreate && (
                <div className="py-2 text-center text-sm text-gray-500">No options available</div>
              )}
              {allowCreate && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={createText}
                    onChange={(e) => {
                      e.stopPropagation()
                      setCreateText(e.target.value)
                    }}
                    onKeyDown={(e) => {
                      e.stopPropagation()
                      if (e.key === 'Enter') {
                        handleCreate(e)
                      }
                    }}
                    placeholder={createPlaceholder}
                    className="flex-1 h-8 px-2 text-sm border border-gray-300 rounded-md focus:border-ocean-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCreate}
                    disabled={!canCreate}
                    className={`${'text-xs px-2.5 py-1.5 rounded'} ${canCreate ? 'bg-ocean-600 text-white hover:bg-ocean-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                  >
                    {createButtonLabel}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  )
})