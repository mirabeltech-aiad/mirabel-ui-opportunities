import React from 'react'
import { ColumnDefinition, ColumnState, RowDensity } from '../types'
import { getValueByAccessor, getRowId } from '../utils/tableHelpers'

interface TableBodyProps<T> {
  data: T[]
  columns: ColumnDefinition<T>[]
  columnStates: ColumnState[]
  selectedRows: Set<string>
  rowDensity: RowDensity
  loading?: boolean
  error?: string | null
  onRowClick?: (row: T, index: number, event?: React.MouseEvent) => void
  onRowDoubleClick?: (row: T, index: number, event?: React.MouseEvent) => void
  onRowSelect?: (row: T) => void
  enableSelection?: boolean
  focusedRowIndex?: number
  className?: string
}

const TableBody = <T extends Record<string, any>>({
  data,
  columns,
  columnStates,
  selectedRows,
  rowDensity,
  loading = false,
  error = null,
  onRowClick,
  onRowDoubleClick,
  onRowSelect,
  enableSelection = false,
  focusedRowIndex = -1,
  className = ''
}: TableBodyProps<T>) => {
  // Get visible columns in correct order
  const visibleColumns = columnStates.length > 0 
    ? columnStates
        .filter(state => state.visible)
        .sort((a, b) => a.order - b.order)
        .map(state => ({
          definition: columns.find(col => col.id === state.id)!,
          state
        }))
        .filter(item => item.definition)
    : columns.map((column, index) => ({
        definition: column,
        state: {
          id: column.id,
          visible: true,
          width: column.width || 150,
          order: index
        }
      }))

  // Get row density classes and inline styles to bypass CSS conflicts
  const getRowClasses = (isSelected: boolean, isFocused: boolean = false) => {
    const baseClasses = 'table-row'
    
    let classes = baseClasses
    
    if (isSelected) {
      classes += ' selected'
    }
    
    if (isFocused) {
      classes += ' ring-2 ring-ocean-300'
    }
    
    return classes
  }

  // Get inline styles for row density to bypass CSS conflicts
  const getRowStyles = (): React.CSSProperties => {
    const densityStyles = {
      compact: { height: '32px', minHeight: '32px', maxHeight: '32px' },
      normal: { height: '48px', minHeight: '48px', maxHeight: '48px' },
      comfortable: { height: '64px', minHeight: '64px', maxHeight: '64px' }
    }
    
    return densityStyles[rowDensity]
  }

  // Get inline styles for cell density
  const getCellStyles = (): React.CSSProperties => {
    const cellPadding = {
      compact: { paddingTop: '6px', paddingBottom: '6px' },
      normal: { paddingTop: '12px', paddingBottom: '12px' },
      comfortable: { paddingTop: '16px', paddingBottom: '16px' }
    }
    
    return cellPadding[rowDensity]
  }

  // Get cell classes using standardized table styling
  const getCellClasses = (column: ColumnDefinition<T>) => {
    const baseClasses = 'table-cell'
    const alignClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right'
    }
    
    // Add action cell class for edit columns
    const actionClass = column.cellClassName || ''
    
    return `${baseClasses} ${alignClasses[column.align || 'left']} ${actionClass}`
  }

  // Render cell content
  const renderCellContent = (row: T, column: ColumnDefinition<T>) => {
    const value = getValueByAccessor(row, column.accessor)
    
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
      
      default:
        return String(value ?? '')
    }
  }

  // Handle row selection checkbox
  const handleRowSelect = (e: React.ChangeEvent<HTMLInputElement>, row: T) => {
    e.stopPropagation()
    onRowSelect?.(row)
  }

  // Handle row click
  const handleRowClick = (row: T, index: number, event: React.MouseEvent) => {
    onRowClick?.(row, index, event)
  }

  // Handle row double-click
  const handleRowDoubleClick = (row: T, index: number, event: React.MouseEvent) => {
    onRowDoubleClick?.(row, index, event)
  }

  // Loading state
  if (loading) {
    return (
      <tbody className={`table-body ${className}`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <tr key={`skeleton-${index}`} className={getRowClasses(false)} style={getRowStyles()}>
            {enableSelection && (
              <td className="table-cell table-cell--action" style={getCellStyles()}>
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
              </td>
            )}
            {visibleColumns.map(({ definition }) => (
              <td key={definition.id} className={getCellClasses(definition)} style={getCellStyles()}>
                <div className="h-3 bg-gray-200 rounded animate-pulse" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    )
  }

  // Error state
  if (error) {
    return (
      <tbody className={className}>
        <tr>
          <td 
            colSpan={visibleColumns.length + (enableSelection ? 1 : 0)}
            className="px-4 py-8 text-center text-red-600"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-lg">⚠️</span>
              <span>Error: {error}</span>
            </div>
          </td>
        </tr>
      </tbody>
    )
  }

  // Empty state
  if (data.length === 0) {
    return (
      <tbody className={className}>
        <tr>
          <td 
            colSpan={visibleColumns.length + (enableSelection ? 1 : 0)}
            className="px-4 py-12 text-center text-gray-500"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl">📋</span>
              <span className="text-lg font-medium">No data available</span>
              <span className="text-sm">Try adjusting your filters or add some data</span>
            </div>
          </td>
        </tr>
      </tbody>
    )
  }

  // Data rows
  return (
    <tbody className={`table-body ${className}`}>
      {data.map((row, index) => {
        const rowId = getRowId(row, 'id')
        const isSelected = selectedRows.has(rowId)
        const isFocused = focusedRowIndex === index
        
        // DEBUG (gated) – emit computed row style and container id
        if (process.env.NODE_ENV !== 'production') {
          if (index === 0 && typeof window !== 'undefined') {
            try {
              const el = document.getElementById('asset-mgmt-right') || document.getElementById('product-schedule-left')
              if (el) {
                // eslint-disable-next-line no-console
                console.log('EnhancedTable Debug → container:', el.id, 'rowDensity:', rowDensity)
              }
            } catch {}
          }
        }

        return (
          <tr
            key={rowId}
            className={`${getRowClasses(isSelected, isFocused)} ${onRowClick || onRowDoubleClick ? 'cursor-pointer' : ''}`}
            style={{ ...getRowStyles(), height: '32px', minHeight: '32px', maxHeight: '32px' }}
            onClick={(e) => handleRowClick(row, index, e)}
            onDoubleClick={(e) => handleRowDoubleClick(row, index, e)}
            role={onRowClick || onRowDoubleClick ? 'button' : undefined}
            tabIndex={isFocused ? 0 : -1}
            title="Click to edit"
            onKeyDown={(e) => {
              if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault()
                handleRowClick(row, index, e as any)
              }
            }}
          >
            {/* Selection checkbox */}
            {enableSelection && (
              <td className="table-cell table-cell--action" style={getCellStyles()}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => handleRowSelect(e, row)}
                  className="table-checkbox"
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: 'rgb(14, 165, 233)', // ocean-500
                    cursor: 'pointer'
                  }}
                  aria-label={`Select row ${index + 1}`}
                  onClick={(e) => e.stopPropagation()}
                />
              </td>
            )}
            
            {/* Data cells */}
            {visibleColumns.map(({ definition, state }) => (
              <td
                key={definition.id}
                className={getCellClasses(definition)}
                style={{ width: state.width, ...getCellStyles() }}
              >
                <div className="truncate" title={String(getValueByAccessor(row, definition.accessor) ?? '')}>
                  {renderCellContent(row, definition)}
                </div>
              </td>
            ))}
          </tr>
        )
      })}
    </tbody>
  )
}

export default TableBody