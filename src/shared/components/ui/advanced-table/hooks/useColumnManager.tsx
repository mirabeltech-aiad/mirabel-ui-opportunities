import { useCallback, useMemo } from 'react'
import { ColumnDefinition, ColumnState } from '../types'
import { useColumnResize } from './useColumnResize'
import { useColumnAutoSize } from './useColumnAutoSize'

interface UseColumnManagerProps<T> {
  columns: ColumnDefinition<T>[]
  columnStates: ColumnState[]
  onColumnStateChange: (states: ColumnState[]) => void
  tableElement?: HTMLTableElement | null
}

interface UseColumnManagerReturn<T> {
  visibleColumns: ColumnDefinition<T>[]
  hiddenColumns: ColumnDefinition<T>[]
  orderedColumnStates: ColumnState[]
  toggleColumnVisibility: (columnId: string) => void
  showColumn: (columnId: string) => void
  hideColumn: (columnId: string) => void
  showAllColumns: () => void
  hideAllColumns: () => void
  reorderColumns: (newOrder: string[]) => void
  moveColumn: (fromIndex: number, toIndex: number) => void
  resizeColumn: (columnId: string, width: number) => void
  autoSizeColumn: (columnId: string) => void
  autoSizeAllColumns: () => void
  resetColumns: () => void
  getColumnState: (columnId: string) => ColumnState | undefined
  getColumnDefinition: (columnId: string) => ColumnDefinition<T> | undefined
  isColumnVisible: (columnId: string) => boolean
  getVisibleColumnCount: () => number
  getTotalColumnCount: () => number
}

/**
 * Hook for managing column visibility, ordering, and sizing
 */
export function useColumnManager<T>({
  columns,
  columnStates,
  onColumnStateChange,
  tableElement
}: UseColumnManagerProps<T>): UseColumnManagerReturn<T> {
  
  const { autoSizeColumn: autoSizeColumnWidth, autoSizeAllColumns: autoSizeAllColumnWidths } = useColumnAutoSize()

  // Memoized computed values
  const computedValues = useMemo(() => {
    const orderedStates = [...columnStates].sort((a, b) => a.order - b.order)
    
    const visibleColumns = orderedStates
      .filter(state => state.visible)
      .map(state => columns.find(col => col.id === state.id))
      .filter(Boolean) as ColumnDefinition<T>[]
    
    const hiddenColumns = orderedStates
      .filter(state => !state.visible)
      .map(state => columns.find(col => col.id === state.id))
      .filter(Boolean) as ColumnDefinition<T>[]

    return {
      orderedColumnStates: orderedStates,
      visibleColumns,
      hiddenColumns
    }
  }, [columns, columnStates])

  // Toggle column visibility
  const toggleColumnVisibility = useCallback((columnId: string) => {
    const updatedStates = columnStates.map(state =>
      state.id === columnId ? { ...state, visible: !state.visible } : state
    )
    onColumnStateChange(updatedStates)
  }, [columnStates, onColumnStateChange])

  // Show specific column
  const showColumn = useCallback((columnId: string) => {
    const updatedStates = columnStates.map(state =>
      state.id === columnId ? { ...state, visible: true } : state
    )
    onColumnStateChange(updatedStates)
  }, [columnStates, onColumnStateChange])

  // Hide specific column
  const hideColumn = useCallback((columnId: string) => {
    const updatedStates = columnStates.map(state =>
      state.id === columnId ? { ...state, visible: false } : state
    )
    onColumnStateChange(updatedStates)
  }, [columnStates, onColumnStateChange])

  // Show all columns
  const showAllColumns = useCallback(() => {
    const updatedStates = columnStates.map(state => ({ ...state, visible: true }))
    onColumnStateChange(updatedStates)
  }, [columnStates, onColumnStateChange])

  // Hide all columns (keep at least one visible)
  const hideAllColumns = useCallback(() => {
    const updatedStates = columnStates.map((state, index) => ({
      ...state,
      visible: index === 0 // Keep first column visible
    }))
    onColumnStateChange(updatedStates)
  }, [columnStates, onColumnStateChange])

  // Reorder columns by providing new order array
  const reorderColumns = useCallback((newOrder: string[]) => {
    const updatedStates = columnStates.map(state => {
      const newIndex = newOrder.indexOf(state.id)
      return {
        ...state,
        order: newIndex >= 0 ? newIndex : state.order
      }
    })
    onColumnStateChange(updatedStates)
  }, [columnStates, onColumnStateChange])

  // Move column from one position to another
  const moveColumn = useCallback((fromIndex: number, toIndex: number) => {
    const orderedStates = [...columnStates].sort((a, b) => a.order - b.order)
    const movedColumn = orderedStates[fromIndex]
    
    if (!movedColumn) return

    // Remove from old position
    orderedStates.splice(fromIndex, 1)
    
    // Insert at new position
    orderedStates.splice(toIndex, 0, movedColumn)
    
    // Update order values
    const updatedStates = columnStates.map(state => {
      const newIndex = orderedStates.findIndex(orderedState => orderedState.id === state.id)
      return { ...state, order: newIndex }
    })
    
    onColumnStateChange(updatedStates)
  }, [columnStates, onColumnStateChange])

  // Resize column
  const resizeColumn = useCallback((columnId: string, width: number) => {
    const updatedStates = columnStates.map(state =>
      state.id === columnId ? { ...state, width: Math.max(50, Math.min(800, width)) } : state
    )
    onColumnStateChange(updatedStates)
  }, [columnStates, onColumnStateChange])

  // Auto-size single column
  const autoSizeColumn = useCallback((columnId: string) => {
    if (!tableElement) return
    
    autoSizeColumnWidth(columnId, tableElement, (id, width) => {
      resizeColumn(id, width)
    })
  }, [tableElement, autoSizeColumnWidth, resizeColumn])

  // Auto-size all columns
  const autoSizeAllColumns = useCallback(() => {
    if (!tableElement) return
    
    const visibleColumnIds = computedValues.visibleColumns.map(col => col.id)
    autoSizeAllColumnWidths(visibleColumnIds, tableElement, (id, width) => {
      resizeColumn(id, width)
    })
  }, [tableElement, computedValues.visibleColumns, autoSizeAllColumnWidths, resizeColumn])

  // Reset columns to default state
  const resetColumns = useCallback(() => {
    const defaultStates: ColumnState[] = columns.map((col, index) => ({
      id: col.id,
      visible: true,
      width: col.width || 150,
      order: index,
      pinned: col.sticky || null
    }))
    onColumnStateChange(defaultStates)
  }, [columns, onColumnStateChange])

  // Get column state by ID
  const getColumnState = useCallback((columnId: string): ColumnState | undefined => {
    return columnStates.find(state => state.id === columnId)
  }, [columnStates])

  // Get column definition by ID
  const getColumnDefinition = useCallback((columnId: string): ColumnDefinition<T> | undefined => {
    return columns.find(col => col.id === columnId)
  }, [columns])

  // Check if column is visible
  const isColumnVisible = useCallback((columnId: string): boolean => {
    const state = getColumnState(columnId)
    return state?.visible ?? false
  }, [getColumnState])

  // Get visible column count
  const getVisibleColumnCount = useCallback((): number => {
    return columnStates.filter(state => state.visible).length
  }, [columnStates])

  // Get total column count
  const getTotalColumnCount = useCallback((): number => {
    return columnStates.length
  }, [columnStates])

  return {
    ...computedValues,
    toggleColumnVisibility,
    showColumn,
    hideColumn,
    showAllColumns,
    hideAllColumns,
    reorderColumns,
    moveColumn,
    resizeColumn,
    autoSizeColumn,
    autoSizeAllColumns,
    resetColumns,
    getColumnState,
    getColumnDefinition,
    isColumnVisible,
    getVisibleColumnCount,
    getTotalColumnCount
  }
}

/**
 * Hook for column presets (saved column configurations)
 */
export function useColumnPresets<T>(
  columns: ColumnDefinition<T>[],
  onColumnStateChange: (states: ColumnState[]) => void
) {
  // Create preset from current state
  const createPreset = useCallback((
    name: string,
    currentStates: ColumnState[]
  ): ColumnPreset => {
    return {
      id: `preset-${Date.now()}`,
      name,
      description: `Column configuration saved on ${new Date().toLocaleDateString()}`,
      columnStates: [...currentStates],
      createdAt: new Date().toISOString()
    }
  }, [])

  // Apply preset
  const applyPreset = useCallback((preset: ColumnPreset) => {
    onColumnStateChange(preset.columnStates)
  }, [onColumnStateChange])

  // Create common presets
  const createCommonPresets = useCallback((): ColumnPreset[] => {
    const defaultStates: ColumnState[] = columns.map((col, index) => ({
      id: col.id,
      visible: true,
      width: col.width || 150,
      order: index,
      pinned: col.sticky || null
    }))

    const compactStates: ColumnState[] = columns.map((col, index) => ({
      id: col.id,
      visible: index < 4, // Show only first 4 columns
      width: 120,
      order: index,
      pinned: col.sticky || null
    }))

    const wideStates: ColumnState[] = columns.map((col, index) => ({
      id: col.id,
      visible: true,
      width: 200,
      order: index,
      pinned: col.sticky || null
    }))

    return [
      {
        id: 'default',
        name: 'Default',
        description: 'Default column configuration',
        columnStates: defaultStates,
        createdAt: new Date().toISOString()
      },
      {
        id: 'compact',
        name: 'Compact',
        description: 'Compact view with essential columns only',
        columnStates: compactStates,
        createdAt: new Date().toISOString()
      },
      {
        id: 'wide',
        name: 'Wide',
        description: 'Wide columns for detailed view',
        columnStates: wideStates,
        createdAt: new Date().toISOString()
      }
    ]
  }, [columns])

  return {
    createPreset,
    applyPreset,
    createCommonPresets
  }
}

// Types for column presets
export interface ColumnPreset {
  id: string
  name: string
  description?: string
  columnStates: ColumnState[]
  createdAt: string
}