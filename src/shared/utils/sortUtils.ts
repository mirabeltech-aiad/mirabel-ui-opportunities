import { SortConfig, SortPreset } from '../types/sortPresets'
import { ComparableValue, UnknownRecord } from '../types/utility'

export const applySortToData = <T extends Record<string, any>>(
  data: T[],
  sortConfigs: SortConfig[]
): T[] => {
  if (!sortConfigs.length) return data

  return [...data].sort((a, b) => {
    for (const config of sortConfigs) {
      const aValue = getNestedValue(a, config.field) as ComparableValue
      const bValue = getNestedValue(b, config.field) as ComparableValue
      
      const comparison = compareValues(aValue, bValue)
      
      if (comparison !== 0) {
        return config.direction === 'asc' ? comparison : -comparison
      }
    }
    return 0
  })
}

const getNestedValue = <T extends UnknownRecord>(obj: T, path: string): unknown => {
  return path.split('.').reduce((current: unknown, key) => {
    return current && typeof current === 'object' && key in current 
      ? (current as Record<string, unknown>)[key] 
      : undefined
  }, obj)
}

const compareValues = (a: ComparableValue, b: ComparableValue): number => {
  // Handle null/undefined values
  if (a == null && b == null) return 0
  if (a == null) return -1
  if (b == null) return 1
  
  // Handle dates
  if (isDate(a) && isDate(b)) {
    return new Date(a).getTime() - new Date(b).getTime()
  }
  
  // Handle numbers
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b
  }
  
  // Handle strings (case-insensitive)
  const aStr = String(a).toLowerCase()
  const bStr = String(b).toLowerCase()
  
  return aStr.localeCompare(bStr)
}

const isDate = (value: unknown): value is Date => {
  if (value instanceof Date) return true
  if (typeof value === 'string') {
    const date = new Date(value)
    return !isNaN(date.getTime())
  }
  return false
}

// Preset management utilities
export const convertPresetToSortConfig = (presetId: string | null): SortConfig[] => {
  if (!presetId || presetId === 'default') return []
  
  const { SORT_PRESETS } = require('../types/sortPresets')
  const preset = (SORT_PRESETS as SortPreset[]).find((p) => p.id === presetId)
  
  return preset ? preset.sortConfig : []
}

export const isCustomSort = (
  currentSort: SortConfig[],
  activePresetId: string | null
): boolean => {
  if (!activePresetId || activePresetId === 'default') {
    return currentSort.length > 0
  }
  
  const presetSort = convertPresetToSortConfig(activePresetId)
  
  // Compare current sort with preset sort
  if (currentSort.length !== presetSort.length) return true
  
  return currentSort.some((config, index) => {
    const presetConfig = presetSort[index]
    return !presetConfig || 
           config.field !== presetConfig.field || 
           config.direction !== presetConfig.direction
  })
}

export const shouldClearPreset = (
  columnSort: SortConfig[],
  activePresetId: string | null
): boolean => {
  if (!activePresetId || activePresetId === 'default') return false
  
  return isCustomSort(columnSort, activePresetId)
}

// State management helper
export const createSortState = () => {
  return {
    activePresetId: null as string | null,
    customSort: [] as SortConfig[],
    
    setPreset: function(presetId: string | null) {
      this.activePresetId = presetId
      this.customSort = []
    },
    
    setCustomSort: function(sortConfig: SortConfig[]) {
      this.customSort = sortConfig
      if (shouldClearPreset(sortConfig, this.activePresetId)) {
        this.activePresetId = null
      }
    },
    
    getCurrentSort: function(): SortConfig[] {
      if (this.customSort.length > 0) {
        return this.customSort
      }
      return convertPresetToSortConfig(this.activePresetId)
    },
    
    reset: function() {
      this.activePresetId = null
      this.customSort = []
    }
  }
}

export type SortState = ReturnType<typeof createSortState>

// Enhanced error handling and validation
export const validateSortConfig = (sortConfig: SortConfig[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!Array.isArray(sortConfig)) {
    errors.push('Sort configuration must be an array')
    return { isValid: false, errors }
  }
  
  sortConfig.forEach((config, index) => {
    if (!config || typeof config !== 'object') {
      errors.push(`Sort config at index ${index} must be an object`)
      return
    }
    
    if (!config.field || typeof config.field !== 'string') {
      errors.push(`Sort config at index ${index} must have a valid field name`)
    }
    
    if (!config.direction || !['asc', 'desc'].includes(config.direction)) {
      errors.push(`Sort config at index ${index} must have direction 'asc' or 'desc'`)
    }
  })
  
  return { isValid: errors.length === 0, errors }
}

export const safeApplySortToData = <T extends Record<string, any>>(
  data: T[],
  sortConfigs: SortConfig[]
): { data: T[]; errors: string[] } => {
  const errors: string[] = []
  
  // Validate input data
  if (!Array.isArray(data)) {
    errors.push('Data must be an array')
    return { data: [], errors }
  }
  
  if (data.length === 0) {
    return { data: [], errors }
  }
  
  // Validate sort configuration
  const validation = validateSortConfig(sortConfigs)
  if (!validation.isValid) {
    errors.push(...validation.errors)
    return { data, errors }
  }
  
  try {
    const sortedData = applySortToData(data, sortConfigs)
    return { data: sortedData, errors }
  } catch (error) {
    errors.push(`Sorting failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return { data, errors }
  }
}

// Enhanced field validation
export const validateSortField = <T extends Record<string, any>>(
  data: T[],
  field: string
): { isValid: boolean; error?: string } => {
  if (!field || typeof field !== 'string') {
    return { isValid: false, error: 'Field name must be a non-empty string' }
  }
  
  if (data.length === 0) {
    return { isValid: true } // Can't validate against empty data
  }
  
  // Check if field exists in at least some records
  const hasField = data.some(item => {
    const value = getNestedValue(item, field)
    return value !== undefined
  })
  
  if (!hasField) {
    return { isValid: false, error: `Field '${field}' not found in data` }
  }
  
  return { isValid: true }
}

// Filter interaction helpers
export const combineSortWithFilters = <T extends Record<string, any>>(
  data: T[],
  sortConfigs: SortConfig[],
  filterFn?: (item: T) => boolean
): { data: T[]; errors: string[] } => {
  const errors: string[] = []
  
  try {
    // Apply filters first
    let filteredData = data
    if (filterFn) {
      filteredData = data.filter(filterFn)
    }
    
    // Then apply sorting
    const sortResult = safeApplySortToData(filteredData, sortConfigs)
    errors.push(...sortResult.errors)
    
    return { data: sortResult.data, errors }
  } catch (error) {
    errors.push(`Combined sort and filter failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return { data, errors }
  }
}

// Performance optimization for large datasets
export const shouldUseMemoizedSort = (dataLength: number, sortConfigLength: number): boolean => {
  // Use memoization for large datasets or complex sorts
  return dataLength > 1000 || sortConfigLength > 2
}

// Graceful degradation helpers
export const createFallbackSort = (primaryField: string): SortConfig[] => {
  return [
    { field: primaryField, direction: 'asc' },
    { field: 'id', direction: 'asc' } // Fallback to ID for consistent ordering
  ]
}

export const getAvailableSortFields = <T extends Record<string, any>>(
  data: T[],
  excludeFields: string[] = []
): string[] => {
  if (data.length === 0) return []
  
  const fields = new Set<string>()
  
  data.forEach(item => {
    Object.keys(item).forEach(key => {
      if (!excludeFields.includes(key) && item[key] !== undefined) {
        fields.add(key)
      }
    })
  })
  
  return Array.from(fields).sort()
}