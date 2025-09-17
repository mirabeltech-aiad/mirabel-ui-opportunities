import React from 'react'
import { FloatingDropdown } from './FloatingDropdown'
import { TriggerButton } from './TriggerButton'
import { DropdownSection } from './DropdownSection'
import { Button } from './button'
import { Check } from 'lucide-react'
import { useFloatingField } from '../../hooks/useFloatingField'
import { cn } from '../../utils/cn'

interface SelectOption {
  value: string
  label: string
  description?: string
  icon?: React.ReactNode
}

interface FloatingSelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  label?: string
  icon?: React.ReactNode
  error?: string
  disabled?: boolean
  className?: string
  width?: string
  searchable?: boolean
}

export const FloatingSelect: React.FC<FloatingSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  label,
  icon,
  error,
  disabled = false,
  className = '',
  width = 'w-80',
  searchable = false
}) => {
  const { state, toggle, close } = useFloatingField()
  const [searchTerm, setSearchTerm] = React.useState('')

  const selectedOption = options.find(option => option.value === value)
  const hasSelection = !!selectedOption

  const filteredOptions = searchable 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    close()
    setSearchTerm('')
  }

  const displayLabel = selectedOption?.label || placeholder

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
        trigger={
          <TriggerButton
            isOpen={state.isOpen}
            hasActiveState={hasSelection}
            icon={icon}
            label={displayLabel}
            placeholder={placeholder}
            onClick={toggle}
            disabled={disabled}
            error={!!error}
          />
        }
      >
        {searchable && (
          <div className="p-3 border-b border-gray-100">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search options..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        <div className="py-1 max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <Button
                key={option.value}
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start h-auto p-3 text-left hover:bg-gray-50",
                  option.value === value && "bg-blue-50 text-blue-700 hover:bg-blue-100"
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
                      {option.value === value && (
                        <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
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
            ))
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