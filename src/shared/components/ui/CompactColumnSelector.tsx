import React, { useState, useMemo, useCallback } from 'react'
import { Button } from './button'
import { Badge } from './badge'
import {
  ChevronRight,
  X,
  Lock,
  Grid
} from 'lucide-react'
import { getCategoryColor } from '../../utils/categoryUtils'

export interface ColumnDefinition {
  key: string
  title: string
  category?: string
  description?: string
  dataType?: 'string' | 'number' | 'date' | 'boolean' | 'custom'
  width?: number
  minWidth?: number
  maxWidth?: number
  locked?: boolean
  required?: boolean
  sortable?: boolean
  filterable?: boolean
  usage?: {
    frequency: number
    lastUsed: Date
    importance: 'high' | 'medium' | 'low'
  }
  dependencies?: string[]
  relatedColumns?: string[]
  icon?: React.ComponentType
  tooltip?: string
  tags?: string[]
}

interface CompactColumnSelectorProps {
  // Data
  columns: ColumnDefinition[]
  visibleColumns: string[]

  // Callbacks
  onToggleColumn: (columnKey: string) => void
  onReorderColumns?: (columnKeys: string[]) => void
  onBulkToggle?: (columnKeys: string[], visible: boolean) => void

  // Configuration
  enableDragDrop?: boolean
  enableBulkOperations?: boolean
  enableReordering?: boolean
  maxHeight?: number

  // Styling
  className?: string

  // Event handlers
  onError?: (error: string) => void
}

interface DragDropState {
  draggedItem: string | null
  dragOverIndex: number | null
  isDragging: boolean
}

export const CompactColumnSelector: React.FC<CompactColumnSelectorProps> = ({
  columns,
  visibleColumns,
  onToggleColumn,
  onReorderColumns,
  onBulkToggle,
  enableDragDrop = true,
  enableBulkOperations = true,
  enableReordering = true,
  maxHeight,
  className = '',
  onError
}) => {
  const [dragDrop, setDragDrop] = useState<DragDropState>({
    draggedItem: null,
    dragOverIndex: null,
    isDragging: false
  })

  const [selectedAvailable, setSelectedAvailable] = useState<Set<string>>(new Set())
  const [selectedVisible, setSelectedVisible] = useState<Set<string>>(new Set())

  // Split columns into available and selected
  const availableColumns = useMemo(() => {
    return columns
      .filter(col => !visibleColumns.includes(col.key))
      .sort((a, b) => a.title.localeCompare(b.title))
  }, [columns, visibleColumns])

  const selectedColumns = useMemo(() => {
    return visibleColumns
      .map(key => columns.find(col => col.key === key))
      .filter(Boolean) as ColumnDefinition[]
  }, [visibleColumns, columns])

  // Handle column operations
  const handleAddColumn = useCallback((columnKey: string) => {
    try {
      onToggleColumn(columnKey)
    } catch (error) {
      onError?.(`Failed to add column: ${error}`)
    }
  }, [onToggleColumn, onError])

  const handleRemoveColumn = useCallback((columnKey: string) => {
    try {
      const column = columns.find(col => col.key === columnKey)
      if (column?.locked) return
      onToggleColumn(columnKey)
    } catch (error) {
      onError?.(`Failed to remove column: ${error}`)
    }
  }, [onToggleColumn, columns, onError])



  // Bulk operations
  const handleSelectAll = useCallback(() => {
    if (!enableBulkOperations) return
    try {
      const columnsToAdd = availableColumns.filter(col => !col.locked).map(col => col.key)
      if (onBulkToggle) {
        onBulkToggle(columnsToAdd, true)
      } else {
        columnsToAdd.forEach(key => onToggleColumn(key))
      }
    } catch (error) {
      onError?.(`Failed to select all columns: ${error}`)
    }
  }, [availableColumns, onToggleColumn, onBulkToggle, enableBulkOperations, onError])

  const handleDeselectAll = useCallback(() => {
    if (!enableBulkOperations) return
    try {
      const columnsToRemove = selectedColumns.filter(col => !col.locked).map(col => col.key)
      if (onBulkToggle) {
        onBulkToggle(columnsToRemove, false)
      } else {
        columnsToRemove.forEach(key => onToggleColumn(key))
      }
    } catch (error) {
      onError?.(`Failed to deselect all columns: ${error}`)
    }
  }, [selectedColumns, onToggleColumn, onBulkToggle, enableBulkOperations, onError])

  // Drag and drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, columnKey: string, pane: 'available' | 'selected') => {
    if (!enableDragDrop) return
    const column = columns.find(col => col.key === columnKey)
    if (column?.locked) {
      e.preventDefault()
      return
    }

    setDragDrop({
      draggedItem: columnKey,
      dragOverIndex: null,
      isDragging: true
    })

    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('application/json', JSON.stringify({
      columnKey,
      sourcePane: pane
    }))
    
    // Set drag image
    e.dataTransfer.setDragImage(e.currentTarget as HTMLElement, 0, 0)
  }, [enableDragDrop, columns])

  const handleDragEnd = useCallback(() => {
    setDragDrop({
      draggedItem: null,
      dragOverIndex: null,
      isDragging: false
    })
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, targetIndex?: number) => {
    if (!enableDragDrop) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    
    if (targetIndex !== undefined) {
      setDragDrop(prev => ({
        ...prev,
        dragOverIndex: targetIndex
      }))
    }
  }, [enableDragDrop])

  const handleDragEnter = useCallback((e: React.DragEvent, targetIndex?: number) => {
    if (!enableDragDrop) return
    e.preventDefault()
    
    if (targetIndex !== undefined) {
      setDragDrop(prev => ({
        ...prev,
        dragOverIndex: targetIndex
      }))
    }
  }, [enableDragDrop])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!enableDragDrop) return
    // Only clear drag over index if we're leaving the component entirely
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragDrop(prev => ({
        ...prev,
        dragOverIndex: null
      }))
    }
  }, [enableDragDrop])

  const handleDrop = useCallback((e: React.DragEvent, targetPane: 'available' | 'selected', targetIndex?: number) => {
    if (!enableDragDrop) return
    e.preventDefault()
    e.stopPropagation()

    try {
      const dragDataStr = e.dataTransfer.getData('application/json')
      if (!dragDataStr) return
      
      const dragData = JSON.parse(dragDataStr)
      const { columnKey, sourcePane } = dragData

      if (sourcePane !== targetPane) {
        // Moving between panes
        onToggleColumn(columnKey)
      } else if (targetPane === 'selected' && onReorderColumns && targetIndex !== undefined && enableReordering) {
        // Reordering within selected pane
        const currentIndex = visibleColumns.indexOf(columnKey)
        if (currentIndex !== targetIndex && currentIndex !== -1) {
          const newOrder = [...visibleColumns]
          newOrder.splice(currentIndex, 1)
          newOrder.splice(targetIndex, 0, columnKey)
          onReorderColumns(newOrder)
        }
      }
    } catch (error) {
      console.error('Drag and drop error:', error)
      onError?.(`Drag and drop failed: ${error}`)
    }

    handleDragEnd()
  }, [enableDragDrop, onToggleColumn, onReorderColumns, visibleColumns, onError, handleDragEnd, enableReordering])

  // Multi-selection handler
  const handleItemSelect = useCallback((columnKey: string, pane: 'available' | 'selected', event: React.MouseEvent) => {
    if (!enableBulkOperations) return

    const isCtrlOrCmd = event.ctrlKey || event.metaKey
    const targetSet = pane === 'available' ? selectedAvailable : selectedVisible
    const setTargetSet = pane === 'available' ? setSelectedAvailable : setSelectedVisible

    if (isCtrlOrCmd) {
      const newSet = new Set(targetSet)
      if (newSet.has(columnKey)) {
        newSet.delete(columnKey)
      } else {
        newSet.add(columnKey)
      }
      setTargetSet(newSet)
    } else {
      setSelectedAvailable(pane === 'available' ? new Set([columnKey]) : new Set())
      setSelectedVisible(pane === 'selected' ? new Set([columnKey]) : new Set())
    }
  }, [enableBulkOperations, selectedAvailable, selectedVisible])

  const renderColumnItem = (column: ColumnDefinition, isSelected: boolean, index: number) => {
    const pane = isSelected ? 'selected' : 'available'
    const isItemSelected = (isSelected ? selectedVisible : selectedAvailable).has(column.key)
    const isDraggedItem = dragDrop.draggedItem === column.key
    const isDragOverItem = isSelected && dragDrop.dragOverIndex === index && dragDrop.draggedItem !== column.key

    // Different behavior for available vs selected columns
    const isDraggable = isSelected && enableDragDrop && !column.locked
    const isClickable = !isSelected && !column.locked

    return (
      <div
        key={column.key}
        draggable={isDraggable}
        className={`
          group flex items-center justify-between px-2 py-1 rounded border transition-all duration-200 relative
          ${isSelected
            ? 'bg-green-50 border-green-200 hover:bg-green-100'
            : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
          }
          ${isItemSelected ? 'ring-2 ring-ocean-300' : ''}
          ${isDraggedItem ? 'opacity-50 scale-95 ring-2 ring-blue-300' : ''}
          ${isDragOverItem ? 'border-t-2 border-t-blue-500' : ''}
          ${column.locked ? 'opacity-60 cursor-not-allowed' : 
            isSelected ? (enableDragDrop ? 'cursor-move' : 'cursor-default') : 'cursor-pointer'}
          ${dragDrop.isDragging && !isDraggedItem ? 'opacity-75' : ''}
        `}
        onClick={(e) => {
          if (isClickable) {
            e.stopPropagation()
            handleAddColumn(column.key)
          } else if (enableBulkOperations && !dragDrop.isDragging) {
            handleItemSelect(column.key, pane, e)
          }
        }}
        onDragStart={isDraggable ? (e) => handleDragStart(e, column.key, pane) : undefined}
        onDragEnd={isDraggable ? handleDragEnd : undefined}
        onDragOver={isSelected ? (e) => handleDragOver(e, index) : undefined}
        onDragEnter={isSelected ? (e) => handleDragEnter(e, index) : undefined}
        onDragLeave={isSelected ? handleDragLeave : undefined}
        onDrop={isSelected ? (e) => handleDrop(e, pane, index) : undefined}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="font-medium text-xs text-gray-900 truncate">
                {column.title}
              </span>
              {column.locked && (
                <Lock className="h-2 w-2 text-gray-400 flex-shrink-0" />
              )}
            </div>
            {(column.category || column.dataType || column.usage?.importance) && (
              <div className="flex items-center gap-1 mt-0.5">
                {column.category && (
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-1 py-0 h-4 border-${getCategoryColor(column.category)}-300 text-${getCategoryColor(column.category)}-700`}
                  >
                    {column.category}
                  </Badge>
                )}
                {column.dataType && (
                  <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">
                    {column.dataType}
                  </Badge>
                )}
                {column.usage?.importance && (
                  <Badge
                    variant={column.usage.importance === 'high' ? 'default' : 'outline'}
                    className="text-[10px] px-1 py-0 h-4"
                  >
                    {column.usage.importance}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-0.5">
          {isSelected ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation()
                handleRemoveColumn(column.key)
              }}
              disabled={column.locked}
              title="Remove from active columns"
            >
              <X className="h-3 w-3" />
            </Button>
          ) : (
            // No button needed - clicking the item will add it
            <div className="h-6 w-6 flex items-center justify-center">
              <ChevronRight className="h-3 w-3 text-gray-400 group-hover:text-green-600 transition-colors" />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`flex flex-col h-full ${className}`}
      style={{ maxHeight: maxHeight ? `${maxHeight}px` : undefined }}
    >
      {/* Compact Header */}
      <div className="flex-shrink-0 px-2 py-1 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-medium">{selectedColumns.length} of {columns.length} active</span>
          </div>
          {enableBulkOperations && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-5 text-[10px] px-2 hover:bg-green-100 hover:text-green-700"
                onClick={handleSelectAll}
                disabled={availableColumns.length === 0}
              >
                Add All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 text-[10px] px-2 hover:bg-red-100 hover:text-red-700"
                onClick={handleDeselectAll}
                disabled={selectedColumns.filter(col => !col.locked).length === 0}
              >
                Clear All
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Dual Pane Layout */}
      <div className="flex-1 flex gap-3 p-2 overflow-hidden">
        {/* Available Columns */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-2 px-2 py-1 bg-gray-100 rounded-t border-b-2 border-gray-300">
            <h3 className="font-semibold text-sm text-gray-900">
              Available Fields
            </h3>
            <span className="text-xs text-gray-500 ml-auto">
              ({availableColumns.length})
            </span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-0.5 bg-gray-25 border border-gray-200 rounded-b p-1">
            {availableColumns.map((column, index) => renderColumnItem(column, false, index))}
            {availableColumns.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <Grid className="h-5 w-5 mx-auto mb-2 opacity-50" />
                <p className="text-xs">All fields are active</p>
              </div>
            )}
          </div>
        </div>



        {/* Active Columns */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-2 px-2 py-1 bg-green-100 rounded-t border-b-2 border-green-300">
            <h3 className="font-semibold text-sm text-gray-900">
              Active Columns
            </h3>
            <span className="text-xs text-gray-500 ml-auto">
              ({selectedColumns.length})
            </span>
          </div>
          <div 
            className={`flex-1 overflow-y-auto space-y-0.5 bg-green-25 border border-green-200 rounded-b p-1 transition-colors duration-200 ${
              dragDrop.isDragging ? 'border-green-400 bg-green-100' : ''
            }`}
            onDragOver={(e) => handleDragOver(e)}
            onDragEnter={(e) => handleDragEnter(e)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'selected')}
          >
            {selectedColumns.map((column, index) => renderColumnItem(column, true, index))}
            {selectedColumns.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <Grid className="h-5 w-5 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No active columns</p>
                <p className="text-[10px] text-gray-400 mt-1">Add fields from the left</p>
                {dragDrop.isDragging && (
                  <p className="text-[10px] text-green-600 mt-1 font-medium">Drop here to activate</p>
                )}
              </div>
            )}
            {dragDrop.isDragging && selectedColumns.length > 0 && (
              <div className="text-center py-2 text-green-600 border-2 border-dashed border-green-300 rounded">
                <p className="text-[10px] font-medium">Drop here to activate or reorder</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}