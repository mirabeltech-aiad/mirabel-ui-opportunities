import { logger } from '../../../../utils/logger'

import { useState, useCallback, useRef } from 'react'
import { ColumnDefinition } from '../types/column.types'

interface UseColumnDragDropProps<T> {
  columns: ColumnDefinition<T>[]
  onColumnReorder?: (newOrder: string[]) => void
  storageKey?: string
}

interface DragState {
  draggedColumnId: string | null
  dragOverColumnId: string | null
  dragDirection: 'left' | 'right' | null
  isDragging: boolean
}

export const useColumnDragDrop = <T>({
  columns,
  onColumnReorder,
  storageKey = 'table-column-order'
}: UseColumnDragDropProps<T>) => {
  const [dragState, setDragState] = useState<DragState>({
    draggedColumnId: null,
    dragOverColumnId: null,
    dragDirection: null,
    isDragging: false
  })

  const [columnOrder, setColumnOrder] = useState<string[]>(() => {
    // Try to load saved column order from localStorage
    if (storageKey) {
      try {
        const saved = localStorage.getItem(storageKey)
        if (saved) {
          const savedOrder = JSON.parse(saved)
          // Validate that all columns exist and no extra columns
          const currentColumnIds = columns.map(col => col.id)
          const isValidOrder = savedOrder.length === currentColumnIds.length &&
            savedOrder.every((id: string) => currentColumnIds.includes(id))
          
          if (isValidOrder) {
            return savedOrder
          }
        }
      } catch (error) {
        logger.warn('Failed to load column order from localStorage:', error)
      }
    }
    
    // Default to original column order
    return columns.map(col => col.id)
  })

  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
    // Try to load saved column widths from localStorage
    const widthStorageKey = `${storageKey}-widths`
    if (storageKey) {
      try {
        const saved = localStorage.getItem(widthStorageKey)
        if (saved) {
          return JSON.parse(saved)
        }
      } catch (error) {
        logger.warn('Failed to load column widths from localStorage:', error)
      }
    }
    
    // Default to column-defined widths
    const defaultWidths: Record<string, number> = {}
    columns.forEach(col => {
      if (col.width) {
        defaultWidths[col.id] = col.width
      }
    })
    return defaultWidths
  })



  // Save column order to localStorage
  const saveColumnOrder = useCallback((order: string[]) => {
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(order))
      } catch (error) {
        logger.warn('Failed to save column order to localStorage:', error)
      }
    }
  }, [storageKey])

  // Save column widths to localStorage
  const saveColumnWidths = useCallback((widths: Record<string, number>) => {
    const widthStorageKey = `${storageKey}-widths`
    if (storageKey) {
      try {
        localStorage.setItem(widthStorageKey, JSON.stringify(widths))
      } catch (error) {
        logger.warn('Failed to save column widths to localStorage:', error)
      }
    }
  }, [storageKey])

  // Get ordered columns based on current order
  const orderedColumns = useCallback(() => {
    const columnMap = new Map(columns.map(col => [col.id, col]))
    return columnOrder
      .map(id => columnMap.get(id))
      .filter(Boolean) as ColumnDefinition<T>[]
  }, [columns, columnOrder])

  // Handle drag start
  const handleDragStart = useCallback((e: React.DragEvent, columnId: string) => {
    const column = columns.find(col => col.id === columnId)
    if (!column) return

    setDragState({
      draggedColumnId: columnId,
      dragOverColumnId: null,
      dragDirection: null,
      isDragging: true
    })

    // Use default browser drag image

    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', columnId)
  }, [columns])

  // Handle drag over
  const handleDragOver = useCallback((e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'

    if (dragState.draggedColumnId === columnId) return

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const midpoint = rect.left + rect.width / 2
    const direction = e.clientX < midpoint ? 'left' : 'right'

    setDragState(prev => ({
      ...prev,
      dragOverColumnId: columnId,
      dragDirection: direction
    }))
  }, [dragState.draggedColumnId])

  // Handle drag leave
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Only clear drag over state if we're leaving the entire column header
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const { clientX, clientY } = e
    
    if (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      setDragState(prev => ({
        ...prev,
        dragOverColumnId: null,
        dragDirection: null
      }))
    }
  }, [])

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault()
    
    const draggedColumnId = dragState.draggedColumnId
    if (!draggedColumnId || draggedColumnId === targetColumnId) {
      setDragState({
        draggedColumnId: null,
        dragOverColumnId: null,
        dragDirection: null,
        isDragging: false
      })
      return
    }

    const newOrder = [...columnOrder]
    const draggedIndex = newOrder.indexOf(draggedColumnId)
    const targetIndex = newOrder.indexOf(targetColumnId)

    if (draggedIndex === -1 || targetIndex === -1) return

    // Remove dragged column from its current position
    newOrder.splice(draggedIndex, 1)

    // Insert at new position based on drag direction
    const insertIndex = dragState.dragDirection === 'left' ? targetIndex : targetIndex + 1
    newOrder.splice(insertIndex, 0, draggedColumnId)

    setColumnOrder(newOrder)
    saveColumnOrder(newOrder)
    onColumnReorder?.(newOrder)

    setDragState({
      draggedColumnId: null,
      dragOverColumnId: null,
      dragDirection: null,
      isDragging: false
    })
  }, [dragState, columnOrder, saveColumnOrder, onColumnReorder])

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setDragState({
      draggedColumnId: null,
      dragOverColumnId: null,
      dragDirection: null,
      isDragging: false
    })
  }, [])

  // Handle column resize
  const handleColumnResize = useCallback((columnId: string, newWidth: number) => {
    const minWidth = columns.find(col => col.id === columnId)?.minWidth || 80
    const maxWidth = columns.find(col => col.id === columnId)?.maxWidth || 1000
    
    const constrainedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))
    
    setColumnWidths(prev => {
      const newWidths = { ...prev, [columnId]: constrainedWidth }
      saveColumnWidths(newWidths)
      return newWidths
    })
  }, [columns, saveColumnWidths])

  // Reset to default order
  const resetColumnOrder = useCallback(() => {
    const defaultOrder = columns.map(col => col.id)
    setColumnOrder(defaultOrder)
    saveColumnOrder(defaultOrder)
    onColumnReorder?.(defaultOrder)
  }, [columns, saveColumnOrder, onColumnReorder])

  // Get column width
  const getColumnWidth = useCallback((columnId: string) => {
    return columnWidths[columnId] || columns.find(col => col.id === columnId)?.width || 150
  }, [columnWidths, columns])

  return {
    // State
    dragState,
    columnOrder,
    columnWidths,
    orderedColumns: orderedColumns(),
    
    // Drag handlers
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    
    // Resize handlers
    handleColumnResize,
    getColumnWidth,
    
    // Utilities
    resetColumnOrder
  }
}