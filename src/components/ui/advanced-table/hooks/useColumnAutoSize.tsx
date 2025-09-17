import { useCallback } from 'react'

export interface UseColumnAutoSizeReturn {
  autoSizeColumn: (columnId: string, tableElement: HTMLElement | null, callback: (id: string, width: number) => void) => void
  autoSizeAllColumns: (columnIds: string[], tableElement: HTMLElement | null, callback: (id: string, width: number) => void) => void
}

export function useColumnAutoSize(): UseColumnAutoSizeReturn {
  const autoSizeColumn = useCallback((
    columnId: string, 
    tableElement: HTMLElement | null, 
    callback: (id: string, width: number) => void
  ) => {
    if (!tableElement) return

    // Find the column header and cells
    const headerCell = tableElement.querySelector(`[data-column-id="${columnId}"]`) as HTMLElement
    const cells = tableElement.querySelectorAll(`[data-column="${columnId}"]`)
    
    if (!headerCell || cells.length === 0) return

    // Calculate the maximum width needed
    let maxWidth = 0
    
    // Check header width
    const headerWidth = headerCell.scrollWidth + 32 // Add padding
    maxWidth = Math.max(maxWidth, headerWidth)
    
    // Check cell widths
    cells.forEach(cell => {
      const cellElement = cell as HTMLElement
      const cellWidth = cellElement.scrollWidth + 32 // Add padding
      maxWidth = Math.max(maxWidth, cellWidth)
    })
    
    // Apply reasonable constraints
    const minWidth = 100
    const maxConstraint = 400
    const finalWidth = Math.max(minWidth, Math.min(maxWidth, maxConstraint))
    
    callback(columnId, finalWidth)
  }, [])

  const autoSizeAllColumns = useCallback((
    columnIds: string[], 
    tableElement: HTMLElement | null, 
    callback: (id: string, width: number) => void
  ) => {
    columnIds.forEach(columnId => {
      autoSizeColumn(columnId, tableElement, callback)
    })
  }, [autoSizeColumn])

  return {
    autoSizeColumn,
    autoSizeAllColumns
  }
}