import React, { useMemo, useState, useRef } from 'react'
import './EnhancedDataTable.css'
import { AdvancedDataTableProps } from './types/table.types'
import { useSelection } from './hooks/useSelection'
import { usePagination } from './hooks/usePagination'
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation'
import { useColumnDragDrop } from './hooks/useColumnDragDrop'
import { useTableConfiguration } from './hooks/useTableConfiguration'

import TableHeader from './components/TableHeader'
import TableBody from './components/TableBody'
import BulkActionsToolbar from './components/BulkActionsToolbar'
import Pagination from './components/Pagination'

/**
 * Simplified Data Table Component
 * 
 * A clean, focused data table with essential features:
 * - Row selection and bulk operations
 * - Clean table design with proper styling
 * - Action buttons per row
 */
const AdvancedDataTable = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  error = null as string | null,
  onRowClick,
  onRowSelect,
  onBulkAction,
  enableSelection = true,
  enablePagination = true,
  initialPageSize = 25,
  className = '',
  id
}: AdvancedDataTableProps<T>) => {
  const tableRef = useRef<HTMLTableElement>(null)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())

  // Initialize pagination
  const pagination = usePagination<T>({
    data: data,
    initialPageSize: initialPageSize,
    initialPage: 1
  })

  // Use paginated data or full data based on enablePagination
  const displayData = enablePagination ? pagination.paginatedData : data

  // Initialize selection functionality
  const selection = useSelection({
    data: displayData,
    selectedRows: selectedRows,
    onSelectionChange: setSelectedRows,
    enableMultiSelect: enableSelection,
    enableSelectAll: enableSelection,
    persistAcrossPages: enablePagination
  })

  // Initialize keyboard navigation
  const keyboard = useKeyboardNavigation({
    data: displayData,
    selectedRows: selectedRows,
    onSelectionChange: setSelectedRows,
    onRowClick: onRowClick,
    enableMultiSelect: enableSelection,
    tableRef: tableRef
  })

  // Handle row click with keyboard support
  const handleRowClick = (row: any, index: number, event?: React.MouseEvent) => {
    if (event && enableSelection) {
      keyboard.handleRowClick(row, index, event)
    } else {
      onRowClick?.(row)
    }
    
    // Notify parent component
    if (onRowSelect) {
      onRowSelect(selection.selectedRowData)
    }
  }

  // Handle row selection checkbox
  const handleRowSelect = (row: any) => {
    if (!enableSelection) return
    
    selection.toggleRowSelection(row)
    
    // Notify parent component
    if (onRowSelect) {
      onRowSelect(selection.selectedRowData)
    }
  }

  // Handle select all
  const handleSelectAll = () => {
    if (!enableSelection) return
    
    selection.toggleSelectAll()
    
    // Notify parent component
    if (onRowSelect) {
      onRowSelect(selection.selectedRowData)
    }
  }

  // Handle bulk actions
  const handleBulkAction = (actionId: string, selectedData: any[]) => {
    if (actionId === 'clear-selection') {
      selection.deselectAll()
      return
    }
    
    // Call parent bulk action handler
    onBulkAction?.(actionId, selectedData)
  }

  // Initialize drag-and-drop and resizing
  const dragDrop = useColumnDragDrop({
    columns,
    storageKey: id ? `${id}-columns` : 'table-columns'
  })

  // Table configuration (widths, order)
  const { tableId, columnStates } = useTableConfiguration({
    id,
    columns,
    dragDrop
  })

  return (
    <div 
      className={`advanced-data-table ${className}`}
      id={tableId}
      role="region"
      aria-label="Data table"
      onKeyDown={keyboard.handleKeyDown}
      tabIndex={0}
    >
      {/* Bulk actions toolbar */}
      {enableSelection && (
        <BulkActionsToolbar
          selectedCount={selection.selectionCount}
          totalCount={displayData.length}
          selectedData={selection.selectedRowData}
          onAction={(actionId, data) => handleBulkAction(actionId, data)}
          onClearSelection={selection.deselectAll}
        />
      )}

      {/* Table container */}
      <div className="table-container border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto min-w-0">
          <table ref={tableRef} className="w-full border-collapse bg-white min-w-max">
            {/* Table header */}
            <TableHeader
              columns={dragDrop.orderedColumns}
              columnStates={columnStates}
              sortConfig={[]}
              onSort={undefined}
              onResize={dragDrop.handleColumnResize}
              enableSelection={enableSelection}
              isAllSelected={selection.isAllSelected}
              isPartiallySelected={selection.isPartiallySelected}
              onSelectAll={handleSelectAll}
            />

            {/* Table body */}
            <TableBody
              data={displayData}
              columns={dragDrop.orderedColumns}
              columnStates={columnStates}
              selectedRows={selection.selectedRows}
              rowDensity="compact"
              loading={loading}
              error={error}
              onRowClick={handleRowClick}
              onRowSelect={enableSelection ? handleRowSelect : undefined}
              enableSelection={enableSelection}
              focusedRowIndex={keyboard.focusedRowIndex}
            />
          </table>
        </div>
      </div>
      
      {/* Pagination */}
      {enablePagination && (
        <div className="mt-4">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            pageSize={pagination.pageSize}
            totalItems={pagination.totalItems}
            onPageChange={pagination.setPage}
            onPageSizeChange={pagination.setPageSize}
            pageSizeOptions={[25, 50, 100, 200]}
            showPageSizeSelector={true}
            showJumpToPage={true}
          />
        </div>
      )}

      {/* Table footer with stats */}
      {!enablePagination && (
        <div className="table-footer mt-4 flex items-center justify-between text-sm text-gray-500">
          <div>
            Showing {data.length} items
          </div>
          
          <div className="flex items-center gap-4">
            {enableSelection && selection.selectionCount > 0 && (
              <span>{selection.selectionCount} selected</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdvancedDataTable