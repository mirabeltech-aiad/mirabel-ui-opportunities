import { logger } from '../../utils/logger'

import { FC } from 'react'
import { Button } from './button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { SearchInput } from './SearchInput'
import { SimpleMultiSelect } from './SimpleMultiSelect'

import {
  RefreshCw,
  Table,
  LayoutGrid,
  Layers,
  Filter
} from 'lucide-react'
import { Badge } from './badge'
import { FilterResetButton } from './ResetButton'
import { SortPresetsDropdown } from './SortPresetsDropdown'
import { SortPreset } from '../../types/sortPresets'
import { FilterStateManager } from '../../hooks/useFilterStateManager'

// Legacy filter types for backward compatibility
interface FilterOption {
  value: string;
  label: string;
}

interface LegacyFilter {
  id: string;
  placeholder: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

interface LegacyMultiSelectFilter {
  id: string;
  placeholder: string;
  value: string[];
  options: FilterOption[];
  onChange: (values: string[]) => void;
  type: 'multi-select';
}

interface EnhancedFilterBarProps {
  // Core props
  total?: number;
  page?: number;
  perPage?: number;
  activeView?: 'table' | 'card' | 'accordion';
  onViewChange?: (view: 'table' | 'card' | 'accordion') => void;
  onRefresh?: () => void;
  onViewsClick?: () => void;
  onFilterClick?: () => void;
  onSortPresetChange?: (preset: SortPreset | null) => void;
  activeSortPreset?: string | null;
  searchPlaceholder?: string;
  hideViewIcons?: ('table' | 'card' | 'accordion')[];

  // Unified filter system (new approach)
  filterManager?: FilterStateManager;
  
  // Legacy filter system (backward compatibility)
  filters?: (LegacyFilter | LegacyMultiSelectFilter)[];
  onSearch?: (query: string) => void;
  searchQuery?: string;
  onResetFilters?: () => void;
  hasActiveFilters?: boolean;
  // Compact UI options
  compactResetButton?: boolean;
}

export const EnhancedFilterBar: FC<EnhancedFilterBarProps> = ({
  total = 0,
  page = 1,
  perPage = 10,
  activeView = 'table',
  onViewChange,
  onRefresh,
  onViewsClick,
  onFilterClick,
  onSortPresetChange,
  activeSortPreset = null,
  searchPlaceholder = "Search...",
  hideViewIcons = [],
  
  // Unified system
  filterManager,
  
  // Legacy system
  filters = [],
  onSearch,
  searchQuery = '',
  onResetFilters,
  hasActiveFilters = false,
  compactResetButton = false
}) => {
  // Determine which system to use
  const useUnifiedSystem = !!filterManager
  
  // Get filter data based on system
  const getFilterData = () => {
    if (useUnifiedSystem && filterManager) {
      return {
        searchFilter: filterManager.filters.find(f => f.type === 'search'),
        nonSearchFilters: filterManager.filters.filter(f => f.type !== 'search'),
        hasActiveFilters: filterManager.hasActiveFilters,
        onResetFilters: filterManager.clearAllFilters
      }
    } else {
      return {
        searchFilter: onSearch ? { value: searchQuery, onChange: onSearch } : null,
        nonSearchFilters: filters,
        hasActiveFilters,
        onResetFilters
      }
    }
  }

  const { searchFilter, nonSearchFilters, hasActiveFilters: hasActive, onResetFilters: handleReset } = getFilterData()

  return (
    <div className="w-full bg-white px-4 py-4 min-h-[68px] flex flex-wrap items-center justify-between gap-2">
      {/* Left Section */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Search Input */}
        {searchFilter && (
          <SearchInput
            value={searchFilter.value || ''}
            onChange={useUnifiedSystem && filterManager 
              ? (value) => filterManager.setFilterValue('search', value)
              : searchFilter.onChange || (() => {})
            }
            placeholder={searchPlaceholder}
            className="w-40 h-9"
          />
        )}

        {/* Connected Filter Dropdowns */}
        {nonSearchFilters.length > 0 && (
          <div className="inline-flex border border-gray-300 rounded-md bg-white overflow-visible">
            {nonSearchFilters.map((filter, index) => {
              // Handle unified system filters
              if (useUnifiedSystem && 'type' in filter) {
                const unifiedFilter = filter as any
                const isMultiSelect = unifiedFilter.type === 'multi-select'
                const hasSelection = unifiedFilter.isActive
                const displayValue = filterManager!.getFilterDisplayValue(unifiedFilter.id)

                if (isMultiSelect) {
                  return (
                    <div
                      key={unifiedFilter.id}
                      className={index > 0 ? 'border-l border-gray-300' : ''}
                    >
                      <div className="min-w-[160px]">
                        <SimpleMultiSelect
                          placeholder={unifiedFilter.placeholder}
                          value={Array.isArray(unifiedFilter.value) ? unifiedFilter.value : []}
                          options={(unifiedFilter.options || []) as any}
                          onChange={(values) => filterManager!.setFilterValue(unifiedFilter.id, values)}
                          variant="filter"
                        />
                      </div>
                    </div>
                  )
                } else {
                  return (
                    <div
                      key={unifiedFilter.id}
                      className={index > 0 ? 'border-l border-gray-300' : ''}
                    >
                      <Select 
                        value={unifiedFilter.value || ''} 
                        onValueChange={(value) => filterManager!.setFilterValue(unifiedFilter.id, value)}
                      >
                        <SelectTrigger 
                          filter
                          className={`
                          h-9 min-w-[120px] px-2.5 text-sm font-normal
                          transition-all duration-200 ease-in-out
                          hover:shadow-sm
                          ${hasSelection
                            ? 'text-gray-900 bg-blue-50 hover:bg-blue-100 shadow-sm'
                            : 'text-gray-500 hover:bg-gray-50'
                          }
                        `}>
                          <div className="flex items-center justify-between w-full">
                            <SelectValue placeholder={unifiedFilter.placeholder} />
                            {hasSelection && (
                              <Badge 
                                variant="secondary" 
                                className="h-4 px-1.5 text-xs bg-blue-600 text-white ml-2"
                              >
                                1
                              </Badge>
                            )}
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                          {unifiedFilter.options
                            ?.filter((option: FilterOption) => option.value !== '') // Filter out empty string values
                            ?.map((option: FilterOption) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )
                }
              } else {
                // Handle legacy filters
                const isMultiSelect = 'type' in filter && filter.type === 'multi-select'

                if (isMultiSelect) {
                  const multiFilter = filter as LegacyMultiSelectFilter
                  return (
                    <div
                      key={multiFilter.id}
                      className={index > 0 ? 'border-l border-gray-300' : ''}
                    >
                      <div className="min-w-[180px]">
                        <SimpleMultiSelect
                          placeholder={multiFilter.placeholder}
                          value={multiFilter.value}
                          options={multiFilter.options as any}
                          onChange={(values) => multiFilter.onChange(values)}
                          variant="filter"
                        />
                      </div>
                    </div>
                  )
                } else {
                  const singleFilter = filter as LegacyFilter
                  const hasSelection = singleFilter.value && singleFilter.value !== '' && singleFilter.value !== 'all'

                  return (
                    <div
                      key={singleFilter.id}
                      className={index > 0 ? 'border-l border-gray-300' : ''}
                    >
                      <Select value={singleFilter.value} onValueChange={singleFilter.onChange}>
                        <SelectTrigger 
                          filter
                          className={`
                          h-9 min-w-[120px] px-2.5 text-sm font-normal
                          transition-all duration-200 ease-in-out
                          hover:shadow-sm
                          ${hasSelection
                            ? 'text-gray-900 bg-blue-50 hover:bg-blue-100 shadow-sm'
                            : 'text-gray-500 hover:bg-gray-50'
                          }
                        `}>
                          <div className="flex items-center justify-between w-full">
                            <SelectValue placeholder={singleFilter.placeholder} />
                            {hasSelection && (
                              <Badge 
                                variant="secondary" 
                                className="h-4 px-1.5 text-xs bg-blue-600 text-white ml-2"
                              >
                                1
                              </Badge>
                            )}
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                          {singleFilter.options
                            .filter(option => option.value !== '') // Filter out empty string values
                            .map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )
                }
              }
            })}
          </div>
        )}

        {/* Reset Filters Button */}
        {handleReset && (
          <FilterResetButton
            onReset={handleReset}
            hasActiveItems={hasActive}
            variant={compactResetButton ? 'minimal' : 'primary'}
            size="sm"
            iconOnly={compactResetButton}
          />
        )}

        {/* Pagination Info Only */}
        <div className="text-sm text-gray-600 whitespace-nowrap">
          <span>
            {((page - 1) * perPage) + 1}-{Math.min(page * perPage, total)} of {total}
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0"
          onClick={onRefresh}
          title="Refresh data"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        {onSortPresetChange && (
          <SortPresetsDropdown
            onSortPresetChange={onSortPresetChange}
            activePreset={activeSortPreset}
          />
        )}

        {/* View Toggle Buttons - Only show when onViewChange is provided */}
        {onViewChange && (() => {
          const visibleViews = [
            { key: 'table', icon: Table, title: 'Table View' },
            { key: 'card', icon: LayoutGrid, title: 'Card View' },
            { key: 'accordion', icon: Layers, title: 'Grouped View' }
          ].filter(view => !hideViewIcons.includes(view.key as any))

          if (visibleViews.length === 0) return null

          return (
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              {visibleViews.map((view, index) => {
                const IconComponent = view.icon
                return (
                  <Button
                    key={view.key}
                    variant={activeView === view.key ? 'default' : 'ghost'}
                    size="sm"
                    className={`h-9 w-9 p-0 rounded-none ${index > 0 ? 'border-l border-gray-300' : ''}`}
                    onClick={() => onViewChange(view.key as any)}
                    title={view.title}
                  >
                    <IconComponent className="h-4 w-4" />
                  </Button>
                )
              })}
            </div>
          )
        })()}

        {/* Views Button - Only show when onViewsClick is provided */}
        {onViewsClick && (
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-4"
            onClick={onViewsClick}
          >
            Views
          </Button>
        )}

        {/* Filter Button - Only show when onFilterClick is provided */}
        {onFilterClick && (
          <Button
            className="bg-ocean-500 text-white hover:bg-ocean-600 h-9 px-4"
            onClick={onFilterClick}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        )}
      </div>
    </div>
  )
}

export default EnhancedFilterBar