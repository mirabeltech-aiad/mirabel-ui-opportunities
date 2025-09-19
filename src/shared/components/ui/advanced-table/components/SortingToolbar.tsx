import React from 'react'
import { Button } from '../../button'
import { SortConfig, ColumnDefinition } from '../types'
import { X, ArrowUp, ArrowDown } from 'lucide-react'
import { SortingResetButton } from '../../ResetButton'

interface SortingToolbarProps<T> {
  columns: ColumnDefinition<T>[]
  sortConfig: SortConfig[]
  onRemoveSort: (columnId: string) => void
  onClearSort: () => void
  onChangeSortDirection: (columnId: string, direction: 'asc' | 'desc') => void
  className?: string
}

const SortingToolbar = <T extends Record<string, any>>({
  columns,
  sortConfig,
  onRemoveSort,
  onClearSort,
  onChangeSortDirection,
  className = ''
}: SortingToolbarProps<T>) => {
  if (sortConfig.length === 0) {
    return null
  }

  // Get column name by ID
  const getColumnName = (columnId: string): string => {
    const column = columns.find(col => col.id === columnId)
    return typeof column?.header === 'string' ? column.header : columnId
  }

  // Get sorted columns in priority order
  const sortedColumns = [...sortConfig].sort((a, b) => a.priority - b.priority)

  return (
    <div className={`flex items-center gap-2 p-3 bg-ocean-50 border border-ocean-200 rounded-md ${className}`}>
      <div className="flex items-center gap-2 flex-1">
        <span className="text-sm font-medium text-ocean-800">
          Sorted by:
        </span>
        
        <div className="flex items-center gap-2 flex-wrap">
          {sortedColumns.map((sort, index) => (
            <div
              key={sort.columnId}
              className="flex items-center gap-1 bg-white border border-ocean-200 rounded px-2 py-1"
            >
              {/* Priority indicator for multiple sorts */}
              {sortConfig.length > 1 && (
                <span className="text-xs text-ocean-600 font-medium bg-ocean-100 rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center">
                  {index + 1}
                </span>
              )}
              
              {/* Column name */}
              <span className="text-sm text-gray-700">
                {getColumnName(sort.columnId)}
              </span>
              
              {/* Direction toggle button */}
              <button
                onClick={() => onChangeSortDirection(
                  sort.columnId, 
                  sort.direction === 'asc' ? 'desc' : 'asc'
                )}
                className="flex items-center text-ocean-600 hover:text-ocean-800 transition-colors"
                title={`Change to ${sort.direction === 'asc' ? 'descending' : 'ascending'}`}
              >
                {sort.direction === 'asc' ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
              </button>
              
              {/* Remove sort button */}
              <button
                onClick={() => onRemoveSort(sort.columnId)}
                className="flex items-center text-gray-400 hover:text-red-600 transition-colors ml-1"
                title={`Remove sort by ${getColumnName(sort.columnId)}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Clear all sorts button */}
      <SortingResetButton
        onReset={onClearSort}
        hasActiveItems={sortConfig.length > 0}
        variant="secondary"
        size="sm"
        showCount={true}
        activeCount={sortConfig.length}
      />
    </div>
  )
}

export default SortingToolbar