import React, { useState } from 'react'
import { Button } from '../../button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../dialog'
import { ColumnDefinition, ColumnState } from '../types'
import { 
  Settings, 
  Eye, 
  EyeOff, 
  GripVertical, 
  Maximize2,
  Minimize2
} from 'lucide-react'
import { ColumnResetButton } from '../../ResetButton'

interface ColumnManagerProps<T> {
  columns: ColumnDefinition<T>[]
  columnStates: ColumnState[]
  onColumnStateChange: (columnStates: ColumnState[]) => void
  onAutoSizeColumn?: (columnId: string) => void
  onAutoSizeAllColumns?: () => void
  onResetColumns?: () => void
  className?: string
}

const ColumnManager = <T extends Record<string, any>>({
  columns,
  columnStates,
  onColumnStateChange,
  onAutoSizeColumn,
  onAutoSizeAllColumns,
  onResetColumns,
  className = ''
}: ColumnManagerProps<T>) => {
  const [isOpen, setIsOpen] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  // Get ordered column states
  const orderedColumns = columnStates
    .sort((a, b) => a.order - b.order)
    .map(state => ({
      state,
      definition: columns.find(col => col.id === state.id)!
    }))
    .filter(item => item.definition)

  // Toggle column visibility
  const toggleColumnVisibility = (columnId: string) => {
    const updatedStates = columnStates.map(state =>
      state.id === columnId ? { ...state, visible: !state.visible } : state
    )
    onColumnStateChange(updatedStates)
  }

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    const reorderedColumns = [...orderedColumns]
    const draggedItem = reorderedColumns[draggedIndex]
    
    // Remove dragged item
    reorderedColumns.splice(draggedIndex, 1)
    
    // Insert at new position
    reorderedColumns.splice(dropIndex, 0, draggedItem)
    
    // Update order values
    const updatedStates = columnStates.map(state => {
      const newIndex = reorderedColumns.findIndex(item => item.state.id === state.id)
      return { ...state, order: newIndex }
    })
    
    onColumnStateChange(updatedStates)
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  // Show all columns
  const showAllColumns = () => {
    const updatedStates = columnStates.map(state => ({ ...state, visible: true }))
    onColumnStateChange(updatedStates)
  }

  // Hide all columns (except first one to prevent empty table)
  const hideAllColumns = () => {
    const updatedStates = columnStates.map((state, index) => ({
      ...state,
      visible: index === 0 // Keep first column visible
    }))
    onColumnStateChange(updatedStates)
  }

  // Get column display name
  const getColumnDisplayName = (column: ColumnDefinition<T>): string => {
    return typeof column.header === 'string' ? column.header : column.id
  }

  // Count visible columns
  const visibleCount = columnStates.filter(state => state.visible).length
  const totalCount = columnStates.length

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`flex items-center gap-2 ${className}`}
          title="Manage columns"
        >
          <Settings className="h-4 w-4" />
          Columns ({visibleCount}/{totalCount})
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Manage Columns
          </DialogTitle>
          <p className="text-sm text-gray-600">
            Show, hide, and reorder table columns. Drag to reorder.
          </p>
        </DialogHeader>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 py-4 border-b">
          <Button
            variant="outline"
            size="sm"
            onClick={showAllColumns}
            className="flex items-center gap-1"
          >
            <Eye className="h-3 w-3" />
            Show All
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={hideAllColumns}
            className="flex items-center gap-1"
          >
            <EyeOff className="h-3 w-3" />
            Hide All
          </Button>
          
          {onAutoSizeAllColumns && (
            <Button
              variant="outline"
              size="sm"
              onClick={onAutoSizeAllColumns}
              className="flex items-center gap-1"
            >
              <Maximize2 className="h-3 w-3" />
              Auto Size
            </Button>
          )}
          
          {onResetColumns && (
            <ColumnResetButton
              onReset={onResetColumns}
              hasActiveItems={true}
              variant="secondary"
              size="sm"
            />
          )}
        </div>

        {/* Column list */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-1">
            {orderedColumns.map((item, index) => {
              const { state, definition } = item
              const isDragging = draggedIndex === index
              const isDragOver = dragOverIndex === index
              
              return (
                <div
                  key={state.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`
                    flex items-center gap-3 p-3 border rounded-md cursor-move transition-all
                    ${isDragging ? 'opacity-50 bg-gray-100' : ''}
                    ${isDragOver ? 'border-ocean-300 bg-ocean-50' : 'border-gray-200'}
                    hover:border-gray-300 hover:bg-gray-50
                  `}
                >
                  {/* Drag handle */}
                  <div className="flex-shrink-0 text-gray-400">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  
                  {/* Visibility toggle */}
                  <button
                    onClick={() => toggleColumnVisibility(state.id)}
                    className={`flex-shrink-0 p-1 rounded transition-colors ${
                      state.visible 
                        ? 'text-ocean-600 hover:text-ocean-800' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title={state.visible ? 'Hide column' : 'Show column'}
                  >
                    {state.visible ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                  
                  {/* Column info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {getColumnDisplayName(definition)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Width: {state.width}px
                      {definition.type && ` • ${definition.type}`}
                    </div>
                  </div>
                  
                  {/* Auto-size button */}
                  {onAutoSizeColumn && (
                    <button
                      onClick={() => onAutoSizeColumn(state.id)}
                      className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Auto-size this column"
                    >
                      <Minimize2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t text-sm text-gray-600">
          <div className="flex justify-between items-center">
            <span>
              {visibleCount} of {totalCount} columns visible
            </span>
            <span className="text-xs">
              Drag to reorder • Click eye to toggle
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ColumnManager