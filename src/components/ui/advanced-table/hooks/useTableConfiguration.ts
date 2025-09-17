import { useMemo } from 'react'

interface UseTableConfigurationProps {
  id?: string
  columns: any[]
  dragDrop: any
}

interface UseTableConfigurationReturn {
  tableId: string
  columnStates: any[]
}

/**
 * Custom hook for managing table configuration and setup
 * Extracted from EnhancedDataTable for better separation of concerns
 */
export const useTableConfiguration = ({
  id,
  columns,
  dragDrop
}: UseTableConfigurationProps): UseTableConfigurationReturn => {
  
  // Memoize table ID
  const tableId = useMemo(() => id || `table-${Date.now()}`, [id])

  // Create column states for the header
  const columnStates = useMemo(() => {
    return dragDrop.orderedColumns.map((col: any, index: number) => ({
      id: col.id,
      visible: true,
      width: dragDrop.getColumnWidth(col.id),
      order: index,
      pinned: null as null
    }))
  }, [dragDrop.orderedColumns, dragDrop.getColumnWidth])

  return {
    tableId,
    columnStates
  }
}