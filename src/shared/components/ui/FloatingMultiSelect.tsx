import React from 'react'
import { FloatingDropdown } from './FloatingDropdown'
import { TriggerButton } from './TriggerButton'
import { DropdownSection, DropdownSeparator } from './DropdownSection'
import { Button } from './button'
import { Badge } from './badge'
import { Check, X, Search } from 'lucide-react'
import { useFloatingField } from '../../hooks/useFloatingField'
import { cn } from '../../utils/cn'

interface MultiSelectOption {
  value: string
  label: string
  description?: string
  icon?: React.ReactNode
  category?: string
}

interface FloatingMultiSelectProps {
  value: string[]
  onChange: (value: string[]) => void
  options: MultiSelectOption[]
  placeholder?: string
  label?: string
  icon?: React.ReactNode
  error?: string
  disabled?: boolean
  className?: string
  width?: string
  maxSelections?: number
  searchable?: boolean
  showSelectedCount?: boolean
}

export const FloatingMultiSelect: React.FC<FloatingMultiSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select options",
  label,
  icon,
  error,
  disabled = false,
  className = '',
  width = 'w-80',
  maxSelections,
  searchable = true,
  showSelectedCount = true
}) => {
  const { state, toggle, close } = useFloatingField()
  const [searchTerm, setSearchTerm] = React.useState('')

  const selectedOptions = options.filter(option => value.includes(option.value))
  const hasSelections = selectedOptions.length > 0

  const filteredOptions = searchable 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options

  // Group options by category if categories exist
  const categorizedOptions = React.useMemo(() => {
    const categories: Record<string, MultiSelectOption[]> = {}
    const uncategorized: MultiSelectOption[] = []

    filteredOptions.forEach(option => {
      if (option.category) {
        if (!categories[option.category]) {
          categories[option.category] = []
        }
        categories[option.category].push(option)
      } else {
        uncategorized.push(option)
      }
    })

    return { categories, uncategorized }
  }, [filteredOptions])

  const handleToggleOption = (optionValue: string) => {
    const isSelected = value.includes(optionValue)
    
    if (isSelected) {
      onChange(value.filter(v => v !== optionValue))
    } else {
      if (maxSelections && value.length >= maxSelections) {
        return // Don't add if max selections reached
      }
      onChange([...value, optionValue])
    }
  }

  const handleRemoveOption = (optionValue: string) => {
    onChange(value.filter(v => v !== optionValue))
  }

  const handleClearAll = () => {
    onChange([])
  }

  const getDisplayText = () => {
    if (!hasSelections) return placeholder
    if (selectedOptions.length === 1) return selectedOptions[0].label
    return `${selectedOptions.length} selected`
  }

  const renderOption = (option: MultiSelectOption) => {
    const isSelected = value.includes(option.value)
    const isDisabled = !isSelected && !!maxSelections && value.length >= maxSelections

    return (
      <Button
        key={option.value}
        variant="ghost"
        size="sm"
        disabled={isDisabled}
        className={cn(
          "w-full justify-start h-auto p-3 text-left hover:bg-gray-50",
          isSelected && "bg-blue-50 text-blue-700 hover:bg-blue-100",
          isDisabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={() => handleToggleOption(option.value)}
      >
        <div className="flex items-center gap-3 w-full">
          <div className={cn(
            "w-4 h-4 border rounded flex items-center justify-center flex-shrink-0",
            isSelected 
              ? "bg-blue-600 border-blue-600" 
              : "border-gray-300"
          )}>
            {isSelected && (
              <Check className="h-3 w-3 text-white" />
            )}
          </div>
          
          {option.icon && (
            <span className="flex-shrink-0 text-gray-500">
              {option.icon}
            </span>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">
              {option.label}
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
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-ocean-600 mb-2">
          {label}
        </label>
      )}
      
      <FloatingDropdown
        isOpen={state.isOpen}
        onClose={close}
        width={width}
        maxHeight="max-h-80"
        trigger={
          <TriggerButton
            isOpen={state.isOpen}
            hasActiveState={hasSelections}
            activeCount={showSelectedCount ? selectedOptions.length : 0}
            icon={icon}
            label={getDisplayText()}
            placeholder={placeholder}
            onClick={toggle}
            disabled={disabled}
            error={!!error}
          />
        }
      >
        {/* Selected Items Section */}
        {hasSelections && (
          <>
            <DropdownSection title="Selected">
              <div className="flex flex-wrap gap-2">
                {selectedOptions.map(option => (
                  <Badge
                    key={option.value}
                    variant="secondary"
                    className="flex items-center gap-1 text-xs"
                  >
                    {option.label}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveOption(option.value)
                      }}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-gray-500">
                  {selectedOptions.length} selected
                  {maxSelections && ` of ${maxSelections} max`}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleClearAll}
                >
                  Clear all
                </Button>
              </div>
            </DropdownSection>
            <DropdownSeparator />
          </>
        )}

        {/* Search */}
        {searchable && (
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search options..."
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onClick={(e) => e.stopPropagation()}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Options */}
        <div className="py-1 max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            <>
              {/* Categorized Options */}
              {Object.entries(categorizedOptions.categories).map(([category, categoryOptions]) => (
                <div key={category}>
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50">
                    {category}
                  </div>
                  {categoryOptions.map(renderOption)}
                </div>
              ))}
              
              {/* Uncategorized Options */}
              {categorizedOptions.uncategorized.map(renderOption)}
            </>
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">
              {searchable && searchTerm ? 'No options match your search' : 'No options available'}
            </div>
          )}
        </div>
      </FloatingDropdown>

      {error && (
        <p className="text-red-600 text-sm mt-1">{error}</p>
      )}
    </div>
  )
}