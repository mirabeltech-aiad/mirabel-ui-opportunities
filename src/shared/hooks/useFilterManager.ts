import { logger } from '../utils/logger'

import { useState, useCallback, useMemo } from 'react'
import { 
  FilterConfig, 
  FilterState, 
  FilterSummary,
  addFilter, 
  removeFilter, 
  toggleFilter, 
  clearAllFilters, 
  clearFiltersByType,
  getFilterSummary,
  createQuickFilters,
  createFilter
} from '../utils/filterUtils'

export interface UseFilterManagerOptions {
  enableQuickFilters?: boolean
  maxFilters?: number
  persistFilters?: boolean
  storageKey?: string
}

export interface UseFilterManagerReturn {
  // State
  filterState: FilterState
  filterSummary: FilterSummary
  
  // Actions
  addFilter: (filter: FilterConfig) => void
  removeFilter: (filterId: string) => void
  toggleFilter: (filterId: string) => void
  clearAllFilters: () => void
  clearFiltersByType: (type: FilterConfig['type']) => void
  
  // Quick actions
  addSearchFilter: (searchTerm: string) => void
  addCategoryFilter: (category: string) => void
  addDataTypeFilter: (dataType: string) => void
  addUsageFilter: (importance: string) => void
  
  // Utilities
  hasActiveFilters: boolean
  getActiveFilters: () => FilterConfig[]
  getFiltersByType: (type: FilterConfig['type']) => FilterConfig[]
  canAddMoreFilters: boolean
}

export function useFilterManager(options: UseFilterManagerOptions = {}): UseFilterManagerReturn {
  const {
    enableQuickFilters = true,
    maxFilters = 10,
    persistFilters = false,
    storageKey = 'column-selector-filters'
  } = options
  
  // Initialize state
  const [filterState, setFilterState] = useState<FilterState>(() => {
    const initialState: FilterState = {
      activeFilters: [],
      filterHistory: [],
      quickFilters: enableQuickFilters ? createQuickFilters([]) : []
    }
    
    // Load from storage if enabled
    if (persistFilters && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey)
        if (stored) {
          const parsedState = JSON.parse(stored)
          return { ...initialState, ...parsedState }
        }
      } catch (error) {
        logger.warn('Failed to load filter state from storage:', error)
      }
    }
    
    return initialState
  })
  
  // Persist state changes
  const updateState = useCallback((newState: FilterState) => {
    setFilterState(newState)
    
    if (persistFilters && typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(newState))
      } catch (error) {
        logger.warn('Failed to save filter state to storage:', error)
      }
    }
  }, [persistFilters, storageKey])
  
  // Filter summary
  const filterSummary = useMemo(() => {
    return getFilterSummary(filterState.activeFilters)
  }, [filterState.activeFilters])
  
  // Actions
  const handleAddFilter = useCallback((filter: FilterConfig) => {
    if (filterState.activeFilters.length >= maxFilters) {
      logger.warn(`Maximum number of filters (${maxFilters}) reached`)
      return
    }
    
    const newState = addFilter(filterState, filter)
    updateState(newState)
  }, [filterState, maxFilters, updateState])
  
  const handleRemoveFilter = useCallback((filterId: string) => {
    const newState = removeFilter(filterState, filterId)
    updateState(newState)
  }, [filterState, updateState])
  
  const handleToggleFilter = useCallback((filterId: string) => {
    const newState = toggleFilter(filterState, filterId)
    updateState(newState)
  }, [filterState, updateState])
  
  const handleClearAllFilters = useCallback(() => {
    const newState = clearAllFilters(filterState)
    updateState(newState)
  }, [filterState, updateState])
  
  const handleClearFiltersByType = useCallback((type: FilterConfig['type']) => {
    const newState = clearFiltersByType(filterState, type)
    updateState(newState)
  }, [filterState, updateState])
  
  // Quick filter actions
  const addSearchFilter = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return
    
    const filter = createFilter('search', 'Search', searchTerm, 'contains', {
      description: `Search for "${searchTerm}"`
    })
    handleAddFilter(filter)
  }, [handleAddFilter])
  
  const addCategoryFilter = useCallback((category: string) => {
    const filter = createFilter('category', 'Category', category, 'equals', {
      description: `Filter by category: ${category}`
    })
    handleAddFilter(filter)
  }, [handleAddFilter])
  
  const addDataTypeFilter = useCallback((dataType: string) => {
    const filter = createFilter('dataType', 'Data Type', dataType, 'equals', {
      description: `Filter by data type: ${dataType}`
    })
    handleAddFilter(filter)
  }, [handleAddFilter])
  
  const addUsageFilter = useCallback((importance: string) => {
    const filter = createFilter('usage', 'Usage', importance, 'equals', {
      description: `Filter by importance: ${importance}`
    })
    handleAddFilter(filter)
  }, [handleAddFilter])
  
  // Utilities
  const hasActiveFilters = filterSummary.totalActive > 0
  
  const getActiveFilters = useCallback(() => {
    return filterState.activeFilters.filter(f => f.active)
  }, [filterState.activeFilters])
  
  const getFiltersByType = useCallback((type: FilterConfig['type']) => {
    return filterState.activeFilters.filter(f => f.type === type)
  }, [filterState.activeFilters])
  
  const canAddMoreFilters = filterState.activeFilters.length < maxFilters
  
  return {
    // State
    filterState,
    filterSummary,
    
    // Actions
    addFilter: handleAddFilter,
    removeFilter: handleRemoveFilter,
    toggleFilter: handleToggleFilter,
    clearAllFilters: handleClearAllFilters,
    clearFiltersByType: handleClearFiltersByType,
    
    // Quick actions
    addSearchFilter,
    addCategoryFilter,
    addDataTypeFilter,
    addUsageFilter,
    
    // Utilities
    hasActiveFilters,
    getActiveFilters,
    getFiltersByType,
    canAddMoreFilters
  }
}