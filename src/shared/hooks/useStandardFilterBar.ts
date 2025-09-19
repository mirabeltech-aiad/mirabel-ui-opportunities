import { useState, useMemo } from 'react'

export interface FilterOption {
  value: string
  label: string
}

export interface FilterDefinition {
  id: string
  placeholder: string
  options: FilterOption[]
  type?: 'select' | 'multi-select'
}

export interface FilterBarConfig {
  data: any[]
  searchFields: string[]
  filters: FilterDefinition[]
  initialFilters?: Record<string, any>
}

export const useStandardFilterBar = (config: FilterBarConfig) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState(() => {
    const initial: Record<string, any> = {}
    // Safety check to prevent forEach on undefined
    if (config.filters && Array.isArray(config.filters)) {
      config.filters.forEach(filter => {
        initial[filter.id] = config.initialFilters?.[filter.id] || 'all'
      })
    }
    return initial
  })

  const handleFilterChange = (key: string, value: any) => {
    if (key === 'search') {
      setSearchTerm(value)
    } else {
      setFilters(prev => ({ ...prev, [key]: value }))
    }
  }

  const filteredData = useMemo(() => {
    let filtered = config.data

    // Apply search filter
    if (searchTerm && config.searchFields.length > 0) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(item => 
        config.searchFields.some(field => {
          const fieldValue = item[field]
          return fieldValue && String(fieldValue).toLowerCase().includes(searchLower)
        })
      )
    }

    // Apply other filters
    Object.entries(filters).forEach(([filterId, filterValue]) => {
      if (filterValue && filterValue !== 'all' && filterValue !== '') {
        // For now, do simple string matching - can be enhanced later
        filtered = filtered.filter(item => {
          const itemValue = item[filterId]
          if (Array.isArray(filterValue)) {
            return filterValue.includes(itemValue)
          }
          // For schedule-specific logic, check if the filter value appears in relevant fields
          if (filterId === 'frequency') {
            return item.schedule?.toLowerCase().includes(filterValue.toLowerCase())
          }
          if (filterId === 'productType') {
            return item.description?.toLowerCase().includes(filterValue.toLowerCase())
          }
          if (filterId === 'status') {
            // Mock status logic based on your existing implementation
            const now = new Date()
            const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            const createdDate = new Date(item.createdAt)
            
            switch (filterValue) {
              case 'active':
                return createdDate > thirtyDaysAgo
              case 'draft':
                return item.itemCount === 0
              case 'completed':
                return item.itemCount > 0 && createdDate <= thirtyDaysAgo
              case 'archived':
                return createdDate < new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
              default:
                return true
            }
          }
          return String(itemValue).toLowerCase() === String(filterValue).toLowerCase()
        })
      }
    })

    return filtered
  }, [config.data, searchTerm, filters, config.searchFields])

  const hasActiveFilters = searchTerm !== '' || 
    Object.values(filters).some(value => value !== 'all' && value !== '')

  const resetFilters = () => {
    setSearchTerm('')
    const resetFilters: Record<string, any> = {}
    // Safety check to prevent forEach on undefined
    if (config.filters && Array.isArray(config.filters)) {
      config.filters.forEach(filter => {
        resetFilters[filter.id] = 'all'
      })
    }
    setFilters(resetFilters)
  }

  const filterBarProps = {
    searchQuery: searchTerm,
    onSearch: (query: string) => handleFilterChange('search', query),
    filters: (config.filters && Array.isArray(config.filters) ? config.filters : []).map(filter => ({
      ...filter,
      value: filters[filter.id] || 'all',
      onChange: (value: any) => handleFilterChange(filter.id, value)
    })),
    hasActiveFilters,
    onResetFilters: resetFilters
  }

  return {
    searchTerm,
    filters,
    filteredData,
    hasActiveFilters,
    handleFilterChange,
    resetFilters,
    filterBarProps
  }
}