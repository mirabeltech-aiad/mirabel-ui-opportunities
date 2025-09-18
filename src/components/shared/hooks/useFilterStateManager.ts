import { logger } from '../../shared/logger'

import { useState, useCallback, useMemo } from 'react'

// Core filter types
export interface FilterOption {
  value: string
  label: string
}

export interface FilterState {
  id: string
  type: 'single-select' | 'multi-select' | 'search'
  value: any
  options?: FilterOption[]
  placeholder: string
  isActive: boolean
  activeCount?: number
  onChange?: (value: any) => void
}

export interface FilterStateManager {
  // Unified filter state
  filters: FilterState[]
  activeFilters: FilterState[]
  hasActiveFilters: boolean
  
  // State management actions
  setFilterValue: (filterId: string, value: any) => void
  clearFilter: (filterId: string) => void
  clearAllFilters: () => void
  resetFilters: () => void
  
  // Active state queries
  isFilterActive: (filterId: string) => boolean
  getActiveFilterCount: (filterId: string) => number
  getFilterDisplayValue: (filterId: string) => string
  
  // Filter management
  addFilter: (filter: Omit<FilterState, 'isActive' | 'activeCount'>) => void
  removeFilter: (filterId: string) => void
  updateFilter: (filterId: string, updates: Partial<FilterState>) => void
}

export interface UseFilterStateManagerOptions {
  initialFilters?: FilterState[]
  onFiltersChange?: (filters: FilterState[]) => void
  persistFilters?: boolean
  storageKey?: string
}

/**
 * Unified filter state management hook
 * Consolidates all filter state logic into a single source of truth
 */
export function useFilterStateManager(
  options: UseFilterStateManagerOptions = {}
): FilterStateManager {
  const {
    initialFilters = [],
    onFiltersChange,
    persistFilters = false,
    storageKey = 'filter-state-manager'
  } = options

  // Helper functions - defined first to avoid hoisting issues
  const determineActiveState = (filter: FilterState): boolean => {
    switch (filter.type) {
      case 'single-select':
        return filter.value !== '' && filter.value !== null && filter.value !== undefined && filter.value !== 'all'
      case 'multi-select':
        return Array.isArray(filter.value) && filter.value.length > 0
      case 'search':
        return typeof filter.value === 'string' && filter.value.trim() !== ''
      default:
        return false
    }
  }

  const getActiveCount = (filter: FilterState): number => {
    switch (filter.type) {
      case 'single-select':
        return determineActiveState(filter) ? 1 : 0
      case 'multi-select':
        return Array.isArray(filter.value) ? filter.value.length : 0
      case 'search':
        return determineActiveState(filter) ? 1 : 0
      default:
        return 0
    }
  }

  // Initialize state with persistence support
  const [filters, setFilters] = useState<FilterState[]>(() => {
    if (persistFilters && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey)
        if (stored) {
          const parsedFilters = JSON.parse(stored)
          return parsedFilters.map((filter: FilterState) => ({
            ...filter,
            isActive: determineActiveState(filter),
            activeCount: getActiveCount(filter)
          }))
        }
      } catch (error) {
        logger.warn('Failed to load filter state from storage:', error)
      }
    }
    
    return initialFilters.map(filter => ({
      ...filter,
      isActive: determineActiveState(filter),
      activeCount: getActiveCount(filter)
    }))
  })

  // Persist state changes
  const persistState = useCallback((newFilters: FilterState[]) => {
    if (persistFilters && typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(newFilters))
      } catch (error) {
        logger.warn('Failed to save filter state to storage:', error)
      }
    }
  }, [persistFilters, storageKey])

  // Update filters with persistence and callback
  const updateFilters = useCallback((newFilters: FilterState[]) => {
    setFilters(newFilters)
    persistState(newFilters)
    onFiltersChange?.(newFilters)
  }, [persistState, onFiltersChange])

  // Computed values
  const activeFilters = useMemo(() => {
    return filters.filter(filter => filter.isActive)
  }, [filters])

  const hasActiveFilters = useMemo(() => {
    return activeFilters.length > 0
  }, [activeFilters])



  // State management actions
  const setFilterValue = useCallback((filterId: string, value: any) => {
    const newFilters = filters.map(filter => {
      if (filter.id === filterId) {
        const updatedFilter = {
          ...filter,
          value,
          isActive: determineActiveState({ ...filter, value }),
          activeCount: getActiveCount({ ...filter, value })
        }
        
        // Call the filter's onChange if it exists
        filter.onChange?.(value)
        
        return updatedFilter
      }
      return filter
    })
    
    updateFilters(newFilters)
  }, [filters, updateFilters])

  const clearFilter = useCallback((filterId: string) => {
    const newFilters = filters.map(filter => {
      if (filter.id === filterId) {
        const clearedValue = filter.type === 'multi-select' ? [] : ''
        const updatedFilter = {
          ...filter,
          value: clearedValue,
          isActive: false,
          activeCount: 0
        }
        
        // Call the filter's onChange if it exists
        filter.onChange?.(clearedValue)
        
        return updatedFilter
      }
      return filter
    })
    
    updateFilters(newFilters)
  }, [filters, updateFilters])

  const clearAllFilters = useCallback(() => {
    const newFilters = filters.map(filter => {
      const clearedValue = filter.type === 'multi-select' ? [] : ''
      const updatedFilter = {
        ...filter,
        value: clearedValue,
        isActive: false,
        activeCount: 0
      }
      
      // Call the filter's onChange if it exists
      filter.onChange?.(clearedValue)
      
      return updatedFilter
    })
    
    updateFilters(newFilters)
  }, [filters, updateFilters])

  const resetFilters = useCallback(() => {
    const resetFilters = initialFilters.map(filter => ({
      ...filter,
      isActive: determineActiveState(filter),
      activeCount: getActiveCount(filter)
    }))
    
    // Call onChange for each filter
    resetFilters.forEach(filter => {
      filter.onChange?.(filter.value)
    })
    
    updateFilters(resetFilters)
  }, [initialFilters, updateFilters])

  // Active state queries
  const isFilterActive = useCallback((filterId: string): boolean => {
    const filter = filters.find(f => f.id === filterId)
    return filter?.isActive ?? false
  }, [filters])

  const getActiveFilterCount = useCallback((filterId: string): number => {
    const filter = filters.find(f => f.id === filterId)
    return filter?.activeCount ?? 0
  }, [filters])

  const getFilterDisplayValue = useCallback((filterId: string): string => {
    const filter = filters.find(f => f.id === filterId)
    if (!filter) return ''

    switch (filter.type) {
      case 'single-select':
        if (!filter.isActive) return filter.placeholder
        const selectedOption = filter.options?.find(opt => opt.value === filter.value)
        return selectedOption?.label || filter.value
      
      case 'multi-select':
        if (!filter.isActive) return filter.placeholder
        if (filter.activeCount === 1) {
          const selectedOption = filter.options?.find(opt => opt.value === filter.value[0])
          return selectedOption?.label || filter.value[0]
        }
        return `${filter.activeCount} selected`
      
      case 'search':
        return filter.value || filter.placeholder
      
      default:
        return filter.placeholder
    }
  }, [filters])

  // Filter management
  const addFilter = useCallback((newFilter: Omit<FilterState, 'isActive' | 'activeCount'>) => {
    const filterWithState: FilterState = {
      ...newFilter,
      isActive: determineActiveState(newFilter as FilterState),
      activeCount: getActiveCount(newFilter as FilterState)
    }
    
    updateFilters([...filters, filterWithState])
  }, [filters, updateFilters])

  const removeFilter = useCallback((filterId: string) => {
    const newFilters = filters.filter(filter => filter.id !== filterId)
    updateFilters(newFilters)
  }, [filters, updateFilters])

  const updateFilter = useCallback((filterId: string, updates: Partial<FilterState>) => {
    const newFilters = filters.map(filter => {
      if (filter.id === filterId) {
        const updatedFilter = { ...filter, ...updates }
        return {
          ...updatedFilter,
          isActive: determineActiveState(updatedFilter),
          activeCount: getActiveCount(updatedFilter)
        }
      }
      return filter
    })
    
    updateFilters(newFilters)
  }, [filters, updateFilters])

  return {
    // State
    filters,
    activeFilters,
    hasActiveFilters,
    
    // Actions
    setFilterValue,
    clearFilter,
    clearAllFilters,
    resetFilters,
    
    // Queries
    isFilterActive,
    getActiveFilterCount,
    getFilterDisplayValue,
    
    // Management
    addFilter,
    removeFilter,
    updateFilter
  }
}