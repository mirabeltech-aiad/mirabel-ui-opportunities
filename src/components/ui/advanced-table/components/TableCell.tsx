import React, { useState } from 'react'
import { ColumnDefinition, ColumnState } from '../types'

interface TableCellProps<T> {
  row: T
  column: ColumnDefinition<T>
  columnState: ColumnState
  value: any
  isEditing?: boolean
  onEdit?: (value: any) => void
  onCancelEdit?: () => void
  className?: string
}

const TableCell = <T extends Record<string, any>>({
  row,
  column,
  columnState,
  value,
  isEditing = false,
  onEdit,
  onCancelEdit,
  className = ''
}: TableCellProps<T>) => {
  const [editValue, setEditValue] = useState(value)
  const [validationError, setValidationError] = useState<string | null>(null)

  // Get cell classes
  const getCellClasses = () => {
    const baseClasses = 'px-4 py-2 text-sm relative'
    const alignClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right'
    }
    
    let classes = `${baseClasses} ${alignClasses[column.align || 'left']} ${column.cellClassName || ''} ${className}`
    
    if (column.editable && !isEditing) {
      classes += ' hover:bg-gray-50 cursor-pointer'
    }
    
    if (isEditing) {
      classes += ' bg-white border border-ocean-300 shadow-sm'
    }
    
    return classes
  }

  // Handle edit save
  const handleSave = () => {
    // Validate if validator is provided
    if (column.validator) {
      const validation = column.validator(editValue)
      if (validation !== true) {
        setValidationError(typeof validation === 'string' ? validation : 'Invalid value')
        return
      }
    }
    
    setValidationError(null)
    onEdit?.(editValue)
  }

  // Handle edit cancel
  const handleCancel = () => {
    setEditValue(value)
    setValidationError(null)
    onCancelEdit?.()
  }

  // Handle key press in edit mode
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  // Render edit input based on column type
  const renderEditInput = () => {
    const inputClasses = "w-full px-2 py-1 text-sm border-0 outline-none bg-transparent"
    
    switch (column.type) {
      case 'number':
      case 'currency':
        return (
          <input
            type="number"
            value={editValue || ''}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleSave}
            className={inputClasses}
            autoFocus
          />
        )
      
      case 'date':
        return (
          <input
            type="date"
            value={editValue || ''}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleSave}
            className={inputClasses}
            autoFocus
          />
        )
      
      case 'datetime':
        return (
          <input
            type="datetime-local"
            value={editValue || ''}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleSave}
            className={inputClasses}
            autoFocus
          />
        )
      
      case 'boolean':
        return (
          <select
            value={editValue ? 'true' : 'false'}
            onChange={(e) => setEditValue(e.target.value === 'true')}
            onKeyDown={handleKeyPress}
            onBlur={handleSave}
            className={inputClasses}
            autoFocus
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        )
      
      case 'select':
        return (
          <select
            value={editValue || ''}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleSave}
            className={inputClasses}
            autoFocus
          >
            <option value="">Select...</option>
            {column.filterOptions?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      
      default:
        return (
          <input
            type="text"
            value={editValue || ''}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleSave}
            className={inputClasses}
            autoFocus
          />
        )
    }
  }

  // Render display content
  const renderDisplayContent = () => {
    if (column.render) {
      return column.render(value, row, column)
    }
    
    // Default rendering based on column type
    switch (column.type) {
      case 'boolean':
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {value ? 'Yes' : 'No'}
          </span>
        )
      
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(Number(value) || 0)
      
      case 'percentage':
        return `${(Number(value) || 0).toFixed(1)}%`
      
      case 'date':
        return value ? new Date(value).toLocaleDateString() : ''
      
      case 'datetime':
        return value ? new Date(value).toLocaleString() : ''
      
      case 'time':
        return value ? new Date(`2000-01-01T${value}`).toLocaleTimeString() : ''
      
      case 'number':
        return Number(value).toLocaleString()
      
      case 'badge':
        return (
          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            {String(value ?? '')}
          </span>
        )
      
      case 'email':
        return value ? (
          <a 
            href={`mailto:${value}`} 
            className="text-ocean-600 hover:text-ocean-800 underline"
            onClick={(e) => e.stopPropagation()}
          >
            {value}
          </a>
        ) : ''
      
      case 'url':
        return value ? (
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-ocean-600 hover:text-ocean-800 underline"
            onClick={(e) => e.stopPropagation()}
          >
            {value}
          </a>
        ) : ''
      
      case 'phone':
        return value ? (
          <a 
            href={`tel:${value}`} 
            className="text-ocean-600 hover:text-ocean-800 underline"
            onClick={(e) => e.stopPropagation()}
          >
            {value}
          </a>
        ) : ''
      
      case 'image':
        return value ? (
          <img 
            src={value} 
            alt="Cell image" 
            className="h-8 w-8 object-cover rounded"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : ''
      
      case 'progress':
        const percentage = Math.min(100, Math.max(0, Number(value) || 0))
        return (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-ocean-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        )
      
      case 'rating':
        const rating = Number(value) || 0
        const maxRating = 5
        return (
          <div className="flex items-center gap-1">
            {Array.from({ length: maxRating }).map((_, i) => (
              <span 
                key={i} 
                className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </span>
            ))}
          </div>
        )
      
      default:
        return String(value ?? '')
    }
  }

  return (
    <td
      className={getCellClasses()}
      style={{ width: columnState.width }}
      onDoubleClick={() => {
        if (column.editable && !isEditing && onEdit) {
          // Start editing mode would be handled by parent component
        }
      }}
    >
      <div className="relative">
        {isEditing ? (
          <div className="min-h-[1.5rem]">
            {renderEditInput()}
            {validationError && (
              <div className="absolute top-full left-0 mt-1 text-xs text-red-600 bg-white border border-red-200 rounded px-2 py-1 shadow-sm z-10">
                {validationError}
              </div>
            )}
          </div>
        ) : (
          <div className="truncate" title={String(value ?? '')}>
            {renderDisplayContent()}
          </div>
        )}
        
        {/* Edit indicator */}
        {column.editable && !isEditing && (
          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs text-gray-400">✏️</span>
          </div>
        )}
      </div>
    </td>
  )
}

export default TableCell