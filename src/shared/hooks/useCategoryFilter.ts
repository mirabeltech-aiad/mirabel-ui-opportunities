import { useState, useMemo, useCallback } from 'react'
import { analyzeCategoriesFromColumns, CategoryInfo, groupCategories, filterCategories } from '../utils/categoryUtils'

export interface UseCategoryFilterOptions<T> {
  items: T[]
  categoryField: keyof T
  enableGrouping?: boolean
  defaultCategory?: string
}

export interface UseCategoryFilterReturn {
  categories: CategoryInfo[]
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  categoryGroups: any[]
  filteredCategories: CategoryInfo[]
  searchCategories: (searchTerm: string) => void
  clearCategorySearch: () => void
  categorySearchTerm: string
  getCategoryInfo: (categoryKey: string) => CategoryInfo | undefined
  resetToDefault: () => void
}

export function useCategoryFilter<T extends Record<string, any>>({
  items,
  categoryField,
  enableGrouping = false,
  defaultCategory = 'all'
}: UseCategoryFilterOptions<T>): UseCategoryFilterReturn {
  const [selectedCategory, setSelectedCategoryState] = useState(defaultCategory)
  const [categorySearchTerm, setCategorySearchTerm] = useState('')
  
  // Analyze categories from items
  const categories = useMemo(() => {
    const analyzed = analyzeCategoriesFromColumns(
      items.map(item => ({ category: item[categoryField] as string }))
    )
    
    // Add "All" category
    const allCategory: CategoryInfo = {
      key: 'all',
      label: 'All Categories',
      columnCount: items.length,
      priority: 1000
    }
    
    return [allCategory, ...analyzed]
  }, [items, categoryField])
  
  // Group categories if enabled
  const categoryGroups = useMemo(() => {
    if (!enableGrouping) return []
    
    const nonAllCategories = categories.filter(cat => cat.key !== 'all')
    return groupCategories(nonAllCategories)
  }, [categories, enableGrouping])
  
  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    return filterCategories(categories, categorySearchTerm)
  }, [categories, categorySearchTerm])
  
  // Set selected category
  const setSelectedCategory = useCallback((category: string) => {
    setSelectedCategoryState(category)
  }, [])
  
  // Search categories
  const searchCategories = useCallback((searchTerm: string) => {
    setCategorySearchTerm(searchTerm)
  }, [])
  
  // Clear category search
  const clearCategorySearch = useCallback(() => {
    setCategorySearchTerm('')
  }, [])
  
  // Get category info by key
  const getCategoryInfo = useCallback((categoryKey: string) => {
    return categories.find(cat => cat.key === categoryKey)
  }, [categories])
  
  // Reset to default
  const resetToDefault = useCallback(() => {
    setSelectedCategoryState(defaultCategory)
    setCategorySearchTerm('')
  }, [defaultCategory])
  
  return {
    categories,
    selectedCategory,
    setSelectedCategory,
    categoryGroups,
    filteredCategories,
    searchCategories,
    clearCategorySearch,
    categorySearchTerm,
    getCategoryInfo,
    resetToDefault
  }
}