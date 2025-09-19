import React from 'react'
import { SortConfig } from '../types/table.types'

interface TableControlsProps {
  sortConfig: SortConfig[]
  dragState: any
  onClearSort: () => void
  onResetColumns: () => void
}

/**
 * Table control buttons for sorting and column management
 * Extracted from EnhancedDataTable for better component separation
 */
const TableControls: React.FC<TableControlsProps> = ({
  sortConfig,
  dragState,
  onClearSort,
  onResetColumns
}) => {
  return (
    <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
      <div className="flex items-center gap-4">
        {dragState.isDragging && (
          <span className="text-ocean-600 font-medium">
            Moving "{dragState.draggedColumnId}" column...
          </span>
        )}
        {sortConfig.length > 0 && (
          <span className="text-green-600 font-medium">
            Sorted by {sortConfig.length} column{sortConfig.length > 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {sortConfig.length > 0 && (
          <button
            onClick={onClearSort}
            className="text-green-600 hover:text-green-700 underline"
            title="Clear all sorting"
          >
            Clear Sort
          </button>
        )}
        <button
          onClick={onResetColumns}
          className="text-ocean-600 hover:text-ocean-700 underline"
          title="Reset columns to default order and width"
        >
          Reset Columns
        </button>
      </div>
    </div>
  )
}

export default TableControls