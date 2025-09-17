import React from 'react'

interface TableContainerProps {
  children: React.ReactNode
  className?: string
  tableId: string
  rowDensity: string
  onKeyDown: (event: React.KeyboardEvent) => void
}

/**
 * Table container component with accessibility and keyboard navigation
 * Extracted from EnhancedDataTable for better component separation
 */
const TableContainer: React.FC<TableContainerProps> = ({
  children,
  className = '',
  tableId,
  rowDensity,
  onKeyDown
}) => {
  return (
    <div 
      className={`enhanced-data-table ${className}`}
      id={tableId}
      data-density={rowDensity}
      role="region"
      aria-label="Data table with drag-and-drop columns"
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      {children}
    </div>
  )
}

export default TableContainer