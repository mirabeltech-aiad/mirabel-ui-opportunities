import React, { useState, useRef, useEffect } from 'react'
import { Button } from './button'
import { Badge } from './badge'
import { FloatingLabelSearchInput } from './FloatingLabelSearchInput'
import { Filter, ChevronDown, X, Star, Lock, TrendingUp, Search, RotateCcw } from 'lucide-react'
import { FilterResetButton } from './ResetButton'
import { Tooltip } from './tooltip'
import { getTooltip } from '@/shared/constants/tooltips'

// Add CSS keyframes for dropdown animations
const dropdownStyles = `
  @keyframes dropdownOpen {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-4px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  
  @keyframes dropdownClose {
    from {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    to {
      opacity: 0;
      transform: scale(0.95) translateY(-4px);
    }
  }
`

// Types from ColumnSelector
export interface FilterConfig {
  id: string
  type: 'category' | 'dataType' | 'usage' | 'custom' | 'search'
  label: string
  value: any
  operator: 'equals' | 'contains' | 'in' | 'range' | 'exists'
  active: boolean
  removable?: boolean
  description?: string
}

export interface CategoryInfo {
  key: string
  label: string
  columnCount: number
  color?: string
}

export interface FilterSummary {
  totalActive: number
  byType: Record<string, number>
}

export interface FilterDropdownProps {
  // Filter state from existing hooks
  hasActiveFilters: boolean
  filterSummary: FilterSummary
  activeFilters: FilterConfig[]
  
  // Category state from existing hooks
  categoryInfos: CategoryInfo[]
  selectedCategory: string
  categorySearchTerm: string
  filteredCategories: CategoryInfo[]
  
  // Filter operations
  addFilter: (filter: FilterConfig) => void
  removeFilter: (filterId: string) => void
  clearAllFilters: () => void
  addUsageFilter: (importance: string) => void
  addCategoryFilter: (category: string) => void
  
  // Category operations
  handleCategoryChange: (category: string) => void
  searchCategories: (term: string) => void
  clearCategorySearch: () => void
  
  // Configuration
  canAddMoreFilters: boolean
  enableCategorization: boolean
}

interface FilterDropdownState {
  isOpen: boolean
  activeSection?: 'active' | 'quick' | 'category'
}

interface DropdownSection {
  id: string
  title: string
  visible: boolean
  content: React.ReactNode
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  hasActiveFilters,
  filterSummary,
  activeFilters,
  categoryInfos,
  selectedCategory,
  categorySearchTerm,
  filteredCategories,
  addFilter,
  removeFilter,
  clearAllFilters,
  addUsageFilter,
  addCategoryFilter,
  handleCategoryChange,
  searchCategories,
  clearCategorySearch,
  canAddMoreFilters,
  enableCategorization
}) => {
  const [state, setState] = useState<FilterDropdownState>({
    isOpen: false,
    activeSection: undefined
  })
  
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setState(prev => ({ ...prev, isOpen: false }))
      }
    }

    if (state.isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [state.isOpen])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!state.isOpen) return

      switch (event.key) {
        case 'Escape':
          event.preventDefault()
          setState(prev => ({ ...prev, isOpen: false }))
          triggerRef.current?.focus()
          break
        
        case 'Tab':
          // Allow normal tab navigation within dropdown
          // The dropdown will close when focus leaves the dropdown area
          break
        
        case 'Enter':
        case ' ':
          // Prevent default space/enter behavior when dropdown is open
          // Let individual buttons handle their own enter/space events
          break
        
        default:
          break
      }
    }

    if (state.isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [state.isOpen])

  const toggleDropdown = () => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }))
  }

  const closeDropdown = () => {
    setState(prev => ({ ...prev, isOpen: false }))
  }

  // Generate tooltip text based on filter status
  const getTooltipText = () => {
    if (!hasActiveFilters) {
      return 'Filter columns'
    }
    
    const filterTypes = Object.keys(filterSummary.byType).filter(type => filterSummary.byType[type] > 0)
    if (filterTypes.length === 1) {
      return `${filterSummary.totalActive} ${filterTypes[0]} filter${filterSummary.totalActive > 1 ? 's' : ''} active`
    }
    
    return `${filterSummary.totalActive} filters active (${filterTypes.join(', ')})`
  }

  // Generate compact filter summary for display below button
  const getFilterSummary = () => {
    if (!hasActiveFilters) return null
    
    const summaryParts = []
    if (filterSummary.byType.category) {
      summaryParts.push(`${filterSummary.byType.category} category`)
    }
    if (filterSummary.byType.usage) {
      summaryParts.push(`${filterSummary.byType.usage} usage`)
    }
    if (filterSummary.byType.custom) {
      summaryParts.push(`${filterSummary.byType.custom} custom`)
    }
    if (filterSummary.byType.dataType) {
      summaryParts.push(`${filterSummary.byType.dataType} type`)
    }
    
    return summaryParts.join(', ')
  }

  // Format filter for display
  const formatFilterForDisplay = (filter: FilterConfig): string => {
    switch (filter.type) {
      case 'category':
        return `Category: ${filter.value}`
      case 'dataType':
        return `Type: ${filter.value}`
      case 'usage':
        return `Usage: ${filter.value}`
      case 'custom':
        return filter.label || `Custom: ${filter.value}`
      default:
        return filter.label || `${filter.type}: ${filter.value}`
    }
  }

  // Get filter badge color based on type
  const getFilterBadgeColor = (filter: FilterConfig): string => {
    switch (filter.type) {
      case 'category':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'dataType':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'usage':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'custom':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Define dropdown sections based on current state
  const getDropdownSections = (): DropdownSection[] => {
    const sections: DropdownSection[] = []

    // Active Filters Section
    if (hasActiveFilters) {
      sections.push({
        id: 'active',
        title: 'Active Filters',
        visible: true,
        content: (
          <div className="space-y-3">
            {/* Active Filter Badges */}
            <div className="flex flex-wrap gap-2">
              {activeFilters.map(filter => (
                <div
                  key={filter.id}
                  className={`
                    flex items-center gap-1 px-2 py-1 rounded-md text-xs border
                    ${getFilterBadgeColor(filter)}
                  `}
                >
                  <span className="font-medium">
                    {formatFilterForDisplay(filter)}
                  </span>
                  {filter.removable !== false && (
                    <Tooltip content={getTooltip('FILTER_DROPDOWN.ACTIVE_FILTER_BADGE')}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-black/10 rounded-full transition-all duration-150 hover:scale-110"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeFilter(filter.id)
                        }}
                        aria-label={`Remove ${formatFilterForDisplay(filter)} filter`}
                      >
                        <X className="close-button-sm" aria-hidden="true" />
                      </Button>
                    </Tooltip>
                  )}
                </div>
              ))}
            </div>

            {/* Clear All Button */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                {filterSummary.totalActive} filter{filterSummary.totalActive > 1 ? 's' : ''} active
              </span>
              <FilterResetButton
                onReset={() => {
                  clearAllFilters()
                }}
                hasActiveItems={hasActiveFilters}
                variant="minimal"
                size="sm"
                showCount={true}
                activeCount={filterSummary.totalActive}
                className="h-6 text-xs px-2"
              />
            </div>
          </div>
        )
      })
    }

    // Quick Filters Section
    if (!hasActiveFilters && canAddMoreFilters) {
      // Find the most common category (excluding 'all')
      const mostCommonCategory = categoryInfos
        .filter(cat => cat.key !== 'all')
        .sort((a, b) => b.columnCount - a.columnCount)[0]

      sections.push({
        id: 'quick',
        title: 'Quick Filters',
        visible: true,
        content: (
          <div className="space-y-3">
            <p className="text-xs text-gray-500 mb-3">
              Apply common filters quickly
            </p>
            
            <div className="grid grid-cols-1 gap-2">
              {/* High Importance Filter */}
              <Tooltip content={getTooltip('FILTER_DROPDOWN.QUICK_FILTERS.HIGH_IMPORTANCE')}>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 justify-start text-xs px-3 hover:bg-orange-50 hover:border-orange-200 transition-all duration-150 hover:shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    addUsageFilter('high')
                  }}
                  aria-label="Filter to show only high importance columns"
                >
                  <Star className="h-3 w-3 mr-2 text-orange-500" aria-hidden="true" />
                  High Importance
                </Button>
              </Tooltip>

              {/* Required Only Filter */}
              <Tooltip content={getTooltip('FILTER_DROPDOWN.QUICK_FILTERS.REQUIRED_ONLY')}>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 justify-start text-xs px-3 hover:bg-red-50 hover:border-red-200 transition-all duration-150 hover:shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    addFilter({
                      id: 'required-only',
                      type: 'custom',
                      label: 'Required Only',
                      value: true,
                      operator: 'equals',
                      active: true,
                      removable: true
                    })
                  }}
                  aria-label="Filter to show only required columns"
                >
                  <Lock className="h-3 w-3 mr-2 text-red-500" aria-hidden="true" />
                  Required Only
                </Button>
              </Tooltip>

              {/* Most Used Category Filter */}
              {selectedCategory === 'all' && mostCommonCategory && (
                <Tooltip content={getTooltip('FILTER_DROPDOWN.QUICK_FILTERS.MOST_USED_CATEGORY')}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 justify-start text-xs px-3 hover:bg-purple-50 hover:border-purple-200 transition-all duration-150 hover:shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      addCategoryFilter(mostCommonCategory.key)
                    }}
                    aria-label={`Filter to show only ${mostCommonCategory.label} category with ${mostCommonCategory.columnCount} columns`}
                  >
                    <TrendingUp className="h-3 w-3 mr-2 text-purple-500" aria-hidden="true" />
                    Most Used Category
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {mostCommonCategory.columnCount}
                    </Badge>
                  </Button>
                </Tooltip>
              )}
            </div>

            {/* Quick Filter Info */}
            <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
              These filters help you quickly find commonly used columns
            </div>
          </div>
        )
      })
    }

    // Category Filters Section
    if (enableCategorization && categoryInfos.length > 1) {
      // Get categories to display (filtered or all)
      const categoriesToShow = filteredCategories.length > 0 ? filteredCategories : categoryInfos
      const nonAllCategories = categoriesToShow.filter(cat => cat.key !== 'all')
      
      sections.push({
        id: 'category',
        title: 'Category Filters',
        visible: true,
        content: (
          <div className="space-y-3">
            {/* Category Search Input (show when many categories) */}
            {categoryInfos.length > 6 && (
              <div className="relative">
                <Tooltip content={getTooltip('FILTER_DROPDOWN.CATEGORY_SEARCH')}>
                  <FloatingLabelSearchInput
                    label="Search Categories"
                    value={categorySearchTerm}
                    onChange={(value) => {
                      searchCategories(value)
                    }}
                    placeholder="Search categories..."
                    className="text-xs"
                    modal={true}  // Use compact 36px height for dropdown
                    onClick={(e) => e.stopPropagation()}
                  />
                </Tooltip>
                {categorySearchTerm && (
                  <Tooltip content="Clear category search">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-5 w-5 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        clearCategorySearch()
                      }}
                      aria-label="Clear category search"
                    >
                      <X className="close-button-sm" aria-hidden="true" />
                    </Button>
                  </Tooltip>
                )}
              </div>
            )}

            {/* Selected Category Status */}
            {selectedCategory !== 'all' && (
              <div className="flex items-center justify-between p-2 bg-purple-50 border border-purple-200 rounded-md">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">
                    Current: {categoryInfos.find(cat => cat.key === selectedCategory)?.label || selectedCategory}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs px-2 text-purple-600 hover:text-purple-700 hover:bg-purple-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCategoryChange('all')
                  }}
                  title="Show all categories"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Show All
                </Button>
              </div>
            )}

            {/* Category Filter Buttons */}
            {nonAllCategories.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-gray-500">
                  Filter by category ({nonAllCategories.length} available)
                </p>
                
                <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto">
                  {nonAllCategories.map(category => {
                    const isSelected = selectedCategory === category.key
                    
                    return (
                      <Button
                        key={category.key}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        className={`
                          h-7 justify-between text-xs px-2 transition-all duration-150
                          ${isSelected 
                            ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm' 
                            : 'hover:bg-purple-50 hover:border-purple-200 hover:shadow-sm'
                          }
                        `}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (isSelected) {
                            handleCategoryChange('all')
                          } else {
                            addCategoryFilter(category.key)
                          }
                        }}
                        title={`${isSelected ? 'Remove' : 'Apply'} ${category.label} category filter`}
                        aria-label={`${isSelected ? 'Remove' : 'Apply'} ${category.label} category filter. ${category.columnCount} columns available.`}
                        aria-pressed={isSelected}
                      >
                        <span className="truncate">{category.label}</span>
                        <Badge 
                          variant={isSelected ? "secondary" : "outline"} 
                          className={`
                            ml-2 text-xs h-4 px-1
                            ${isSelected 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'border-gray-300 text-gray-600'
                            }
                          `}
                        >
                          {category.columnCount}
                        </Badge>
                      </Button>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-gray-500">
                  {categorySearchTerm ? 'No categories match your search' : 'No categories available'}
                </p>
                {categorySearchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs px-2 mt-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      clearCategorySearch()
                    }}
                  >
                    Clear search
                  </Button>
                )}
              </div>
            )}

            {/* Category Filter Info */}
            <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
              Categories help organize columns by their purpose or data source
            </div>
          </div>
        )
      })
    }

    return sections
  }

  const sections = getDropdownSections()
  const visibleSections = sections.filter(section => section.visible)

  return (
    <div className="space-y-2">
      <div className="relative">
        {/* Dropdown Trigger Button */}
        <Tooltip content={getTooltip('FILTER_DROPDOWN.TRIGGER')}>
          <Button
            ref={triggerRef}
            variant="outline"
            size="sm"
            className={`
              h-8 px-3 flex items-center gap-2 transition-all duration-200 relative
              ${hasActiveFilters 
                ? 'border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 shadow-sm' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }
              ${state.isOpen ? 'ring-2 ring-blue-300 ring-opacity-50' : ''}
            `}
            onClick={toggleDropdown}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                toggleDropdown()
              }
            }}
            aria-expanded={state.isOpen}
            aria-haspopup="true"
            aria-label={`Filter columns dropdown. ${hasActiveFilters ? `${filterSummary.totalActive} filters active` : 'No filters active'}`}
          >
          <Filter className={`h-4 w-4 ${hasActiveFilters ? 'text-blue-600' : 'text-gray-500'}`} />
          <span className="text-sm font-medium">Filters</span>
          {hasActiveFilters && (
            <Badge 
              variant="default" 
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center"
            >
              {filterSummary.totalActive}
            </Badge>
          )}
          <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${state.isOpen ? 'rotate-180' : ''} ${hasActiveFilters ? 'text-blue-600' : 'text-gray-400'}`} />
        </Button>
        </Tooltip>

        {/* Dropdown Content */}
        {state.isOpen && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            role="menu"
            aria-label="Filter options"
            tabIndex={-1}
            style={{
              transformOrigin: 'top left',
              animation: state.isOpen ? 'dropdownOpen 200ms ease-out' : 'dropdownClose 150ms ease-in'
            }}
          >
            {visibleSections.length > 0 ? (
              <div className="py-2">
                {visibleSections.map((section, index) => (
                  <div key={section.id}>
                    {/* Section Header */}
                    <div className="px-3 py-2" role="group" aria-labelledby={`filter-section-${section.id}`}>
                      <h3 
                        id={`filter-section-${section.id}`}
                        className="text-sm font-medium text-gray-700 mb-2"
                      >
                        {section.title}
                      </h3>
                      {/* Section Content */}
                      <div className="space-y-2">
                        {section.content}
                      </div>
                    </div>
                    
                    {/* Section Separator */}
                    {index < visibleSections.length - 1 && (
                      <div className="mx-3 my-2 border-t border-gray-200" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                No filters available
              </div>
            )}
          </div>
        )}
      </div>

      {/* Compact Filter Summary */}
      {hasActiveFilters && (
        <div className="text-xs text-gray-600 px-1">
          <span className="font-medium">Active:</span> {getFilterSummary()}
        </div>
      )}
    </div>
  )
}