import { useMemo, useEffect } from 'react'
import { SortConfig } from '../types/table.types'
import { usePagination } from './usePagination'

interface UseTableDataProps<T> {
  data: T[]
  columns: any[]
  sortConfig: SortConfig[]
  enablePagination: boolean
  initialPageSize: number
}

interface UseTableDataReturn<T> {
  sortedData: T[]
  displayData: T[]
  pagination: any
}

/**
 * Custom hook for managing table data processing, sorting, and pagination
 * Extracted from EnhancedDataTable for better separation of concerns
 */
export const useTableData = <T extends Record<string, any>>({
  data,
  columns,
  sortConfig,
  enablePagination,
  initialPageSize
}: UseTableDataProps<T>): UseTableDataReturn<T> => {
  // Apply sorting to data
  const sortedData = useMemo(() => {
    if (sortConfig.length === 0) return data

    // Sort the sort config by priority
    const sortedSortConfig = [...sortConfig].sort((a, b) => a.priority - b.priority)

    return [...data].sort((a, b) => {
      for (const sort of sortedSortConfig) {
        const column = columns.find(col => col.id === sort.columnId)
        if (!column) continue

        let aValue = column.accessor ? 
          (typeof column.accessor === 'function' ? column.accessor(a) : a[column.accessor]) : 
          a[column.id]
        let bValue = column.accessor ? 
          (typeof column.accessor === 'function' ? column.accessor(b) : b[column.accessor]) : 
          b[column.id]

        // Handle null/undefined values
        if (aValue == null && bValue == null) continue
        if (aValue == null) return sort.direction === 'asc' ? 1 : -1
        if (bValue == null) return sort.direction === 'asc' ? -1 : 1

        // Convert to comparable values
        if (typeof aValue === 'string') aValue = aValue.toLowerCase()
        if (typeof bValue === 'string') bValue = bValue.toLowerCase()

        let comparison = 0
        if (aValue < bValue) comparison = -1
        if (aValue > bValue) comparison = 1

        if (comparison !== 0) {
          return sort.direction === 'asc' ? comparison : -comparison
        }
      }
      return 0
    })
  }, [data, sortConfig, columns])

  // Initialize pagination with sorted data
  const pagination = usePagination<T>({
    data: sortedData,
    initialPageSize: initialPageSize,
    initialPage: 1
  })

  // Reset to first page when sorting changes
  useEffect(() => {
    if (enablePagination && sortConfig.length > 0) {
      pagination.setPage(1)
    }
  }, [sortConfig, enablePagination, pagination])

  // Use paginated data or full sorted data based on enablePagination
  const displayData = enablePagination ? pagination.paginatedData : sortedData

  return {
    sortedData,
    displayData,
    pagination
  }
}