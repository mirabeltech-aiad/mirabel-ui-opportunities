import React, { useState } from 'react'
import { Search, RefreshCw, Filter, ChevronDown } from 'lucide-react'
import { Button } from './button'
import { Badge } from './badge'
import { Input } from './input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

interface FilterBarFilter {
  id: string
  placeholder: string
  options: { value: string; label: string }[]
  type: 'select' | 'multi-select'
  value: string
  hasSelection: boolean
  selectionCount: number
  displayValue: string
  onChange: (value: string) => void
}

interface RateAnalyzerFilterBarProps {
  // Search
  searchQuery: string
  onSearch: (query: string) => void
  searchPlaceholder?: string

  // Filters
  filters: FilterBarFilter[]
  hasActiveFilters: boolean
  onResetFilters: () => void
  activeFilterCount?: number

  // Data info
  total?: number
  filteredCount?: number
  loading?: boolean

  // Actions
  onRefresh?: () => void
  onAdvancedFilter?: () => void

  // View info
  activeView?: { name: string } | null
}

function RateAnalyzerFilterBar({
  searchQuery,
  onSearch,
  searchPlaceholder = 'Search clients, rate cards...',
  filters,
  hasActiveFilters,
  onResetFilters,
  total = 0,
  filteredCount,
  loading = false,
  onRefresh,
  onAdvancedFilter,
  activeView
}: RateAnalyzerFilterBarProps) {
  const [searchFocused, setSearchFocused] = useState(false)

  const displayCount = filteredCount !== undefined ? filteredCount : total

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left Section - Search and Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={`
                pl-10 pr-4 h-9 w-64 text-sm
                transition-all duration-200 ease-in-out
                ${searchFocused || searchQuery 
                  ? 'ring-2 ring-ocean-500 border-ocean-500' 
                  : 'border-gray-300 hover:border-gray-400'
                }
                ${searchQuery ? 'bg-blue-50' : 'bg-white'}
              `}
            />
          </div>

          {/* Connected Filter Dropdowns */}
          <div className="inline-flex border border-gray-300 rounded-md overflow-hidden shadow-sm">
            {filters.map((filter, index) => (
              <div
                key={filter.id}
                className={`
                  ${index > 0 ? 'border-l border-gray-300' : ''}
                `}
              >
                <Select value={filter.value} onValueChange={filter.onChange}>
                  <SelectTrigger
                    className={`
                      h-9 min-w-[140px] px-3 text-sm font-normal border-0 rounded-none
                      transition-all duration-200 ease-in-out
                      hover:shadow-sm focus:ring-0 focus:ring-offset-0
                      ${filter.hasSelection
                        ? 'text-gray-900 bg-blue-50 hover:bg-blue-100 shadow-sm'
                        : 'text-gray-500 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between w-full">
                      <SelectValue placeholder={filter.placeholder} />
                      <div className="flex items-center gap-1 ml-2">
                        {filter.hasSelection && (
                          <Badge 
                            variant="secondary" 
                            className="h-4 px-1.5 text-xs bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-150"
                          >
                            {filter.selectionCount}
                          </Badge>
                        )}
                        <ChevronDown className={`w-4 h-4 transition-all duration-150 ${filter.hasSelection ? 'opacity-70' : 'opacity-50'}`} />
                      </div>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {filter.options.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="h-9 px-3 text-sm"
            >
              Reset
            </Button>
          )}

          {/* Results Count */}
          <div className="text-sm text-gray-600 ml-2">
            {loading ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              <span>
                {displayCount.toLocaleString()} 
                {filteredCount !== undefined && filteredCount !== total && (
                  <span className="text-gray-500"> of {total.toLocaleString()}</span>
                )}
                {displayCount === 1 ? ' client' : ' clients'}
              </span>
            )}
          </div>
        </div>

        {/* Right Section - Actions and View Info */}
        <div className="flex items-center gap-2">
          {/* Active View Indicator */}
          {activeView && (
            <div className="text-sm text-gray-600 mr-2">
              <span className="text-gray-500">View:</span>
              <span className="font-medium text-ocean-600 ml-1">{activeView.name}</span>
            </div>
          )}

          {/* Refresh Button */}
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
              className="h-9 px-3"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          )}

          {/* Advanced Filter Button */}
          {onAdvancedFilter && (
            <Button
              variant="outline"
              size="sm"
              onClick={onAdvancedFilter}
              className="h-9 px-3 flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Advanced
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default RateAnalyzerFilterBar
export { RateAnalyzerFilterBar }