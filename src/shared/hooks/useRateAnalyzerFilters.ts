import { useState, useMemo, useCallback } from 'react'

// Types for Rate Analyzer filters
export interface RateAnalyzerFilters {
  search: string
  rateCardGroup: string
  userSizeRange: string
  revenueRange: string
  increaseTarget: string
}

export interface FilterOption {
  value: string
  label: string
}

export interface RateAnalyzerFilterDefinition {
  id: keyof RateAnalyzerFilters
  placeholder: string
  options: FilterOption[]
  type: 'select' | 'multi-select'
}

// Default filter options
export const RATE_CARD_GROUP_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'All Rate Cards' },
  { value: 'Standard', label: 'Standard' },
  { value: 'Startup', label: 'Startup' },
  { value: 'Enterprise', label: 'Enterprise' },
  { value: 'Premium', label: 'Premium' },
  { value: 'Custom', label: 'Custom' }
]

export const USER_SIZE_RANGE_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'All User Sizes' },
  { value: '1-10', label: '1-10 Users' },
  { value: '11-50', label: '11-50 Users' },
  { value: '51-100', label: '51-100 Users' },
  { value: '101-500', label: '101-500 Users' },
  { value: '500+', label: '500+ Users' }
]

export const REVENUE_RANGE_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'All Revenue Ranges' },
  { value: '0-5000', label: '$0 - $5,000' },
  { value: '5001-15000', label: '$5,001 - $15,000' },
  { value: '15001-30000', label: '$15,001 - $30,000' },
  { value: '30001-50000', label: '$30,001 - $50,000' },
  { value: '50000+', label: '$50,000+' }
]

export const INCREASE_TARGET_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'All Targets' },
  { value: 'below-target', label: 'Below Target' },
  { value: 'at-target', label: 'At Target' },
  { value: 'above-target', label: 'Above Target' },
  { value: 'high-impact', label: 'High Impact (20%+)' }
]

// Filter definitions
export const RATE_ANALYZER_FILTER_DEFINITIONS: RateAnalyzerFilterDefinition[] = [
  {
    id: 'rateCardGroup',
    placeholder: 'Rate Card Group',
    options: RATE_CARD_GROUP_OPTIONS,
    type: 'select'
  },
  {
    id: 'userSizeRange',
    placeholder: 'User Size',
    options: USER_SIZE_RANGE_OPTIONS,
    type: 'select'
  },
  {
    id: 'revenueRange',
    placeholder: 'Revenue Range',
    options: REVENUE_RANGE_OPTIONS,
    type: 'select'
  },
  {
    id: 'increaseTarget',
    placeholder: 'Increase Target',
    options: INCREASE_TARGET_OPTIONS,
    type: 'select'
  }
]

interface UseRateAnalyzerFiltersProps {
  data: any[]
  targetOverallIncrease?: number
}

export const useRateAnalyzerFilters = ({ data, targetOverallIncrease = 15 }: UseRateAnalyzerFiltersProps) => {
  // Filter state
  const [filters, setFilters] = useState<RateAnalyzerFilters>({
    search: '',
    rateCardGroup: 'all',
    userSizeRange: 'all',
    revenueRange: 'all',
    increaseTarget: 'all'
  })

  // Update individual filter
  const updateFilter = useCallback((filterId: keyof RateAnalyzerFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterId]: value
    }))
  }, [])

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      rateCardGroup: 'all',
      userSizeRange: 'all',
      revenueRange: 'all',
      increaseTarget: 'all'
    })
  }, [])

  // Check if filters are active
  const hasActiveFilters = useMemo(() => {
    return filters.search !== '' ||
           filters.rateCardGroup !== 'all' ||
           filters.userSizeRange !== 'all' ||
           filters.revenueRange !== 'all' ||
           filters.increaseTarget !== 'all'
  }, [filters])

  // Helper function to check user size range
  const isInUserSizeRange = useCallback((userCount: number, range: string): boolean => {
    switch (range) {
      case '1-10':
        return userCount >= 1 && userCount <= 10
      case '11-50':
        return userCount >= 11 && userCount <= 50
      case '51-100':
        return userCount >= 51 && userCount <= 100
      case '101-500':
        return userCount >= 101 && userCount <= 500
      case '500+':
        return userCount > 500
      default:
        return true
    }
  }, [])

  // Helper function to check revenue range
  const isInRevenueRange = useCallback((revenue: number, range: string): boolean => {
    switch (range) {
      case '0-5000':
        return revenue >= 0 && revenue <= 5000
      case '5001-15000':
        return revenue >= 5001 && revenue <= 15000
      case '15001-30000':
        return revenue >= 15001 && revenue <= 30000
      case '30001-50000':
        return revenue >= 30001 && revenue <= 50000
      case '50000+':
        return revenue > 50000
      default:
        return true
    }
  }, [])

  // Helper function to check increase target
  const meetsIncreaseTarget = useCallback((increasePercent: number, target: string): boolean => {
    switch (target) {
      case 'below-target':
        return increasePercent < targetOverallIncrease
      case 'at-target':
        return Math.abs(increasePercent - targetOverallIncrease) <= 2 // Within 2% of target
      case 'above-target':
        return increasePercent > targetOverallIncrease
      case 'high-impact':
        return increasePercent >= 20
      default:
        return true
    }
  }, [targetOverallIncrease])

  // Apply filters to data
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return []

    return data.filter(item => {
      // Search filter - check multiple fields
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        const searchableFields = [
          item.clientName,
          item.rateCardGroup,
          item.suggestedRateCard
        ].filter(Boolean)

        const matchesSearch = searchableFields.some(field => 
          String(field).toLowerCase().includes(searchTerm)
        )
        if (!matchesSearch) return false
      }

      // Rate card group filter
      if (filters.rateCardGroup !== 'all') {
        if (item.rateCardGroup !== filters.rateCardGroup) return false
      }

      // User size range filter
      if (filters.userSizeRange !== 'all') {
        if (!isInUserSizeRange(item.userCount, filters.userSizeRange)) return false
      }

      // Revenue range filter
      if (filters.revenueRange !== 'all') {
        const revenue = item.currentMonthlyRevenue || item.avgCurrentRevenue || 0
        if (!isInRevenueRange(revenue, filters.revenueRange)) return false
      }

      // Increase target filter
      if (filters.increaseTarget !== 'all') {
        const increasePercent = item.totalIncreasePercent || item.avgTotalIncreasePercent || 0
        if (!meetsIncreaseTarget(increasePercent, filters.increaseTarget)) return false
      }

      return true
    })
  }, [data, filters, isInUserSizeRange, isInRevenueRange, meetsIncreaseTarget])

  // Get filter display values
  const getFilterDisplayValue = useCallback((filterId: keyof RateAnalyzerFilters): string => {
    const filterDef = RATE_ANALYZER_FILTER_DEFINITIONS.find(f => f.id === filterId)
    const value = filters[filterId]
    
    if (!filterDef || value === 'all') return filterDef?.placeholder || 'Select...'
    
    const option = filterDef.options.find(opt => opt.value === value)
    return option?.label || value
  }, [filters])

  // Get active filter count
  const getActiveFilterCount = useCallback((filterId: keyof RateAnalyzerFilters): number => {
    const value = filters[filterId]
    return (value && value !== 'all') ? 1 : 0
  }, [filters])

  // Filter bar props for easy integration
  const rateAnalyzerFilterProps = useMemo(() => ({
    searchQuery: filters.search,
    onSearch: (query: string) => updateFilter('search', query),
    filters: RATE_ANALYZER_FILTER_DEFINITIONS.map(filterDef => ({
      id: filterDef.id,
      placeholder: filterDef.placeholder,
      options: filterDef.options,
      type: filterDef.type,
      value: filters[filterDef.id],
      hasSelection: filters[filterDef.id] !== 'all',
      selectionCount: getActiveFilterCount(filterDef.id),
      displayValue: getFilterDisplayValue(filterDef.id),
      onChange: (value: string) => updateFilter(filterDef.id, value)
    })),
    hasActiveFilters,
    onResetFilters: resetFilters,
    activeFilterCount: Object.values(filters).filter(value => value !== 'all' && value !== '').length
  }), [filters, hasActiveFilters, updateFilter, resetFilters, getActiveFilterCount, getFilterDisplayValue])

  return {
    filters,
    filteredData,
    hasActiveFilters,
    updateFilter,
    resetFilters,
    rateAnalyzerFilterProps,
    getFilterDisplayValue,
    getActiveFilterCount
  }
}