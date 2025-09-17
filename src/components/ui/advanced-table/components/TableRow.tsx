import React from 'react'
import { ColumnDefinition, ColumnState, RowDensity } from '../types'
import { getValueByAccessor, getRowId } from '../utils/tableHelpers'

interface TableRowProps<T> {
  row: T
  index: number
  columns: ColumnDefinition<T>[]
  columnStates: ColumnState[]
  isSelected: boolean
  rowDensity: RowDensity
  enableSelection?: boolean
  onRowClick?: (row: T, index: number) => void
  onRowSelect?: (rowId: string, selected: boolean) => void
  className?: string
}

const TableRow = <T extends Record<string, any>>({
  row,
  index,
  columns,
  columnStates,
  isSelected,
  rowDensity,
  enableSelection = false,
  onRowClick,
  onRowSelect,
  className = ''
}: TableRowProps<T>) => {
  const rowId = getRowId(row, 'id')
  
  // Get visible columns in correct order
  const visibleColumns = columnStates
    .filter(state => state.visible)
    .sort((a, b) => a.order - b.order)
    .map(state => ({
      definition: columns.find(col => col.id === state.id)!,
      state
    }))
    .filter(item => item.definition)

  // Get row density classes
  const getRowClasses = () => {
    const baseClasses = 'border-b border-gray-200 transition-colors'
    const densityClasses = {
      compact: 'h-8',
      normal: 'h-12',
      comfortable: 'h-16'
    }
    
    let classes = `${baseClasses} ${densityClasses[rowDensity]}`
    
    if (isSelected) {
      classes += ' bg-ocean-50 border-ocean-200'
    } else {
      classes += ' hover:bg-gray-50'
    }
    
    if (onRowClick) {
      classes += ' cursor-pointer'
    }
    
    return `${classes} ${className}`
  }

  // Handle row selection
  const handleRowSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    onRowSelect?.(rowId, e.target.checked)
  }

  // Handle row click
  const handleRowClick = () => {
    onRowClick?.(row, index)
  }

  return (
    <tr
      className={getRowClasses()}
      onClick={handleRowClick}
      role={onRowClick ? 'button' : undefined}
      tabIndex={onRowClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          handleRowClick()
        }
      }}
      aria-selected={isSelected}
    >
      {/* Selection checkbox */}
      {enableSelection && (
        <td className="px-4 py-2 w-12">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleRowSelect}
            className="h-4 w-4 text-ocean-600 focus:ring-ocean-500 border-gray-300 rounded"
            aria-label={`Select row ${index + 1}`}
          />
        </td>
      )}
      
      {/* Data cells */}
      {visibleColumns.map(({ definition, state }) => (
        <TableCell
          key={definition.id}
          row={row}
          column={definition}
          columnState={state}
          value={getValueByAccessor(row, definition.accessor)}
        />
      ))}
    </tr>
  )
}

// TableCell component for individual cells
interface TableCellProps<T> {
  row: T
  column: ColumnDefinition<T>
  columnState: ColumnState
  value: any
  className?: string
}

const TableCell = <T extends Record<string, any>>({
  row,
  column,
  columnState,
  value,
  className = ''
}: TableCellProps<T>) => {
  // Get cell classes
  const getCellClasses = () => {
    const baseClasses = 'px-4 py-2 text-sm'
    const alignClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right'
    }
    
    return `${baseClasses} ${alignClasses[column.align || 'left']} ${column.cellClassName || ''} ${className}`
  }

  // Render cell content
  const renderCellContent = () => {
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
      
      default:
        return String(value ?? '')
    }
  }

  return (
    <td
      className={getCellClasses()}
      style={{ width: columnState.width }}
    >
      <div className="truncate" title={String(value ?? '')}>
        {renderCellContent()}
      </div>
    </td>
  )
}

export default TableRow
export { TableCell }