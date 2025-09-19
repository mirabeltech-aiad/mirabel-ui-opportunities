import React, { useState, useCallback, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter } from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, ChevronDown, X, Check } from 'lucide-react'

interface PowerMultiselectOption {
  value: string
  label: string
  description?: string
  category?: string
}

interface SortableChipProps {
  id: string
  label: string
  badge?: string
  onRemove: () => void
}

interface PowerMultiselectProps {
  placeholder: string
  value: string[]
  options: PowerMultiselectOption[]
  onChange: (values: string[]) => void
  label?: string
  className?: string
  maxSelections?: number
  // Chip display options
  showChips?: boolean
  chipLabel?: string
  // Custom chip rendering
  getChipLabel?: (value: string) => string
  getChipBadge?: (value: string) => string
  onRemoveChip?: (value: string) => void
}

// Simple sortable chip component
const SortableChip: React.FC<SortableChipProps> = ({ id, label, badge, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="inline-flex items-center gap-1 px-2 py-0.5 bg-ocean-50 text-ocean-800 border border-ocean-200 rounded text-xs"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-ocean-600 hover:text-ocean-800"
      >
        <GripVertical className="h-2.5 w-2.5" />
      </div>
      <span className="truncate max-w-20">{label}</span>
      {badge && (
        <span className="text-xs bg-gray-200 text-gray-700 px-1 py-0.5 rounded">
          {badge}
        </span>
      )}
      <button
        onClick={onRemove}
        className="text-ocean-600 hover:text-ocean-800 ml-0.5 text-xs"
      >
        ×
      </button>
    </div>
  )
}

/**
 * PowerMultiselect - Simple, bulletproof multi-select with clean chips
 * 
 * Features:
 * - Clean dropdown interface
 * - Simple, draggable chips
 * - No complex hiding logic
 * - Bulletproof implementation
 */
export const PowerMultiselect: React.FC<PowerMultiselectProps> = ({
  placeholder,
  value,
  options,
  onChange,
  label,
  className = '',
  maxSelections,
  showChips = true,
  chipLabel = 'Selected Items',
  getChipLabel,
  getChipBadge,
  onRemoveChip
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  
  const buttonRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Debug logging removed

  // Calculate dropdown position
  const calculateDropdownPosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      // For a fixed-position portal, coordinates should be viewport-relative (no scroll offsets)
      const position = {
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width
      }
      setDropdownPosition(position)
    }
  }, [])

  // Handle opening dropdown
  const handleToggleDropdown = useCallback(() => {
    if (!isOpen) {
      calculateDropdownPosition()
    }
    setIsOpen(!isOpen)
    setSearchTerm('')
  }, [isOpen, calculateDropdownPosition])

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
  }, [isOpen, calculateDropdownPosition])

  // Filter options based on search
  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // Debug filtering removed

  // Handle option selection
  const handleSelectOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      // Remove if already selected
      onChange(value.filter(v => v !== optionValue))
    } else {
      // Add if not selected and under max limit
      if (!maxSelections || value.length < maxSelections) {
        onChange([...value, optionValue])
      }
    }
  }

  // Handle chip removal
  const handleRemoveChip = (chipValue: string) => {
    if (onRemoveChip) {
      onRemoveChip(chipValue)
    } else {
      onChange(value.filter(v => v !== chipValue))
    }
  }

  // Get display label for chip
  const getDisplayLabel = (value: string) => {
    if (getChipLabel) {
      return getChipLabel(value)
    }
    const option = options.find(opt => opt.value === value)
    const label = option?.label || value
    // Ensure label is always a string
    return typeof label === 'string' ? label : String(label)
  }

  // Get display badge for chip
  const getDisplayBadge = (value: string) => {
    if (getChipBadge) {
      return getChipBadge(value)
    }
    const option = options.find(opt => opt.value === value)
    const badge = option?.category || option?.description || ''
    // Ensure badge is always a string
    return typeof badge === 'string' ? badge : String(badge)
  }

  // Drag and drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      const oldIndex = value.indexOf(active.id as string)
      const newIndex = value.indexOf(over.id as string)
      onChange(arrayMove(value, oldIndex, newIndex))
    }
    
    setActiveId(null)
  }

  // Clear all selections
  const handleClearAll = () => {
    onChange([])
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={`space-y-4 ${className}`}>
        {/* Label */}
        {label && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-ocean-600">{label}</label>
            <p className="text-xs text-gray-500">
              Choose which items to select. You can search and filter selections.
            </p>
          </div>
        )}

        {/* Dropdown Button */}
        <div className="relative" style={{ position: 'relative' }}>
          <div
            ref={buttonRef}
            onClick={handleToggleDropdown}
            className="w-full h-10 px-3 text-base border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-ocean-500/20 focus:border-ocean-500 hover:border-gray-400 flex items-center justify-between cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleToggleDropdown()
              }
            }}
          >
            <span className="truncate text-gray-500">
              {value.length > 0 ? `${value.length} selected` : placeholder}
            </span>
            <div className="flex items-center gap-1 ml-2">
              {value.length > 0 && (
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClearAll()
                  }}
                  className="p-0.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 cursor-pointer"
                  aria-label="Clear all selections"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleClearAll()
                    }
                  }}
                >
                  <X className="h-3 w-3" />
                </div>
              )}
              <ChevronDown 
                className={`h-4 w-4 transition-transform duration-200 text-gray-400 ${
                  isOpen ? 'rotate-180' : ''
                }`} 
              />
            </div>
          </div>

        {/* Dropdown */}
        {isOpen && createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[9999] bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-y-auto min-w-[300px]"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: Math.max(dropdownPosition.width, 300),
              minWidth: '300px',
              zIndex: 9999
            }}
            onClick={(e) => e.stopPropagation()}
            data-testid="power-multiselect-dropdown"
          >
              {/* Search */}
              <div className="p-2 border-b border-gray-100">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search options..."
                  className="w-full h-8 px-3 text-sm border border-gray-300 rounded focus:border-ocean-500 focus:outline-none focus:ring-1 focus:ring-ocean-500"
                  autoFocus
                />
              </div>

              {/* Options */}
              <div className="py-1">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => {
                    const isSelected = value.includes(option.value)
                    return (
                      <div
                        key={option.value}
                        onClick={() => handleSelectOption(option.value)}
                        className={`w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-3 cursor-pointer ${
                          isSelected ? 'bg-ocean-50 text-ocean-700' : 'text-gray-700'
                        }`}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleSelectOption(option.value)
                          }
                        }}
                      >
                        {/* Checkbox */}
                        <div className="flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}} // Handled by button click
                            className="h-4 w-4 text-ocean-600 border-gray-300 rounded focus:ring-ocean-500 focus:ring-1"
                            readOnly
                          />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{option.label}</div>
                          {option.description && (
                            <div className="text-xs text-gray-500 truncate">{option.description}</div>
                          )}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="p-3 text-center text-sm text-gray-500">
                    {searchTerm ? 'No options match your search' : 'No options available'}
                  </div>
                )}
              </div>
            </div>,
            document.body
          )}
        </div>

        {/* Simple Chips Display */}
        {showChips && value.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              {chipLabel} ({value.length})
            </div>
            <SortableContext items={value} strategy={verticalListSortingStrategy}>
              <div className="flex flex-wrap items-center gap-2">
                {value.map((itemValue) => {
                  const displayLabel = getDisplayLabel(itemValue)
                  const displayBadge = getDisplayBadge(itemValue)
                  
                  return (
                    <SortableChip
                      key={itemValue}
                      id={itemValue}
                      label={displayLabel}
                      badge={displayBadge}
                      onRemove={() => handleRemoveChip(itemValue)}
                    />
                  )
                })}
              </div>
            </SortableContext>
          </div>
        )}

        {/* Drag Overlay */}
        <DragOverlay>
          {activeId ? (
            <SortableChip
              id={activeId}
              label={getDisplayLabel(activeId)}
              badge={getDisplayBadge(activeId)}
              onRemove={() => {}}
            />
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  )
}

export default PowerMultiselect