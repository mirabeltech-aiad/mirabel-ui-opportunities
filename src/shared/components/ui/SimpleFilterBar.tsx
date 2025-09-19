import { FC } from 'react'
import { Button } from './button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { SearchInput } from './SearchInput'
import {
  RefreshCw,
  Table,
  LayoutGrid,
  Layers,
  Filter
} from 'lucide-react'
import { Button as ResetButton } from './button'
import { RotateCcw } from 'lucide-react'

interface FilterOption {
  value: string
  label: string
}

interface StandardFilter {
  id: string
  placeholder: string
  value: string
  options: FilterOption[]
  onChange: (value: string) => void
  type?: 'select' | 'multi-select'
}

interface SimpleFilterBarProps {
  // Core props
  total?: number
  page?: number
  perPage?: number
  activeView?: 'table' | 'card' | 'accordion'
  onViewChange?: (view: 'table' | 'card' | 'accordion') => void
  onRefresh?: () => void
  onViewsClick?: () => void
  onFilterClick?: () => void
  searchPlaceholder?: string

  // Filter system
  filters?: StandardFilter[]
  onSearch?: (query: string) => void
  searchQuery?: string
  onResetFilters?: () => void
  hasActiveFilters?: boolean
}

const SimpleFilterBar: FC<SimpleFilterBarProps> = ({
  total = 0,
  page = 1,
  perPage = 10,
  activeView = 'table',
  onViewChange,
  onRefresh,
  onViewsClick,
  onFilterClick,
  searchPlaceholder = "Search...",
  filters = [],
  onSearch,
  searchQuery = '',
  onResetFilters,
  hasActiveFilters = false
}) => {
  return (
    <div className="w-full bg-white px-4 py-4 min-h-[68px] flex flex-wrap items-center justify-between gap-2">
      {/* Left Section */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Search Input */}
        {onSearch && (
          <SearchInput
            value={searchQuery}
            onChange={onSearch}
            placeholder={searchPlaceholder}
            className="w-48 h-9"
          />
        )}

        {/* Filter Dropdowns */}
        {filters.length > 0 && (
          <div className="inline-flex border border-gray-300 rounded-md bg-white overflow-hidden">
            {filters.map((filter, index) => {
              const hasSelection = filter.value && filter.value !== '' && filter.value !== 'all'

              return (
                <div
                  key={filter.id}
                  className={index > 0 ? 'border-l border-gray-300' : ''}
                >
                  <Select value={filter.value} onValueChange={filter.onChange}>
                    <SelectTrigger 
                      filter
                      className={`
                        h-9 min-w-[140px] px-3 text-sm font-normal
                        transition-all duration-200 ease-in-out
                        hover:shadow-sm
                        ${hasSelection
                          ? 'text-gray-900 bg-blue-50 hover:bg-blue-100 shadow-sm'
                          : 'text-gray-500 hover:bg-gray-50'
                        }
                      `}
                    >
                      <SelectValue placeholder={filter.placeholder} />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                      {filter.options
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
            })}
          </div>
        )}

        {/* Reset Filters Button */}
        {onResetFilters && (
          <ResetButton
            variant="outline"
            size="sm"
            className="h-9 px-3 flex items-center gap-2"
            onClick={onResetFilters}
            disabled={!hasActiveFilters}
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </ResetButton>
        )}

        {/* Pagination Info */}
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

        {/* View Toggle Buttons */}
        <div className="flex border border-gray-300 rounded-md overflow-hidden">
          <Button
            variant={activeView === 'table' ? 'default' : 'ghost'}
            size="sm"
            className="h-9 w-9 p-0 rounded-none"
            onClick={() => onViewChange?.('table')}
            title="Table View"
          >
            <Table className="h-4 w-4" />
          </Button>
          <Button
            variant={activeView === 'card' ? 'default' : 'ghost'}
            size="sm"
            className="h-9 w-9 p-0 rounded-none border-l border-gray-300"
            onClick={() => onViewChange?.('card')}
            title="Card View"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={activeView === 'accordion' ? 'default' : 'ghost'}
            size="sm"
            className="h-9 w-9 p-0 rounded-none border-l border-gray-300"
            onClick={() => onViewChange?.('accordion')}
            title="Grouped View"
          >
            <Layers className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="h-9 px-4"
          onClick={onViewsClick}
        >
          Views
        </Button>

        <Button
          className="bg-ocean-500 text-white hover:bg-ocean-600 h-9 px-4"
          onClick={onFilterClick}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
    </div>
  )
}

export default SimpleFilterBar
export { SimpleFilterBar }