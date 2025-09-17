import { useCallback, useMemo } from 'react'
import { getRowId } from '../utils/tableHelpers'

interface UseSelectionProps<T> {
  data: T[]
  selectedRows: Set<string>
  onSelectionChange: (selectedRows: Set<string>) => void
  idField?: keyof T
  enableMultiSelect?: boolean
  enableSelectAll?: boolean
  persistAcrossPages?: boolean
}

interface UseSelectionReturn<T> {
  selectedRows: Set<string>
  selectedRowData: T[]
  isRowSelected: (row: T) => boolean
  isAllSelected: boolean
  isPartiallySelected: boolean
  selectionCount: number
  selectableCount: number
  selectRow: (row: T) => void
  deselectRow: (row: T) => void
  toggleRowSelection: (row: T) => void
  selectAll: () => void
  deselectAll: () => void
  toggleSelectAll: () => void
  selectRange: (fromRow: T, toRow: T) => void
  selectMultiple: (rows: T[]) => void
  deselectMultiple: (rows: T[]) => void
  invertSelection: () => void
  getSelectionStats: () => SelectionStats
}

interface SelectionStats {
  total: number
  selected: number
  percentage: number
  isAllSelected: boolean
  isPartiallySelected: boolean
  isNoneSelected: boolean
}

/**
 * Hook for managing row selection in tables
 */
export function useSelection<T>({
  data,
  selectedRows,
  onSelectionChange,
  idField = 'id' as keyof T,
  enableMultiSelect = true,
  enableSelectAll = true,
  persistAcrossPages = false
}: UseSelectionProps<T>): UseSelectionReturn<T> {

  // Get selected row data
  const selectedRowData = useMemo(() => {
    return data.filter(row => {
      const rowId = getRowId(row, idField)
      return selectedRows.has(rowId)
    })
  }, [data, selectedRows, idField])

  // Selection statistics
  const selectionStats = useMemo((): SelectionStats => {
    const total = data.length
    const selected = selectedRows.size
    const percentage = total > 0 ? (selected / total) * 100 : 0
    
    return {
      total,
      selected,
      percentage,
      isAllSelected: selected > 0 && selected === total,
      isPartiallySelected: selected > 0 && selected < total,
      isNoneSelected: selected === 0
    }
  }, [data.length, selectedRows.size])

  // Computed values
  const isAllSelected = selectionStats.isAllSelected
  const isPartiallySelected = selectionStats.isPartiallySelected
  const selectionCount = selectedRows.size
  const selectableCount = data.length

  // Check if a row is selected
  const isRowSelected = useCallback((row: T): boolean => {
    const rowId = getRowId(row, idField)
    return selectedRows.has(rowId)
  }, [selectedRows, idField])

  // Select a single row
  const selectRow = useCallback((row: T) => {
    const rowId = getRowId(row, idField)
    const newSelection = new Set(selectedRows)
    
    if (!enableMultiSelect) {
      // Single select mode - clear existing selections
      newSelection.clear()
    }
    
    newSelection.add(rowId)
    onSelectionChange(newSelection)
  }, [selectedRows, onSelectionChange, idField, enableMultiSelect])

  // Deselect a single row
  const deselectRow = useCallback((row: T) => {
    const rowId = getRowId(row, idField)
    const newSelection = new Set(selectedRows)
    newSelection.delete(rowId)
    onSelectionChange(newSelection)
  }, [selectedRows, onSelectionChange, idField])

  // Toggle row selection
  const toggleRowSelection = useCallback((row: T) => {
    if (isRowSelected(row)) {
      deselectRow(row)
    } else {
      selectRow(row)
    }
  }, [isRowSelected, selectRow, deselectRow])

  // Select all rows
  const selectAll = useCallback(() => {
    if (!enableSelectAll) return
    
    const allRowIds = new Set(data.map(row => getRowId(row, idField)))
    onSelectionChange(allRowIds)
  }, [data, onSelectionChange, idField, enableSelectAll])

  // Deselect all rows
  const deselectAll = useCallback(() => {
    onSelectionChange(new Set())
  }, [onSelectionChange])

  // Toggle select all
  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      deselectAll()
    } else {
      selectAll()
    }
  }, [isAllSelected, selectAll, deselectAll])

  // Select range of rows
  const selectRange = useCallback((fromRow: T, toRow: T) => {
    if (!enableMultiSelect) return
    
    const fromIndex = data.findIndex(row => getRowId(row, idField) === getRowId(fromRow, idField))
    const toIndex = data.findIndex(row => getRowId(row, idField) === getRowId(toRow, idField))
    
    if (fromIndex === -1 || toIndex === -1) return
    
    const startIndex = Math.min(fromIndex, toIndex)
    const endIndex = Math.max(fromIndex, toIndex)
    
    const newSelection = new Set(selectedRows)
    for (let i = startIndex; i <= endIndex; i++) {
      const rowId = getRowId(data[i], idField)
      newSelection.add(rowId)
    }
    
    onSelectionChange(newSelection)
  }, [data, selectedRows, onSelectionChange, idField, enableMultiSelect])

  // Select multiple rows
  const selectMultiple = useCallback((rows: T[]) => {
    if (!enableMultiSelect) {
      // In single select mode, select only the last row
      if (rows.length > 0) {
        selectRow(rows[rows.length - 1])
      }
      return
    }
    
    const newSelection = new Set(selectedRows)
    rows.forEach(row => {
      const rowId = getRowId(row, idField)
      newSelection.add(rowId)
    })
    
    onSelectionChange(newSelection)
  }, [selectedRows, onSelectionChange, idField, enableMultiSelect, selectRow])

  // Deselect multiple rows
  const deselectMultiple = useCallback((rows: T[]) => {
    const newSelection = new Set(selectedRows)
    rows.forEach(row => {
      const rowId = getRowId(row, idField)
      newSelection.delete(rowId)
    })
    
    onSelectionChange(newSelection)
  }, [selectedRows, onSelectionChange, idField])

  // Invert selection
  const invertSelection = useCallback(() => {
    if (!enableMultiSelect) return
    
    const newSelection = new Set<string>()
    data.forEach(row => {
      const rowId = getRowId(row, idField)
      if (!selectedRows.has(rowId)) {
        newSelection.add(rowId)
      }
    })
    
    onSelectionChange(newSelection)
  }, [data, selectedRows, onSelectionChange, idField, enableMultiSelect])

  // Get selection statistics
  const getSelectionStats = useCallback((): SelectionStats => {
    return selectionStats
  }, [selectionStats])

  return {
    selectedRows,
    selectedRowData,
    isRowSelected,
    isAllSelected,
    isPartiallySelected,
    selectionCount,
    selectableCount,
    selectRow,
    deselectRow,
    toggleRowSelection,
    selectAll,
    deselectAll,
    toggleSelectAll,
    selectRange,
    selectMultiple,
    deselectMultiple,
    invertSelection,
    getSelectionStats
  }
}

/**
 * Hook for keyboard-enhanced selection (Shift+Click, Ctrl+Click)
 */
export function useKeyboardSelection<T>(
  selection: UseSelectionReturn<T>,
  data: T[],
  onSelectionChange: (selectedRows: Set<string>) => void,
  idField: keyof T = 'id' as keyof T
) {
  // Handle click with keyboard modifiers
  const handleRowClick = useCallback((
    row: T,
    event: React.MouseEvent | MouseEvent,
    lastSelectedRow?: T
  ) => {
    const { ctrlKey, metaKey, shiftKey } = event
    const isCtrlClick = ctrlKey || metaKey
    
    if (shiftKey && lastSelectedRow) {
      // Shift+Click: Select range
      selection.selectRange(lastSelectedRow, row)
    } else if (isCtrlClick) {
      // Ctrl+Click: Toggle individual selection
      selection.toggleRowSelection(row)
    } else {
      // Regular click: Select single row (clear others in multi-select)
      if (selection.isRowSelected(row) && selection.selectionCount === 1) {
        // If only this row is selected, deselect it
        selection.deselectRow(row)
      } else {
        // Select this row and clear others
        const rowId = getRowId(row, idField)
        onSelectionChange(new Set([rowId]))
      }
    }
  }, [selection, onSelectionChange, idField])

  return {
    handleRowClick
  }
}

/**
 * Hook for selection persistence across pagination/filtering
 */
export function useSelectionPersistence<T>(
  selection: UseSelectionReturn<T>,
  allData: T[], // All data (not just current page)
  currentPageData: T[],
  onSelectionChange: (selectedRows: Set<string>) => void,
  idField: keyof T = 'id' as keyof T
) {
  // Get selection status for current page
  const currentPageSelection = useMemo(() => {
    const currentPageIds = new Set(currentPageData.map(row => getRowId(row, idField)))
    const selectedOnCurrentPage = Array.from(selection.selectedRows).filter(id => 
      currentPageIds.has(id)
    )
    
    return {
      selectedOnCurrentPage: selectedOnCurrentPage.length,
      totalOnCurrentPage: currentPageData.length,
      isCurrentPageFullySelected: selectedOnCurrentPage.length === currentPageData.length && currentPageData.length > 0,
      isCurrentPagePartiallySelected: selectedOnCurrentPage.length > 0 && selectedOnCurrentPage.length < currentPageData.length
    }
  }, [selection.selectedRows, currentPageData, idField])

  // Select all on current page
  const selectCurrentPage = useCallback(() => {
    const currentPageIds = currentPageData.map(row => getRowId(row, idField))
    const newSelection = new Set(selection.selectedRows)
    currentPageIds.forEach(id => newSelection.add(id))
    onSelectionChange(newSelection)
  }, [currentPageData, selection, onSelectionChange, idField])

  // Deselect all on current page
  const deselectCurrentPage = useCallback(() => {
    const currentPageIds = new Set(currentPageData.map(row => getRowId(row, idField)))
    const newSelection = new Set(Array.from(selection.selectedRows).filter(id => 
      !currentPageIds.has(id)
    ))
    onSelectionChange(newSelection)
  }, [currentPageData, selection, onSelectionChange, idField])

  // Select all across all pages
  const selectAllPages = useCallback(() => {
    const allIds = new Set(allData.map(row => getRowId(row, idField)))
    onSelectionChange(allIds)
  }, [allData, selection, onSelectionChange, idField])

  // Get total selection stats across all data
  const totalSelectionStats = useMemo(() => {
    const allIds = new Set(allData.map(row => getRowId(row, idField)))
    const selectedFromAll = Array.from(selection.selectedRows).filter(id => allIds.has(id))
    
    return {
      totalItems: allData.length,
      selectedItems: selectedFromAll.length,
      percentage: allData.length > 0 ? (selectedFromAll.length / allData.length) * 100 : 0,
      isAllSelected: selectedFromAll.length === allData.length && allData.length > 0,
      isPartiallySelected: selectedFromAll.length > 0 && selectedFromAll.length < allData.length
    }
  }, [allData, selection.selectedRows, idField])

  return {
    currentPageSelection,
    totalSelectionStats,
    selectCurrentPage,
    deselectCurrentPage,
    selectAllPages
  }
}