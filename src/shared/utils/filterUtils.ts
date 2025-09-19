/**
 * Filter management utilities for column selector
 */

import { FilterValue } from '../types/utility'

export interface FilterConfig {
  id: string
  type: 'category' | 'dataType' | 'usage' | 'custom' | 'search'
  label: string
  value: FilterValue
  operator: 'equals' | 'contains' | 'in' | 'range' | 'exists'
  active: boolean
  removable?: boolean
  description?: string
}

export interface FilterState {
  activeFilters: FilterConfig[]
  filterHistory: FilterConfig[]
  quickFilters: FilterConfig[]
}

export interface FilterSummary {
  totalActive: number
  byType: Record<string, number>
  hasSearch: boolean
  hasCategory: boolean
  hasCustom: boolean
}

/**
 * Create a filter configuration
 */
export function createFilter(
  type: FilterConfig['type'],
  label: string,
  value: FilterValue,
  operator: FilterConfig['operator'] = 'equals',
  options: Partial<FilterConfig> = {}
): FilterConfig {
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    label,
    value,
    operator,
    active: true,
    removable: true,
    ...options
  }
}

/**
 * Add filter to state
 */
export function addFilter(state: FilterState, filter: FilterConfig): FilterState {
  // Check if similar filter already exists
  const existingIndex = state.activeFilters.findIndex(f => 
    f.type === filter.type && 
    f.value === filter.value && 
    f.operator === filter.operator
  )
  
  if (existingIndex >= 0) {
    // Update existing filter
    const newFilters = [...state.activeFilters]
    newFilters[existingIndex] = { ...newFilters[existingIndex], ...filter, active: true }
    
    return {
      ...state,
      activeFilters: newFilters
    }
  }
  
  // Add new filter
  return {
    ...state,
    activeFilters: [...state.activeFilters, filter],
    filterHistory: addToHistory(state.filterHistory, filter)
  }
}

/**
 * Remove filter from state
 */
export function removeFilter(state: FilterState, filterId: string): FilterState {
  return {
    ...state,
    activeFilters: state.activeFilters.filter(f => f.id !== filterId)
  }
}

/**
 * Toggle filter active state
 */
export function toggleFilter(state: FilterState, filterId: string): FilterState {
  return {
    ...state,
    activeFilters: state.activeFilters.map(f => 
      f.id === filterId ? { ...f, active: !f.active } : f
    )
  }
}

/**
 * Clear all filters
 */
export function clearAllFilters(state: FilterState): FilterState {
  return {
    ...state,
    activeFilters: []
  }
}

/**
 * Clear filters by type
 */
export function clearFiltersByType(state: FilterState, type: FilterConfig['type']): FilterState {
  return {
    ...state,
    activeFilters: state.activeFilters.filter(f => f.type !== type)
  }
}

/**
 * Get filter summary
 */
export function getFilterSummary(filters: FilterConfig[]): FilterSummary {
  const activeFilters = filters.filter(f => f.active)
  
  const byType: Record<string, number> = {}
  activeFilters.forEach(filter => {
    byType[filter.type] = (byType[filter.type] || 0) + 1
  })
  
  return {
    totalActive: activeFilters.length,
    byType,
    hasSearch: byType.search > 0,
    hasCategory: byType.category > 0,
    hasCustom: byType.custom > 0
  }
}

/**
 * Add filter to history
 */
function addToHistory(history: FilterConfig[], filter: FilterConfig, maxSize: number = 20): FilterConfig[] {
  // Remove if already exists
  const filtered = history.filter(f => 
    !(f.type === filter.type && f.value === filter.value && f.operator === filter.operator)
  )
  
  // Add to beginning
  const newHistory = [filter, ...filtered]
  
  // Limit size
  return newHistory.slice(0, maxSize)
}

/**
 * Apply filters to items
 */
export function applyFilters<T>(
  items: T[],
  filters: FilterConfig[],
  fieldMap: Record<string, keyof T>
): T[] {
  const activeFilters = filters.filter(f => f.active)
  
  if (activeFilters.length === 0) {
    return items
  }
  
  return items.filter(item => {
    return activeFilters.every(filter => {
      const fieldName = fieldMap[filter.type]
      if (!fieldName) return true
      
      const fieldValue = item[fieldName]
      
      switch (filter.operator) {
        case 'equals':
          return fieldValue === filter.value
          
        case 'contains':
          return String(fieldValue).toLowerCase().includes(String(filter.value).toLowerCase())
          
        case 'in':
          return Array.isArray(filter.value) && filter.value.includes(String(fieldValue))
          
        case 'exists':
          return fieldValue != null && fieldValue !== ''
          
        case 'range':
          if (Array.isArray(filter.value) && filter.value.length === 2) {
            const numValue = Number(fieldValue)
            return numValue >= Number(filter.value[0]) && numValue <= Number(filter.value[1])
          }
          return true
          
        default:
          return true
      }
    })
  })
}

/**
 * Create quick filters for common scenarios
 */
export function createQuickFilters<T>(items: T[]): FilterConfig[] {
  const quickFilters: FilterConfig[] = []
  
  // High importance filter
  quickFilters.push(createFilter(
    'usage',
    'High Importance',
    'high',
    'equals',
    { description: 'Show only high importance columns', removable: false }
  ))
  
  // Required columns filter
  quickFilters.push(createFilter(
    'custom',
    'Required Only',
    true,
    'equals',
    { description: 'Show only required columns', removable: false }
  ))
  
  // Recently used filter
  quickFilters.push(createFilter(
    'custom',
    'Recently Used',
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
    'range',
    { description: 'Show recently used columns', removable: false }
  ))
  
  return quickFilters
}

/**
 * Format filter for display
 */
export function formatFilterForDisplay(filter: FilterConfig): string {
  switch (filter.type) {
    case 'category':
      return `Category: ${filter.value}`
      
    case 'dataType':
      return `Type: ${filter.value}`
      
    case 'usage':
      return `Importance: ${filter.value}`
      
    case 'search':
      return `Search: "${filter.value}"`
      
    default:
      return filter.label
  }
}