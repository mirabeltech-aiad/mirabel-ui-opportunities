import React from 'react'
import { Button } from '../../button'
import {
  CheckSquare,
  Square,
  Minus,
  Eye,
  EyeOff,
  ArrowUpDown
} from 'lucide-react'
import { SelectionResetButton } from '../../ResetButton'

interface SelectionToolbarProps {
  selectedCount: number
  totalCount: number
  currentPageCount: number
  isAllSelected: boolean
  isPartiallySelected: boolean
  isCurrentPageSelected: boolean
  isCurrentPagePartiallySelected: boolean
  onSelectAll: () => void
  onDeselectAll: () => void
  onSelectCurrentPage: () => void
  onDeselectCurrentPage: () => void
  onInvertSelection: () => void
  showPageControls?: boolean
  className?: string
}

const SelectionToolbar: React.FC<SelectionToolbarProps> = ({
  selectedCount,
  totalCount,
  currentPageCount,
  isAllSelected,
  isPartiallySelected,
  isCurrentPageSelected,
  isCurrentPagePartiallySelected,
  onSelectAll,
  onDeselectAll,
  onSelectCurrentPage,
  onDeselectCurrentPage,
  onInvertSelection,
  showPageControls = true,
  className = ''
}) => {
  // Get master checkbox state
  const getMasterCheckboxState = () => {
    if (isAllSelected) return 'checked'
    if (isPartiallySelected) return 'indeterminate'
    return 'unchecked'
  }

  // Handle master checkbox click
  const handleMasterCheckboxClick = () => {
    if (isAllSelected) {
      onDeselectAll()
    } else {
      onSelectAll()
    }
  }

  // Get current page checkbox state
  const getCurrentPageCheckboxState = () => {
    if (isCurrentPageSelected) return 'checked'
    if (isCurrentPagePartiallySelected) return 'indeterminate'
    return 'unchecked'
  }

  // Handle current page checkbox click
  const handleCurrentPageCheckboxClick = () => {
    if (isCurrentPageSelected) {
      onDeselectCurrentPage()
    } else {
      onSelectCurrentPage()
    }
  }

  return (
    <div className={`flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-md ${className}`}>
      {/* Master selection controls */}
      <div className="flex items-center gap-3">
        {/* Master checkbox */}
        <button
          onClick={handleMasterCheckboxClick}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          title={isAllSelected ? 'Deselect all' : 'Select all'}
        >
          {getMasterCheckboxState() === 'checked' ? (
            <CheckSquare className="h-4 w-4 text-ocean-600" />
          ) : getMasterCheckboxState() === 'indeterminate' ? (
            <Minus className="h-4 w-4 text-ocean-600" />
          ) : (
            <Square className="h-4 w-4 text-gray-400" />
          )}
          All ({totalCount})
        </button>

        {/* Current page checkbox */}
        {showPageControls && currentPageCount < totalCount && (
          <button
            onClick={handleCurrentPageCheckboxClick}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            title={isCurrentPageSelected ? 'Deselect current page' : 'Select current page'}
          >
            {getCurrentPageCheckboxState() === 'checked' ? (
              <CheckSquare className="h-4 w-4 text-ocean-600" />
            ) : getCurrentPageCheckboxState() === 'indeterminate' ? (
              <Minus className="h-4 w-4 text-ocean-600" />
            ) : (
              <Square className="h-4 w-4 text-gray-400" />
            )}
            Page ({currentPageCount})
          </button>
        )}
      </div>

      {/* Selection info */}
      <div className="flex-1 text-sm text-gray-600">
        {selectedCount > 0 ? (
          <span>
            {selectedCount} of {totalCount} selected
            {selectedCount < totalCount && (
              <span className="text-gray-500">
                {' '}({((selectedCount / totalCount) * 100).toFixed(1)}%)
              </span>
            )}
          </span>
        ) : (
          <span>No items selected</span>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        {/* Invert selection */}
        <Button
          variant="outline"
          size="sm"
          onClick={onInvertSelection}
          disabled={totalCount === 0}
          className="flex items-center gap-1"
          title="Invert selection"
        >
          <ArrowUpDown className="h-3 w-3" />
          Invert
        </Button>

        {/* Show/Hide selected */}
        {selectedCount > 0 && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              title="Show only selected items"
            >
              <Eye className="h-3 w-3" />
              Show Selected
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              title="Hide selected items"
            >
              <EyeOff className="h-3 w-3" />
              Hide Selected
            </Button>
          </>
        )}

        {/* Clear selection */}
        {selectedCount > 0 && (
          <SelectionResetButton
            onReset={onDeselectAll}
            hasActiveItems={selectedCount > 0}
            variant="secondary"
            size="sm"
            showCount={true}
            activeCount={selectedCount}
          />
        )}
      </div>
    </div>
  )
}

export default SelectionToolbar