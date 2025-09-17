import { useCallback, useEffect, useRef, useState } from 'react'
import { getRowId } from '../utils/tableHelpers'

interface UseKeyboardNavigationProps<T> {
  data: T[]
  selectedRows: Set<string>
  onSelectionChange: (selectedRows: Set<string>) => void
  onRowClick?: (row: T) => void
  idField?: keyof T
  enableMultiSelect?: boolean
  tableRef?: React.RefObject<HTMLTableElement>
}

interface UseKeyboardNavigationReturn<T> {
  focusedRowIndex: number
  setFocusedRowIndex: (index: number) => void
  handleKeyDown: (event: React.KeyboardEvent) => void
  handleRowClick: (row: T, index: number, event: React.MouseEvent) => void
  getFocusedRow: () => T | null
  focusRow: (index: number) => void
  clearFocus: () => void
}

export function useKeyboardNavigation<T>({
  data,
  selectedRows,
  onSelectionChange,
  onRowClick,
  idField = 'id' as keyof T,
  enableMultiSelect = true,
  tableRef
}: UseKeyboardNavigationProps<T>): UseKeyboardNavigationReturn<T> {
  const [focusedRowIndex, setFocusedRowIndex] = useState(-1)
  const [lastSelectedIndex, setLastSelectedIndex] = useState(-1)
  const isShiftSelecting = useRef(false)

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (data.length === 0) return

    const { key, shiftKey, ctrlKey, metaKey } = event
    const isCtrlOrCmd = ctrlKey || metaKey

    switch (key) {
      case 'ArrowDown':
        event.preventDefault()
        const nextIndex = Math.min(focusedRowIndex + 1, data.length - 1)
        setFocusedRowIndex(nextIndex)
        
        if (shiftKey && enableMultiSelect && lastSelectedIndex !== -1) {
          // Shift+Arrow: Extend selection
          selectRange(lastSelectedIndex, nextIndex)
        }
        break

      case 'ArrowUp':
        event.preventDefault()
        const prevIndex = Math.max(focusedRowIndex - 1, 0)
        setFocusedRowIndex(prevIndex)
        
        if (shiftKey && enableMultiSelect && lastSelectedIndex !== -1) {
          // Shift+Arrow: Extend selection
          selectRange(lastSelectedIndex, prevIndex)
        }
        break

      case 'Home':
        event.preventDefault()
        setFocusedRowIndex(0)
        
        if (shiftKey && enableMultiSelect && lastSelectedIndex !== -1) {
          selectRange(lastSelectedIndex, 0)
        }
        break

      case 'End':
        event.preventDefault()
        const lastIndex = data.length - 1
        setFocusedRowIndex(lastIndex)
        
        if (shiftKey && enableMultiSelect && lastSelectedIndex !== -1) {
          selectRange(lastSelectedIndex, lastIndex)
        }
        break

      case 'PageDown':
        event.preventDefault()
        const pageDownIndex = Math.min(focusedRowIndex + 10, data.length - 1)
        setFocusedRowIndex(pageDownIndex)
        
        if (shiftKey && enableMultiSelect && lastSelectedIndex !== -1) {
          selectRange(lastSelectedIndex, pageDownIndex)
        }
        break

      case 'PageUp':
        event.preventDefault()
        const pageUpIndex = Math.max(focusedRowIndex - 10, 0)
        setFocusedRowIndex(pageUpIndex)
        
        if (shiftKey && enableMultiSelect && lastSelectedIndex !== -1) {
          selectRange(lastSelectedIndex, pageUpIndex)
        }
        break

      case ' ':
      case 'Enter':
        event.preventDefault()
        if (focusedRowIndex >= 0 && focusedRowIndex < data.length) {
          const row = data[focusedRowIndex]
          
          if (key === ' ') {
            // Space: Toggle selection
            toggleRowSelection(row, focusedRowIndex, isCtrlOrCmd)
          } else {
            // Enter: Trigger row click
            onRowClick?.(row)
          }
        }
        break

      case 'a':
        if (isCtrlOrCmd && enableMultiSelect) {
          event.preventDefault()
          // Ctrl+A: Select all
          selectAll()
        }
        break

      case 'Escape':
        event.preventDefault()
        // Escape: Clear selection and focus
        clearSelection()
        setFocusedRowIndex(-1)
        break

      default:
        break
    }
  }, [data, focusedRowIndex, selectedRows, lastSelectedIndex, enableMultiSelect, onRowClick])

  // Handle mouse click with keyboard modifiers
  const handleRowClick = useCallback((row: T, index: number, event: React.MouseEvent) => {
    const { shiftKey, ctrlKey, metaKey } = event
    const isCtrlOrCmd = ctrlKey || metaKey

    setFocusedRowIndex(index)

    if (shiftKey && enableMultiSelect && lastSelectedIndex !== -1) {
      // Shift+Click: Select range
      event.preventDefault()
      selectRange(lastSelectedIndex, index)
    } else if (isCtrlOrCmd && enableMultiSelect) {
      // Ctrl+Click: Toggle individual selection
      event.preventDefault()
      toggleRowSelection(row, index, true)
    } else {
      // Regular click: Select single row
      if (enableMultiSelect) {
        const rowId = getRowId(row, idField)
        const newSelection = new Set([rowId])
        onSelectionChange(newSelection)
        setLastSelectedIndex(index)
      }
      
      // Trigger row click handler
      onRowClick?.(row)
    }
  }, [data, selectedRows, lastSelectedIndex, enableMultiSelect, onRowClick, onSelectionChange, idField])

  // Toggle row selection
  const toggleRowSelection = useCallback((row: T, index: number, maintainOthers: boolean = false) => {
    const rowId = getRowId(row, idField)
    const newSelection = new Set(maintainOthers ? selectedRows : [])
    
    if (selectedRows.has(rowId)) {
      newSelection.delete(rowId)
    } else {
      newSelection.add(rowId)
      setLastSelectedIndex(index)
    }
    
    onSelectionChange(newSelection)
  }, [selectedRows, onSelectionChange, idField])

  // Select range of rows
  const selectRange = useCallback((startIndex: number, endIndex: number) => {
    const start = Math.min(startIndex, endIndex)
    const end = Math.max(startIndex, endIndex)
    
    const newSelection = new Set(selectedRows)
    
    for (let i = start; i <= end; i++) {
      if (i >= 0 && i < data.length) {
        const rowId = getRowId(data[i], idField)
        newSelection.add(rowId)
      }
    }
    
    onSelectionChange(newSelection)
  }, [data, selectedRows, onSelectionChange, idField])

  // Select all rows
  const selectAll = useCallback(() => {
    const allRowIds = new Set(data.map(row => getRowId(row, idField)))
    onSelectionChange(allRowIds)
  }, [data, onSelectionChange, idField])

  // Clear selection
  const clearSelection = useCallback(() => {
    onSelectionChange(new Set())
    setLastSelectedIndex(-1)
  }, [onSelectionChange])

  // Get focused row
  const getFocusedRow = useCallback(() => {
    if (focusedRowIndex >= 0 && focusedRowIndex < data.length) {
      return data[focusedRowIndex]
    }
    return null
  }, [data, focusedRowIndex])

  // Focus specific row
  const focusRow = useCallback((index: number) => {
    if (index >= 0 && index < data.length) {
      setFocusedRowIndex(index)
      
      // Scroll row into view if table ref is available
      if (tableRef?.current) {
        const rows = tableRef.current.querySelectorAll('tbody tr')
        const targetRow = rows[index] as HTMLElement
        if (targetRow) {
          targetRow.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
          })
        }
      }
    }
  }, [data.length, tableRef])

  // Clear focus
  const clearFocus = useCallback(() => {
    setFocusedRowIndex(-1)
  }, [])

  // Reset focus when data changes
  useEffect(() => {
    if (focusedRowIndex >= data.length) {
      setFocusedRowIndex(Math.max(0, data.length - 1))
    }
  }, [data.length, focusedRowIndex])

  return {
    focusedRowIndex,
    setFocusedRowIndex,
    handleKeyDown,
    handleRowClick,
    getFocusedRow,
    focusRow,
    clearFocus
  }
}