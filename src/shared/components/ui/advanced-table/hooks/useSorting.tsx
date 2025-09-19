import { useCallback, useMemo } from 'react'
import { SortConfig, ColumnDefinition } from '../types'
import { sortData, compareValues } from '../utils/tableHelpers'

interface UseSortingProps<T> {
  data: T[]
  columns: ColumnDefinition<T>[]
  sortConfig: SortConfig[]
  onSortChange: (sortConfig: SortConfig[]) => void
}

interface UseSortingReturn<T> {
  sortedData: T[]
  addSort: (columnId: string, direction?: 'asc' | 'desc') => void
  removeSort: (columnId: string) => void
  clearSort: () => void
  toggleSort: (columnId: string) => void
  setSortConfig: (config: SortConfig[]) => void
  getSortDirection: (columnId: string) => 'asc' | 'desc' | null
  getSortPriority: (columnId: string) => number | null
  isSorted: (columnId: string) => boolean
  hasMultipleSorts: boolean
  canSort: (columnId: string) => boolean
}

/**
 * Hook for managing table sorting functionality
 */
export function useSorting<T>({
  data,
  columns,
  sortConfig,
  onSortChange
}: UseSortingProps<T>): UseSortingReturn<T> {
  
  // Memoized sorted data
  const sortedData = useMemo(() => {
    return sortData(data, sortConfig, columns)
  }, [data, sortConfig, columns])

  // Check if a column can be sorted
  const canSort = useCallback((columnId: string): boolean => {
    const column = columns.find(col => col.id === columnId)
    return column?.sortable !== false
  }, [columns])

  // Get sort direction for a column
  const getSortDirection = useCallback((columnId: string): 'asc' | 'desc' | null => {
    const sortItem = sortConfig.find(s => s.columnId === columnId)
    return sortItem ? sortItem.direction : null
  }, [sortConfig])

  // Get sort priority for a column
  const getSortPriority = useCallback((columnId: string): number | null => {
    const sortItem = sortConfig.find(s => s.columnId === columnId)
    return sortItem ? sortItem.priority : null
  }, [sortConfig])

  // Check if a column is currently sorted
  const isSorted = useCallback((columnId: string): boolean => {
    return sortConfig.some(s => s.columnId === columnId)
  }, [sortConfig])

  // Check if multiple columns are sorted
  const hasMultipleSorts = useMemo(() => {
    return sortConfig.length > 1
  }, [sortConfig])

  // Add or update sort for a column
  const addSort = useCallback((columnId: string, direction: 'asc' | 'desc' = 'asc') => {
    if (!canSort(columnId)) return

    const existingIndex = sortConfig.findIndex(s => s.columnId === columnId)
    let newSortConfig: SortConfig[]

    if (existingIndex >= 0) {
      // Update existing sort
      newSortConfig = sortConfig.map(s => 
        s.columnId === columnId 
          ? { ...s, direction }
          : s
      )
    } else {
      // Add new sort
      const newSort: SortConfig = {
        columnId,
        direction,
        priority: sortConfig.length
      }
      newSortConfig = [...sortConfig, newSort]
    }

    // Recalculate priorities
    newSortConfig = newSortConfig.map((sort, index) => ({
      ...sort,
      priority: index
    }))

    onSortChange(newSortConfig)
  }, [sortConfig, canSort, onSortChange])

  // Remove sort for a column
  const removeSort = useCallback((columnId: string) => {
    const newSortConfig = sortConfig
      .filter(s => s.columnId !== columnId)
      .map((sort, index) => ({
        ...sort,
        priority: index
      }))

    onSortChange(newSortConfig)
  }, [sortConfig, onSortChange])

  // Clear all sorting
  const clearSort = useCallback(() => {
    onSortChange([])
  }, [onSortChange])

  // Toggle sort for a column (asc -> desc -> none)
  const toggleSort = useCallback((columnId: string) => {
    if (!canSort(columnId)) return

    const currentDirection = getSortDirection(columnId)
    
    if (!currentDirection) {
      // Not sorted, add ascending sort
      addSort(columnId, 'asc')
    } else if (currentDirection === 'asc') {
      // Currently ascending, change to descending
      addSort(columnId, 'desc')
    } else {
      // Currently descending, remove sort
      removeSort(columnId)
    }
  }, [canSort, getSortDirection, addSort, removeSort])

  // Set complete sort configuration
  const setSortConfig = useCallback((config: SortConfig[]) => {
    // Validate that all columns can be sorted
    const validConfig = config.filter(sort => canSort(sort.columnId))
    
    // Recalculate priorities
    const normalizedConfig = validConfig.map((sort, index) => ({
      ...sort,
      priority: index
    }))

    onSortChange(normalizedConfig)
  }, [canSort, onSortChange])

  return {
    sortedData,
    addSort,
    removeSort,
    clearSort,
    toggleSort,
    setSortConfig,
    getSortDirection,
    getSortPriority,
    isSorted,
    hasMultipleSorts,
    canSort
  }
}

/**
 * Hook for advanced sorting with custom comparators
 */
export function useAdvancedSorting<T>({
  data,
  columns,
  sortConfig,
  onSortChange
}: UseSortingProps<T>) {
  const basicSorting = useSorting({ data, columns, sortConfig, onSortChange })

  // Custom sort with comparator function
  const sortWithComparator = useCallback((
    columnId: string,
    comparator: (a: any, b: any) => number,
    direction: 'asc' | 'desc' = 'asc'
  ) => {
    if (!basicSorting.canSort(columnId)) return

    const column = columns.find(col => col.id === columnId)
    if (!column) return

    // Create a custom sorted array
    const customSortedData = [...data].sort((a, b) => {
      const aValue = typeof column.accessor === 'function' 
        ? column.accessor(a) 
        : a[column.accessor]
      const bValue = typeof column.accessor === 'function' 
        ? column.accessor(b) 
        : b[column.accessor]

      const comparison = comparator(aValue, bValue)
      return direction === 'asc' ? comparison : -comparison
    })

    return customSortedData
  }, [data, columns, basicSorting])

  // Sort by multiple columns with custom logic
  const multiColumnSort = useCallback((
    sortRules: Array<{
      columnId: string
      direction: 'asc' | 'desc'
      comparator?: (a: any, b: any) => number
    }>
  ) => {
    const validRules = sortRules.filter(rule => basicSorting.canSort(rule.columnId))
    
    const sortedData = [...data].sort((a, b) => {
      for (const rule of validRules) {
        const column = columns.find(col => col.id === rule.columnId)
        if (!column) continue

        const aValue = typeof column.accessor === 'function' 
          ? column.accessor(a) 
          : a[column.accessor]
        const bValue = typeof column.accessor === 'function' 
          ? column.accessor(b) 
          : b[column.accessor]

        const comparison = rule.comparator 
          ? rule.comparator(aValue, bValue)
          : compareValues(aValue, bValue, column.type)
        
        if (comparison !== 0) {
          return rule.direction === 'asc' ? comparison : -comparison
        }
      }
      return 0
    })

    return sortedData
  }, [data, columns, basicSorting])

  // Natural sort for strings with numbers
  const naturalSort = useCallback((columnId: string, direction: 'asc' | 'desc' = 'asc') => {
    return sortWithComparator(columnId, (a, b) => {
      return String(a).localeCompare(String(b), undefined, { 
        numeric: true, 
        sensitivity: 'base' 
      })
    }, direction)
  }, [sortWithComparator])

  // Case-insensitive sort
  const caseInsensitiveSort = useCallback((columnId: string, direction: 'asc' | 'desc' = 'asc') => {
    return sortWithComparator(columnId, (a, b) => {
      return String(a).toLowerCase().localeCompare(String(b).toLowerCase())
    }, direction)
  }, [sortWithComparator])

  // Null-safe sort (nulls last)
  const nullSafeSort = useCallback((columnId: string, direction: 'asc' | 'desc' = 'asc') => {
    return sortWithComparator(columnId, (a, b) => {
      if (a == null && b == null) return 0
      if (a == null) return 1  // nulls last
      if (b == null) return -1
      
      const column = columns.find(col => col.id === columnId)
      return compareValues(a, b, column?.type)
    }, direction)
  }, [sortWithComparator, columns])

  return {
    ...basicSorting,
    sortWithComparator,
    multiColumnSort,
    naturalSort,
    caseInsensitiveSort,
    nullSafeSort
  }
}

/**
 * Utility functions for sorting
 */
export const sortingUtils = {
  // Create a sort configuration from URL parameters
  parseSortFromUrl: (searchParams: URLSearchParams): SortConfig[] => {
    const sortParam = searchParams.get('sort')
    if (!sortParam) return []

    try {
      const sortItems = sortParam.split(',')
      return sortItems.map((item, index) => {
        const [columnId, direction = 'asc'] = item.split(':')
        return {
          columnId,
          direction: direction as 'asc' | 'desc',
          priority: index
        }
      })
    } catch {
      return []
    }
  },

  // Convert sort configuration to URL parameter
  sortToUrlParam: (sortConfig: SortConfig[]): string => {
    return sortConfig
      .sort((a, b) => a.priority - b.priority)
      .map(sort => `${sort.columnId}:${sort.direction}`)
      .join(',')
  },

  // Get sort indicator icon
  getSortIcon: (direction: 'asc' | 'desc' | null) => {
    switch (direction) {
      case 'asc': return '↑'
      case 'desc': return '↓'
      default: return '↕'
    }
  },

  // Get sort description for accessibility
  getSortDescription: (columnName: string, direction: 'asc' | 'desc' | null, priority?: number) => {
    if (!direction) {
      return `Sort ${columnName}`
    }
    
    const directionText = direction === 'asc' ? 'ascending' : 'descending'
    const priorityText = priority !== undefined && priority > 0 ? `, priority ${priority + 1}` : ''
    
    return `Sorted by ${columnName} ${directionText}${priorityText}`
  }
}