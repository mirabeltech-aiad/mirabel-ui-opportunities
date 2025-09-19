import { SortConfig, FilterConfig, ColumnDefinition } from '../types'

/**
 * Get value from object using accessor (key or function)
 */
export function getValueByAccessor<T>(
  row: T, 
  accessor: keyof T | ((row: T) => any)
): any {
  if (typeof accessor === 'function') {
    return accessor(row)
  }
  return row[accessor]
}

/**
 * Generate unique ID for table elements
 */
export function generateTableId(prefix: string = 'table'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get row ID from row data
 */
export function getRowId<T>(row: T, idField: keyof T = 'id' as keyof T): string {
  const id = row[idField]
  return String(id ?? generateTableId('row'))
}

/**
 * Sort data based on sort configuration
 */
export function sortData<T>(
  data: T[], 
  sortConfig: SortConfig[], 
  columns: ColumnDefinition<T>[]
): T[] {
  if (!sortConfig.length) return data

  return [...data].sort((a, b) => {
    for (const sort of sortConfig.sort((a, b) => a.priority - b.priority)) {
      const column = columns.find(col => col.id === sort.columnId)
      if (!column) continue

      const aValue = getValueByAccessor(a, column.accessor)
      const bValue = getValueByAccessor(b, column.accessor)

      const comparison = compareValues(aValue, bValue, column.type)
      
      if (comparison !== 0) {
        return sort.direction === 'asc' ? comparison : -comparison
      }
    }
    return 0
  })
}

/**
 * Compare two values based on column type
 */
export function compareValues(a: any, b: any, type?: string): number {
  // Handle null/undefined values
  if (a == null && b == null) return 0
  if (a == null) return -1
  if (b == null) return 1

  switch (type) {
    case 'number':
    case 'currency':
    case 'percentage':
      return Number(a) - Number(b)
    
    case 'date':
    case 'datetime':
      return new Date(a).getTime() - new Date(b).getTime()
    
    case 'boolean':
      return Number(a) - Number(b)
    
    default:
      return String(a).localeCompare(String(b), undefined, { 
        numeric: true, 
        sensitivity: 'base' 
      })
  }
}

/**
 * Filter data based on filter configuration
 */
export function filterData<T>(
  data: T[], 
  filters: FilterConfig[], 
  columns: ColumnDefinition<T>[],
  globalSearch?: string
): T[] {
  let filteredData = data

  // Apply column filters
  for (const filter of filters) {
    const column = columns.find(col => col.id === filter.columnId)
    if (!column) continue

    filteredData = filteredData.filter(row => {
      const value = getValueByAccessor(row, column.accessor)
      return matchesFilter(value, filter, column.type)
    })
  }

  // Apply global search
  if (globalSearch && globalSearch.trim()) {
    const searchTerm = globalSearch.toLowerCase().trim()
    filteredData = filteredData.filter(row => {
      return columns.some(column => {
        if (!column.filterable) return false
        const value = getValueByAccessor(row, column.accessor)
        return String(value).toLowerCase().includes(searchTerm)
      })
    })
  }

  return filteredData
}

/**
 * Check if value matches filter criteria
 */
export function matchesFilter(value: any, filter: FilterConfig, columnType?: string): boolean {
  const { operator = 'contains', value: filterValue } = filter

  // Handle null/undefined values
  if (value == null) {
    return filterValue == null || filterValue === ''
  }

  const stringValue = String(value).toLowerCase()
  const filterString = String(filterValue).toLowerCase()

  switch (operator) {
    case 'equals':
      return stringValue === filterString
    
    case 'contains':
      return stringValue.includes(filterString)
    
    case 'startsWith':
      return stringValue.startsWith(filterString)
    
    case 'endsWith':
      return stringValue.endsWith(filterString)
    
    case 'gt':
      return Number(value) > Number(filterValue)
    
    case 'lt':
      return Number(value) < Number(filterValue)
    
    case 'gte':
      return Number(value) >= Number(filterValue)
    
    case 'lte':
      return Number(value) <= Number(filterValue)
    
    case 'between':
      if (Array.isArray(filterValue) && filterValue.length === 2) {
        const numValue = Number(value)
        return numValue >= Number(filterValue[0]) && numValue <= Number(filterValue[1])
      }
      return false
    
    case 'in':
      return Array.isArray(filterValue) && filterValue.includes(value)
    
    case 'notIn':
      return Array.isArray(filterValue) && !filterValue.includes(value)
    
    default:
      return true
  }
}

/**
 * Paginate data
 */
export function paginateData<T>(
  data: T[], 
  page: number, 
  pageSize: number
): { data: T[]; totalPages: number; totalItems: number } {
  const totalItems = data.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  
  return {
    data: data.slice(startIndex, endIndex),
    totalPages,
    totalItems
  }
}

/**
 * Group data by column value
 */
export function groupData<T>(
  data: T[], 
  groupByColumn: string, 
  columns: ColumnDefinition<T>[]
): Record<string, T[]> {
  const column = columns.find(col => col.id === groupByColumn)
  if (!column) return { 'All': data }

  const groups: Record<string, T[]> = {}
  
  for (const row of data) {
    const value = getValueByAccessor(row, column.accessor)
    const groupKey = String(value ?? 'Ungrouped')
    
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(row)
  }

  return groups
}

/**
 * Calculate column statistics
 */
export function calculateColumnStats<T>(
  data: T[], 
  column: ColumnDefinition<T>
): {
  count: number
  unique: number
  nulls: number
  min?: any
  max?: any
  avg?: number
  sum?: number
} {
  const values = data.map(row => getValueByAccessor(row, column.accessor))
  const nonNullValues = values.filter(v => v != null)
  const uniqueValues = new Set(nonNullValues)

  const stats = {
    count: values.length,
    unique: uniqueValues.size,
    nulls: values.length - nonNullValues.length
  }

  if (column.type === 'number' || column.type === 'currency') {
    const numericValues = nonNullValues.map(Number).filter(n => !isNaN(n))
    if (numericValues.length > 0) {
      return {
        ...stats,
        min: Math.min(...numericValues),
        max: Math.max(...numericValues),
        avg: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
        sum: numericValues.reduce((a, b) => a + b, 0)
      }
    }
  }

  if (column.type === 'date' || column.type === 'datetime') {
    const dateValues = nonNullValues.map(v => new Date(v)).filter(d => !isNaN(d.getTime()))
    if (dateValues.length > 0) {
      return {
        ...stats,
        min: new Date(Math.min(...dateValues.map(d => d.getTime()))),
        max: new Date(Math.max(...dateValues.map(d => d.getTime())))
      }
    }
  }

  return stats
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}