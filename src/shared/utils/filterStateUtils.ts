import { FilterState, FilterOption } from '../hooks/useFilterStateManager'

/**
 * Utility functions for filter state management
 */

/**
 * Create a single-select filter
 */
export function createSingleSelectFilter(
  id: string,
  placeholder: string,
  options: FilterOption[],
  initialValue: string = '',
  onChange?: (value: string) => void
): FilterState {
  return {
    id,
    type: 'single-select',
    value: initialValue,
    options,
    placeholder,
    isActive: initialValue !== '' && initialValue !== 'all',
    activeCount: initialValue !== '' && initialValue !== 'all' ? 1 : 0,
    onChange
  }
}

/**
 * Create a multi-select filter
 */
export function createSimpleMultiSelect(
  id: string,
  placeholder: string,
  options: FilterOption[],
  initialValue: string[] = [],
  onChange?: (values: string[]) => void
): FilterState {
  return {
    id,
    type: 'multi-select',
    value: initialValue,
    options,
    placeholder,
    isActive: initialValue.length > 0,
    activeCount: initialValue.length,
    onChange
  }
}

/**
 * Create a search filter
 */
export function createSearchFilter(
  id: string,
  placeholder: string,
  initialValue: string = '',
  onChange?: (value: string) => void
): FilterState {
  return {
    id,
    type: 'search',
    value: initialValue,
    placeholder,
    isActive: initialValue.trim() !== '',
    activeCount: initialValue.trim() !== '' ? 1 : 0,
    onChange
  }
}

/**
 * Convert legacy filter format to FilterState
 */
export function convertLegacyFilter(legacyFilter: {
  id: string
  placeholder: string
  value: string | string[]
  options: FilterOption[]
  onChange: (value: any) => void
  type?: 'multi-select'
}): FilterState {
  const isMultiSelect = legacyFilter.type === 'multi-select'
  
  if (isMultiSelect) {
    return createSimpleMultiSelect(
      legacyFilter.id,
      legacyFilter.placeholder,
      legacyFilter.options,
      Array.isArray(legacyFilter.value) ? legacyFilter.value : [],
      legacyFilter.onChange
    )
  } else {
    return createSingleSelectFilter(
      legacyFilter.id,
      legacyFilter.placeholder,
      legacyFilter.options,
      typeof legacyFilter.value === 'string' ? legacyFilter.value : '',
      legacyFilter.onChange
    )
  }
}

/**
 * Convert FilterState array to legacy filter format for backward compatibility
 */
export function convertToLegacyFilters(filters: FilterState[]) {
  return filters.map(filter => ({
    id: filter.id,
    placeholder: filter.placeholder,
    value: filter.value,
    options: filter.options || [],
    onChange: filter.onChange || (() => {}),
    ...(filter.type === 'multi-select' && { type: 'multi-select' as const })
  }))
}

/**
 * Get filter summary for display
 */
export function getFilterSummary(filters: FilterState[]) {
  const activeFilters = filters.filter(f => f.isActive)
  const totalActive = activeFilters.length
  const totalSelections = activeFilters.reduce((sum, filter) => sum + (filter.activeCount || 0), 0)
  
  const byType = activeFilters.reduce((acc, filter) => {
    acc[filter.type] = (acc[filter.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return {
    totalActive,
    totalSelections,
    byType,
    activeFilters
  }
}

/**
 * Check if two filter states are equal
 */
export function areFiltersEqual(filter1: FilterState, filter2: FilterState): boolean {
  if (filter1.id !== filter2.id || filter1.type !== filter2.type) {
    return false
  }
  
  if (filter1.type === 'multi-select' && filter2.type === 'multi-select') {
    const arr1 = Array.isArray(filter1.value) ? filter1.value : []
    const arr2 = Array.isArray(filter2.value) ? filter2.value : []
    
    if (arr1.length !== arr2.length) return false
    return arr1.every((val, index) => val === arr2[index])
  }
  
  return filter1.value === filter2.value
}

/**
 * Validate filter state
 */
export function validateFilterState(filter: FilterState): string[] {
  const errors: string[] = []
  
  if (!filter.id) {
    errors.push('Filter must have an id')
  }
  
  if (!filter.type || !['single-select', 'multi-select', 'search'].includes(filter.type)) {
    errors.push('Filter must have a valid type')
  }
  
  if (!filter.placeholder) {
    errors.push('Filter must have a placeholder')
  }
  
  if (filter.type === 'multi-select' && !Array.isArray(filter.value)) {
    errors.push('Multi-select filter value must be an array')
  }
  
  if ((filter.type === 'single-select' || filter.type === 'search') && Array.isArray(filter.value)) {
    errors.push('Single-select and search filter values must not be arrays')
  }
  
  return errors
}

/**
 * Merge filter states (useful for combining different filter sources)
 */
export function mergeFilterStates(
  primaryFilters: FilterState[],
  secondaryFilters: FilterState[]
): FilterState[] {
  const merged = [...primaryFilters]
  
  secondaryFilters.forEach(secondaryFilter => {
    const existingIndex = merged.findIndex(f => f.id === secondaryFilter.id)
    
    if (existingIndex >= 0) {
      // Update existing filter
      merged[existingIndex] = { ...merged[existingIndex], ...secondaryFilter }
    } else {
      // Add new filter
      merged.push(secondaryFilter)
    }
  })
  
  return merged
}

/**
 * Create filter state from URL search params
 */
export function createFiltersFromURLParams(
  searchParams: URLSearchParams,
  filterDefinitions: Array<{
    id: string
    type: 'single-select' | 'multi-select' | 'search'
    placeholder: string
    options?: FilterOption[]
  }>
): FilterState[] {
  return filterDefinitions.map(def => {
    const paramValue = searchParams.get(def.id)
    
    let value: any
    switch (def.type) {
      case 'multi-select':
        value = paramValue ? paramValue.split(',') : []
        break
      case 'single-select':
      case 'search':
      default:
        value = paramValue || ''
        break
    }
    
    return {
      id: def.id,
      type: def.type,
      value,
      options: def.options,
      placeholder: def.placeholder,
      isActive: def.type === 'multi-select' 
        ? Array.isArray(value) && value.length > 0
        : value !== '' && value !== 'all',
      activeCount: def.type === 'multi-select'
        ? Array.isArray(value) ? value.length : 0
        : (value !== '' && value !== 'all' ? 1 : 0)
    }
  })
}

/**
 * Convert filter state to URL search params
 */
export function convertFiltersToURLParams(filters: FilterState[]): URLSearchParams {
  const params = new URLSearchParams()
  
  filters.forEach(filter => {
    if (filter.isActive) {
      if (filter.type === 'multi-select' && Array.isArray(filter.value)) {
        params.set(filter.id, filter.value.join(','))
      } else if (filter.value) {
        params.set(filter.id, String(filter.value))
      }
    }
  })
  
  return params
}