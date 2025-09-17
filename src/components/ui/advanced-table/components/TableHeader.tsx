import React from 'react'
import { ColumnDefinition, ColumnState, SortConfig } from '../types'
import { ChevronUp, ChevronDown, ArrowUpDown, GripVertical, Move } from 'lucide-react'
import { useColumnResize } from '../hooks/useColumnResize'

interface TableHeaderProps<T> {
  columns: ColumnDefinition<T>[]
  columnStates: ColumnState[]
  sortConfig: SortConfig[]
  onSort?: (columnId: string) => void
  onResize?: (columnId: string, width: number) => void
  onReorder?: (fromIndex: number, toIndex: number) => void
  enableSelection?: boolean
  isAllSelected?: boolean
  isPartiallySelected?: boolean
  onSelectAll?: () => void
  className?: string
  // Drag and drop props
  dragState?: {
    draggedColumnId: string | null
    dragOverColumnId: string | null
    dragDirection: 'left' | 'right' | null
    isDragging: boolean
  }
  onDragStart?: (e: React.DragEvent, columnId: string) => void
  onDragOver?: (e: React.DragEvent, columnId: string) => void
  onDragLeave?: (e: React.DragEvent) => void
  onDrop?: (e: React.DragEvent, columnId: string) => void
  onDragEnd?: () => void
  getColumnWidth?: (columnId: string) => number
}

const TableHeader = <T extends Record<string, any>>({
  columns,
  columnStates,
  sortConfig,
  onSort,
  onResize,
  onReorder,
  enableSelection = false,
  isAllSelected = false,
  isPartiallySelected = false,
  onSelectAll,
  className = '',
  dragState,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  getColumnWidth
}: TableHeaderProps<T>) => {
  // Initialize column resizing
  const { ResizeHandle } = useColumnResize({
    onColumnResize: onResize || (() => {}),
    getColumnWidth: getColumnWidth || ((id) => columns.find(col => col.id === id)?.width || 150),
    minWidth: 80,
    maxWidth: 800
  })
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

  // Get sort direction for a column
  const getSortDirection = (columnId: string): 'asc' | 'desc' | null => {
    const sortItem = sortConfig.find(s => s.columnId === columnId)
    return sortItem ? sortItem.direction : null
  }

  // Get sort priority for a column
  const getSortPriority = (columnId: string): number | null => {
    const sortItem = sortConfig.find(s => s.columnId === columnId)
    return sortItem ? sortItem.priority : null
  }

  // Render sort indicator
  const renderSortIndicator = (columnId: string) => {
    const direction = getSortDirection(columnId)
    const priority = getSortPriority(columnId)
    const hasMultipleSorts = sortConfig.length > 1

    if (!direction) {
      return (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpDown className="h-4 w-4 text-gray-400" />
        </div>
      )
    }

    return (
      <div className="flex items-center gap-1">
        <div className="flex items-center">
          {direction === 'asc' ? (
            <ChevronUp className="h-4 w-4 text-ocean-600" />
          ) : (
            <ChevronDown className="h-4 w-4 text-ocean-600" />
          )}
        </div>
        {hasMultipleSorts && priority !== null && (
          <span className="text-xs text-ocean-600 font-medium bg-ocean-100 rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center">
            {priority + 1}
          </span>
        )}
      </div>
    )
  }

  // Handle column header click for sorting
  const handleHeaderClick = (columnId: string, sortable: boolean) => {
    if (sortable && onSort) {
      onSort(columnId)
    }
  }

  return (
    <thead className={`table-header ${className}`}>
      <tr className="table-header-row">
        {/* Selection checkbox column */}
        {enableSelection && (
          <th className="table-header-cell table-cell--action">
            <input
              type="checkbox"
              checked={isAllSelected}
              ref={(input) => {
                if (input) {
                  input.indeterminate = isPartiallySelected
                }
              }}
              onChange={onSelectAll}
              className="h-4 w-4 text-ocean-600 focus:ring-ocean-500 border-gray-300 rounded"
              aria-label="Select all rows"
            />
          </th>
        )}
        
        {/* Column headers */}
        {visibleColumns.map(({ definition, state }) => {
          const isDragging = dragState?.draggedColumnId === definition.id
          const isDragOver = dragState?.dragOverColumnId === definition.id
          const showDropIndicator = isDragOver && dragState?.dragDirection
          const columnWidth = getColumnWidth ? getColumnWidth(definition.id) : state.width

          return (
            <th
              key={definition.id}
              className={`
                table-header-cell relative group
                ${definition.align === 'center' ? 'text-center' : definition.align === 'right' ? 'text-right' : 'text-left'}
                ${definition.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}
                ${isDragging ? 'opacity-50 bg-ocean-50' : ''}
                ${isDragOver ? 'bg-ocean-100' : ''}
                ${definition.headerClassName || ''}
                ${definition.cellClassName || ''}
              `}
              style={{ 
                width: columnWidth,
                minWidth: definition.minWidth || 80,
                maxWidth: definition.maxWidth || 1000
              }}
              draggable={onDragStart ? true : false}
              onDragStart={onDragStart ? (e) => onDragStart(e, definition.id) : undefined}
              onDragOver={onDragOver ? (e) => onDragOver(e, definition.id) : undefined}
              onDragLeave={onDragLeave}
              onDrop={onDrop ? (e) => onDrop(e, definition.id) : undefined}
              onDragEnd={onDragEnd}
              onClick={(e) => {
                // Don't trigger sort if clicking on drag handle or resize handle
                const target = e.target as HTMLElement
                if (target.closest('.drag-handle') || target.closest('.resize-handle')) {
                  return
                }
                handleHeaderClick(definition.id, definition.sortable || false)
              }}
              role={definition.sortable ? 'button' : undefined}
              tabIndex={definition.sortable ? 0 : undefined}
              aria-sort={
                definition.sortable 
                  ? (() => {
                      const direction = getSortDirection(definition.id)
                      return direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : 'none'
                    })()
                  : undefined
              }
              onKeyDown={(e) => {
                if (definition.sortable && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault()
                  handleHeaderClick(definition.id, true)
                }
              }}
              title={
                definition.sortable 
                  ? `Click to sort by ${definition.header}. ${getSortDirection(definition.id) ? 'Currently sorted ' + getSortDirection(definition.id) + 'ending' : 'Not sorted'}`
                  : undefined
              }
            >
              {/* Drop indicator */}
              {showDropIndicator && (
                <div 
                  className={`absolute top-0 bottom-0 w-1 bg-ocean-500 z-20 ${
                    dragState.dragDirection === 'left' ? 'left-0' : 'right-0'
                  }`}
                />
              )}

              <div className={`flex items-center gap-2 ${
                definition.align === 'right' ? 'justify-end' : 
                definition.align === 'center' ? 'justify-center' : 
                'justify-between'
              }`}>
                {definition.align !== 'right' && (
                  <div className="flex items-center gap-2">
                    {/* Drag handle */}
                    {onDragStart && (
                      <div 
                        className="drag-handle opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity"
                        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                        title="Drag to reorder column"
                      >
                        <Move className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </div>
                    )}
                    
                    <span className="table-header-text truncate">
                      {typeof definition.header === 'string' ? definition.header : definition.header}
                    </span>
                    {definition.description && (
                      <span 
                        className="text-gray-400 cursor-help"
                        title={definition.description}
                      >
                        ℹ
                      </span>
                    )}
                  </div>
                )}
                
                {definition.align === 'right' && (
                  <div className="flex items-center gap-2">
                    {definition.sortable && (
                      <div className="flex-shrink-0">
                        {renderSortIndicator(definition.id)}
                      </div>
                    )}
                    
                    <span className="table-header-text truncate">
                      {typeof definition.header === 'string' ? definition.header : definition.header}
                    </span>
                    {definition.description && (
                      <span 
                        className="text-gray-400 cursor-help"
                        title={definition.description}
                      >
                        ℹ
                      </span>
                    )}
                    
                    {/* Drag handle */}
                    {onDragStart && (
                      <div 
                        className="drag-handle opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity"
                        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                        title="Drag to reorder column"
                      >
                        <Move className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </div>
                    )}
                  </div>
                )}
                
                {definition.align !== 'right' && definition.sortable && (
                  <div className="flex-shrink-0">
                    {renderSortIndicator(definition.id)}
                  </div>
                )}
              </div>

              {/* Resize handle */}
              {definition.resizable !== false && onResize && (
                <ResizeHandle 
                  columnId={definition.id}
                  className="resize-handle"
                />
              )}
            </th>
          )
        })}
      </tr>
    </thead>
  )
}

export default TableHeader