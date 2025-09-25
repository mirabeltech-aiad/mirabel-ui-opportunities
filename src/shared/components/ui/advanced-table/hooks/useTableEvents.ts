import { useCallback } from 'react'
import { SortConfig } from '../types/table.types'

interface UseTableEventsProps<T> {
  enableSelection: boolean
  onRowClick?: (row: T) => void
  onRowDoubleClick?: (row: T) => void
  onRowSelect?: (selectedData: T[]) => void
  onBulkAction?: (actionId: string, selectedData: T[]) => void
  onSort?: (sortConfig: SortConfig[]) => void
  selection: any
  setSortConfig: (config: SortConfig[] | ((prev: SortConfig[]) => SortConfig[])) => void
}

interface UseTableEventsReturn<T> {
  handleRowClick: (row: T, index: number, event?: React.MouseEvent) => void
  handleRowDoubleClick: (row: T, index: number, event?: React.MouseEvent) => void
  handleSelectAll: () => void
  handleBulkAction: (actionId: string, selectedData: T[]) => void
  handleSort: (columnId: string) => void
}

/**
 * Custom hook for managing table event handlers
 * Extracted from EnhancedDataTable for better separation of concerns
 */
export const useTableEvents = <T extends Record<string, any>>({
  enableSelection,
  onRowClick,
  onRowDoubleClick,
  onRowSelect,
  onBulkAction,
  onSort,
  selection,
  setSortConfig
}: UseTableEventsProps<T>): UseTableEventsReturn<T> => {
  
  // Handle row click with keyboard support
  const handleRowClick = useCallback((row: T, index: number, event?: React.MouseEvent) => {
    // Check if click was on an interactive element (including checkboxes)
    const target = event?.target as HTMLElement
    if (target?.closest('button') || target?.closest('input') || target?.closest('select')) {
      return // Don't handle row actions if clicking on interactive elements
    }
    
    // Row click: Primary action (edit) - NO selection behavior
    // Selection is now handled exclusively by checkbox clicks
    onRowClick?.(row)
  }, [onRowClick])

  // Handle row double-click
  const handleRowDoubleClick = useCallback((row: T, index: number, event?: React.MouseEvent) => {
    // Check if double-click was on an interactive element
    const target = event?.target as HTMLElement
    if (target?.closest('button') || target?.closest('input') || target?.closest('select')) {
      return // Don't handle row actions if double-clicking on interactive elements
    }
    
    // Call parent onRowDoubleClick handler
    onRowDoubleClick?.(row)
  }, [onRowDoubleClick])

  // Handle select all
  const handleSelectAll = useCallback(() => {
    if (!enableSelection) return
    
    selection.toggleSelectAll()
    
    // Notify parent component
    if (onRowSelect) {
      onRowSelect(selection.selectedRowData)
    }
  }, [enableSelection, onRowSelect, selection])

  // Handle bulk actions
  const handleBulkAction = useCallback((actionId: string, selectedData: T[]) => {
    if (actionId === 'clear-selection') {
      selection.deselectAll()
      return
    }
    
    // Call parent bulk action handler
    onBulkAction?.(actionId, selectedData)
  }, [onBulkAction, selection])

  // Handle sorting
  const handleSort = useCallback((columnId: string) => {
    setSortConfig(prevSort => {
      const existingSort = prevSort.find(s => s.columnId === columnId)
      let newSortConfig: SortConfig[]
      
      if (existingSort) {
        // Toggle sort direction
        if (existingSort.direction === 'asc') {
          newSortConfig = prevSort.map(s => 
            s.columnId === columnId 
              ? { ...s, direction: 'desc' as const }
              : s
          )
        } else {
          // Remove sort
          newSortConfig = prevSort.filter(s => s.columnId !== columnId)
        }
      } else {
        // Add new sort (ascending) with next priority
        const nextPriority = Math.max(0, ...prevSort.map(s => s.priority)) + 1
        newSortConfig = [...prevSort, { columnId, direction: 'asc' as const, priority: nextPriority }]
      }
      
      // Call onSort callback if provided
      if (onSort) {
        onSort(newSortConfig)
      }
      
      return newSortConfig
    })
  }, [onSort, setSortConfig])

  return {
    handleRowClick,
    handleRowDoubleClick,
    handleSelectAll,
    handleBulkAction,
    handleSort
  }
}