import { logger } from '../../utils/logger'

import React, { useState, useMemo, useCallback } from 'react'
import { Button } from './button'
import { FloatingLabelSearchInput } from './FloatingLabelSearchInput'
import { Badge } from './badge'
import {
  Search,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  ArrowUp,
  ArrowDown,
  Lock,
  Grid,
  List,
  Filter,
  X,
  History,
  Loader2
} from 'lucide-react'
import { useAdvancedSearch } from '../../hooks/useAdvancedSearch'
import { useCategoryFilter } from '../../hooks/useCategoryFilter'
import { useFilterManager } from '../../hooks/useFilterManager'
import { useDragAndDrop } from '../../hooks/useDragAndDrop'
import { highlightMatches } from '../../utils/searchUtils'
import { getCategoryColor } from '../../utils/categoryUtils'
import { formatFilterForDisplay } from '../../utils/filterUtils'
import { FilterDropdown } from './FilterDropdown'
import { FilterResetButton } from './ResetButton'
import { Tooltip } from './tooltip'
import { getTooltip } from '@/shared/constants/tooltips'

export interface ColumnDefinition {
  key: string
  title: string
  category?: string
  description?: string
  dataType?: 'string' | 'number' | 'date' | 'boolean' | 'custom'
  width?: number
  minWidth?: number
  maxWidth?: number
  locked?: boolean
  required?: boolean
  sortable?: boolean
  filterable?: boolean

  // Metadata for enhanced features
  usage?: {
    frequency: number
    lastUsed: Date
    importance: 'high' | 'medium' | 'low'
  }

  // Relationships
  dependencies?: string[]
  relatedColumns?: string[]

  // Display
  icon?: React.ComponentType
  tooltip?: string
  tags?: string[]
}

export interface FilterConfig {
  type: 'category' | 'dataType' | 'usage' | 'custom'
  value: any
  operator: 'equals' | 'contains' | 'in' | 'range'
  active: boolean
}

export interface SearchConfig {
  searchFields: ('title' | 'key' | 'description' | 'category' | 'tags')[]
  fuzzySearch: boolean
  highlightMatches: boolean
  enableHistory: boolean
  historySize: number
  debounceMs: number
  maxResults: number
  minScore: number
}

export interface DragDropState {
  draggedItem: string | null
  dragOverIndex: number | null
  isDragging: boolean
  dragPreview?: 'ghost' | 'clone' | 'custom'
}

export interface ColumnSelectorState {
  // Search and filtering
  searchTerm: string
  selectedCategory: string
  activeFilters: FilterConfig[]

  // Selection state
  selectedAvailable: Set<string>
  selectedVisible: Set<string>

  // Drag and drop state
  dragDrop: DragDropState

  // UI state
  isLoading: boolean
  error: string | null
  showTooltip: boolean
  tooltipColumn: ColumnDefinition | null
}

interface ColumnSelectorProps {
  // Data
  columns: ColumnDefinition[]
  visibleColumns: string[]

  // Callbacks
  onToggleColumn: (columnKey: string) => void
  onReorderColumns?: (columnKeys: string[]) => void
  onBulkToggle?: (columnKeys: string[], visible: boolean) => void

  // Configuration
  enableDragDrop?: boolean
  enableBulkOperations?: boolean
  enableCategorization?: boolean
  enableVirtualization?: boolean
  maxHeight?: number

  // Search configuration
  searchConfig?: Partial<SearchConfig>

  // Styling
  className?: string

  // Event handlers
  onSearchChange?: (searchTerm: string) => void
  onCategoryChange?: (category: string) => void
  onError?: (error: string) => void
}

export const ColumnSelector: React.FC<ColumnSelectorProps> = ({
  columns,
  visibleColumns,
  onToggleColumn,
  onReorderColumns,
  onBulkToggle,
  enableDragDrop = true,
  enableBulkOperations = true,
  enableCategorization = true,
  enableVirtualization = false,
  maxHeight,
  searchConfig = {},
  className = '',
  onSearchChange,
  onCategoryChange,
  onError
}) => {
  // Enhanced state management
  const [state, setState] = useState<ColumnSelectorState>({
    searchTerm: '',
    selectedCategory: 'all',
    activeFilters: [],
    selectedAvailable: new Set<string>(),
    selectedVisible: new Set<string>(),
    dragDrop: {
      draggedItem: null,
      dragOverIndex: null,
      isDragging: false
    },
    isLoading: false,
    error: null,
    showTooltip: false,
    tooltipColumn: null
  })

  // Destructure state for easier access
  const {
    searchTerm,
    selectedCategory,
    activeFilters,
    selectedAvailable,
    selectedVisible,
    dragDrop,
    isLoading,
    error,
    showTooltip,
    tooltipColumn
  } = state

  // Enhanced search configuration
  const defaultSearchConfig: SearchConfig = {
    searchFields: ['title', 'key', 'description', 'category', 'tags'],
    fuzzySearch: false,
    highlightMatches: true,
    enableHistory: true,
    historySize: 10,
    debounceMs: 300,
    maxResults: 50,
    minScore: 0.1
  }

  const mergedSearchConfig = { ...defaultSearchConfig, ...searchConfig }

  // Advanced search hook
  const {
    searchTerm: advancedSearchTerm,
    setSearchTerm: setAdvancedSearchTerm,
    results: searchResults,
    isSearching,
    searchHistory,
    clearHistory,
    removeFromHistory,
    hasResults,
    resultCount
  } = useAdvancedSearch({
    items: columns,
    searchFields: mergedSearchConfig.searchFields as (keyof ColumnDefinition)[],
    fuzzySearch: mergedSearchConfig.fuzzySearch,
    debounceMs: mergedSearchConfig.debounceMs,
    maxResults: mergedSearchConfig.maxResults,
    minScore: mergedSearchConfig.minScore,
    enableHistory: mergedSearchConfig.enableHistory,
    historySize: mergedSearchConfig.historySize
  })

  // Use advanced search term or fallback to state search term
  const effectiveSearchTerm = advancedSearchTerm || searchTerm

  // Enhanced category filtering
  const {
    categories: categoryInfos,
    selectedCategory: categoryFilterSelected,
    setSelectedCategory: setCategoryFilterSelected,
    filteredCategories,
    searchCategories,
    clearCategorySearch,
    categorySearchTerm,
    getCategoryInfo,
    resetToDefault: resetCategoryFilter
  } = useCategoryFilter({
    items: columns,
    categoryField: 'category',
    enableGrouping: false,
    defaultCategory: 'all'
  })

  // Use category filter selected category or fallback to state
  const effectiveSelectedCategory = categoryFilterSelected || selectedCategory

  // Filter management
  const {
    filterState,
    filterSummary,
    addFilter,
    removeFilter: removeFilterById,
    toggleFilter,
    clearAllFilters,
    clearFiltersByType,
    addSearchFilter,
    addCategoryFilter,
    addDataTypeFilter,
    addUsageFilter,
    hasActiveFilters,
    getActiveFilters,
    canAddMoreFilters
  } = useFilterManager({
    enableQuickFilters: true,
    maxFilters: 10,
    persistFilters: false
  })

  // Drag and drop functionality
  const {
    dragState,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    isDragging,
    getDraggedColumn,
    getDropZones
  } = useDragAndDrop({
    enablePreview: enableDragDrop,
    onDragStart: (dragData) => {
      logger.log('Drag started:', dragData)
    },
    onDrop: (result) => {
      if (result.success) {
        handleDragDropResult(result)
      }
    },
    onDragEnd: (result) => {
      logger.log('Drag ended:', result)
    }
  })

  // Enhanced filtering logic with search results
  const filteredColumns = useMemo(() => {
    let columnsToFilter = columns

    // Apply search results if there's a search term
    if (effectiveSearchTerm && searchResults.length > 0) {
      const searchResultKeys = new Set(searchResults.map(result => result.item.key))
      columnsToFilter = columns.filter(column => searchResultKeys.has(column.key))
    } else if (effectiveSearchTerm && searchResults.length === 0) {
      // No search results found
      columnsToFilter = []
    }

    // Apply category and other filters
    return columnsToFilter.filter(column => {
      // Category matching
      const matchesCategory = effectiveSelectedCategory === 'all' || column.category === effectiveSelectedCategory

      // Active filters matching
      const activeFilterConfigs = getActiveFilters()
      const matchesFilters = activeFilterConfigs.length === 0 || activeFilterConfigs.every(filter => {
        switch (filter.type) {
          case 'category':
            return column.category === filter.value
          case 'dataType':
            return column.dataType === filter.value
          case 'usage':
            return column.usage?.importance === filter.value
          case 'custom':
            // Handle custom filters based on the filter label/description
            if (filter.label === 'Required Only') {
              return column.required === true
            }
            return true
          default:
            return true
        }
      })

      return matchesCategory && matchesFilters
    })
  }, [columns, effectiveSearchTerm, searchResults, selectedCategory, activeFilters])

  // Get search result for a specific column (for highlighting)
  const getSearchResult = useCallback((columnKey: string) => {
    return searchResults.find(result => result.item.key === columnKey)
  }, [searchResults])

  // Split columns into available and selected
  // Use filteredColumns for display, but ensure all non-visible columns are available for bulk operations
  const allAvailableColumns = columns.filter(col => !visibleColumns.includes(col.key))
  const availableColumns = filteredColumns.filter(col => !visibleColumns.includes(col.key))
  
  const selectedColumns = useMemo(() => {
    return visibleColumns
      .map(key => columns.find(col => col.key === key))
      .filter(Boolean) as ColumnDefinition[]
  }, [visibleColumns, columns])

  // Enhanced state update functions
  const updateState = useCallback((updates: Partial<ColumnSelectorState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  const updateDragDrop = useCallback((updates: Partial<DragDropState>) => {
    setState(prev => ({
      ...prev,
      dragDrop: { ...prev.dragDrop, ...updates }
    }))
  }, [])

  // Handle search changes
  const handleSearchChange = useCallback((newSearchTerm: string) => {
    updateState({ searchTerm: newSearchTerm })
    setAdvancedSearchTerm(newSearchTerm)
    onSearchChange?.(newSearchTerm)
  }, [updateState, setAdvancedSearchTerm, onSearchChange])

  // Handle category changes
  const handleCategoryChange = useCallback((category: string) => {
    updateState({ selectedCategory: category })
    setCategoryFilterSelected(category)
    onCategoryChange?.(category)
  }, [updateState, setCategoryFilterSelected, onCategoryChange])

  // Handle column move between panes
  const handleAddColumn = useCallback((columnKey: string) => {
    try {
      onToggleColumn(columnKey)
    } catch (error) {
      const errorMessage = `Failed to add column: ${error}`
      updateState({ error: errorMessage })
      onError?.(errorMessage)
    }
  }, [onToggleColumn, updateState, onError])

  const handleRemoveColumn = useCallback((columnKey: string) => {
    try {
      const column = columns.find(col => col.key === columnKey)
      if (column?.locked) return
      onToggleColumn(columnKey)
    } catch (error) {
      const errorMessage = `Failed to remove column: ${error}`
      updateState({ error: errorMessage })
      onError?.(errorMessage)
    }
  }, [onToggleColumn, columns, updateState, onError])

  // Handle reordering in selected columns
  const handleMoveUp = useCallback((columnKey: string) => {
    if (!onReorderColumns) return
    const currentIndex = visibleColumns.indexOf(columnKey)
    if (currentIndex <= 0) return

    const newOrder = [...visibleColumns]
    newOrder[currentIndex] = visibleColumns[currentIndex - 1]
    newOrder[currentIndex - 1] = columnKey
    onReorderColumns(newOrder)
  }, [visibleColumns, onReorderColumns])

  const handleMoveDown = useCallback((columnKey: string) => {
    if (!onReorderColumns) return
    const currentIndex = visibleColumns.indexOf(columnKey)
    if (currentIndex >= visibleColumns.length - 1) return

    const newOrder = [...visibleColumns]
    newOrder[currentIndex] = visibleColumns[currentIndex + 1]
    newOrder[currentIndex + 1] = columnKey
    onReorderColumns(newOrder)
  }, [visibleColumns, onReorderColumns])

  // Enhanced bulk operations
  const handleSelectAll = useCallback(() => {
    if (!enableBulkOperations) return

    try {
      const columnsToAdd = availableColumns.filter(col => !col.locked).map(col => col.key)
      logger.log('Selecting columns:', columnsToAdd)
      logger.log('onBulkToggle available:', !!onBulkToggle)
      
      if (onBulkToggle) {
        onBulkToggle(columnsToAdd, true)
      } else {
        logger.log('Using individual onToggleColumn calls')
        columnsToAdd.forEach(key => onToggleColumn(key))
      }
    } catch (error) {
      console.error('Error in handleSelectAll:', error)
      const errorMessage = `Failed to select all columns: ${error}`
      updateState({ error: errorMessage })
      onError?.(errorMessage)
    }
  }, [availableColumns, onToggleColumn, onBulkToggle, enableBulkOperations, updateState, onError])

  const handleDeselectAll = useCallback(() => {
    if (!enableBulkOperations) return

    try {
      const columnsToRemove = selectedColumns.filter(col => !col.locked).map(col => col.key)
      logger.log('Deselecting columns:', columnsToRemove)
      logger.log('onBulkToggle available:', !!onBulkToggle)
      
      if (onBulkToggle) {
        onBulkToggle(columnsToRemove, false)
      } else {
        logger.log('Using individual onToggleColumn calls')
        columnsToRemove.forEach(key => onToggleColumn(key))
      }
    } catch (error) {
      console.error('Error in handleDeselectAll:', error)
      const errorMessage = `Failed to deselect all columns: ${error}`
      updateState({ error: errorMessage })
      onError?.(errorMessage)
    }
  }, [selectedColumns, onToggleColumn, onBulkToggle, enableBulkOperations, updateState, onError])

  // Handle drag and drop result
  const handleDragDropResult = useCallback((result: any) => {
    try {
      if (result.operation === 'move') {
        // Moving between panes (add/remove column)
        onToggleColumn(result.columnKey)
      } else if (result.operation === 'reorder' && onReorderColumns) {
        // Reordering within selected pane
        const newOrder = [...visibleColumns]
        const draggedIndex = result.fromIndex
        const targetIndex = result.toIndex

        // Remove from old position
        const [draggedItem] = newOrder.splice(draggedIndex, 1)

        // Insert at new position
        newOrder.splice(targetIndex, 0, draggedItem)

        onReorderColumns(newOrder)
      }
    } catch (error) {
      const errorMessage = `Drag and drop failed: ${error}`
      updateState({ error: errorMessage })
      onError?.(errorMessage)
    }
  }, [onToggleColumn, onReorderColumns, visibleColumns, updateState, onError])

  // Handle multi-selection
  const handleItemSelect = useCallback((columnKey: string, pane: 'available' | 'selected', event: React.MouseEvent) => {
    if (!enableBulkOperations) return

    const isCtrlOrCmd = event.ctrlKey || event.metaKey
    const targetSet = pane === 'available' ? selectedAvailable : selectedVisible

    if (isCtrlOrCmd) {
      const newSet = new Set(targetSet)
      if (newSet.has(columnKey)) {
        newSet.delete(columnKey)
      } else {
        newSet.add(columnKey)
      }

      updateState({
        [pane === 'available' ? 'selectedAvailable' : 'selectedVisible']: newSet
      })
    } else {
      updateState({
        selectedAvailable: pane === 'available' ? new Set([columnKey]) : new Set(),
        selectedVisible: pane === 'selected' ? new Set([columnKey]) : new Set()
      })
    }
  }, [enableBulkOperations, selectedAvailable, selectedVisible, updateState])

  const renderColumnItem = (column: ColumnDefinition, isSelected: boolean, index: number) => {
    const pane = isSelected ? 'selected' : 'available'
    const isItemSelected = (isSelected ? selectedVisible : selectedAvailable).has(column.key)
    const searchResult = getSearchResult(column.key)
    const hasSearchMatch = !!searchResult && effectiveSearchTerm
    const isDraggedItem = getDraggedColumn() === column.key

    return (
      <div
        key={column.key}
        data-column-item={column.key}
        data-drop-zone={`${pane}-pane`}
        draggable={enableDragDrop && !column.locked}
        className={`
        group flex items-center justify-between p-2 rounded border transition-all duration-200
        ${isSelected
            ? 'bg-ocean-50 border-ocean-200 hover:bg-ocean-100'
            : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          }
        ${isItemSelected ? 'ring-2 ring-ocean-300' : ''}
        ${hasSearchMatch ? 'ring-1 ring-yellow-300 bg-yellow-50' : ''}
        ${isDraggedItem ? 'opacity-50 scale-95' : ''}
        ${column.locked ? 'opacity-60' : enableDragDrop ? 'cursor-move' : 'cursor-pointer'}
        ${isDragging && !isDraggedItem ? 'pointer-events-none' : ''}
      `}
        onClick={(e) => enableBulkOperations && !isDragging ? handleItemSelect(column.key, pane, e) : undefined}
        onDragStart={(e) => enableDragDrop && !column.locked ? handleDragStart(e, column.key, pane, index, column) : undefined}
        onDragEnd={enableDragDrop ? handleDragEnd : undefined}
        onDragOver={enableDragDrop ? handleDragOver : undefined}
        onDragEnter={enableDragDrop ? handleDragEnter : undefined}
        onDragLeave={enableDragDrop ? handleDragLeave : undefined}
        onDrop={enableDragDrop ? handleDrop : undefined}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="flex-shrink-0">
            {isSelected ? (
              <Eye className="h-4 w-4 text-ocean-600" />
            ) : (
              <EyeOff className="h-4 w-4 text-gray-400" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-gray-900 truncate">
                {mergedSearchConfig.highlightMatches && effectiveSearchTerm ? (
                  <span className="flex items-center">
                    {highlightMatches(column.title, effectiveSearchTerm)}
                  </span>
                ) : (
                  column.title
                )}
              </span>
              {column.locked && (
                <Tooltip content={getTooltip('COLUMN_SELECTOR.COLUMN_ITEM.LOCKED')}>
                  <Lock className="h-3 w-3 text-gray-400 flex-shrink-0" />
                </Tooltip>
              )}
            </div>
            {column.description && (
              <p className="text-xs text-gray-500 truncate">
                {mergedSearchConfig.highlightMatches && effectiveSearchTerm ? (
                  <span className="flex items-center">
                    {highlightMatches(column.description, effectiveSearchTerm)}
                  </span>
                ) : (
                  column.description
                )}
              </p>
            )}
            <div className="flex items-center gap-1 mt-1">
              {column.category && (
                <Tooltip content={getTooltip('COLUMN_SELECTOR.COLUMN_ITEM.CATEGORY_BADGE')}>
                  <Badge
                    variant="outline"
                    className={`text-xs border-${getCategoryColor(column.category)}-300 text-${getCategoryColor(column.category)}-700`}
                  >
                    {getCategoryInfo(column.category)?.label || column.category}
                  </Badge>
                </Tooltip>
              )}
              {column.dataType && (
                <Tooltip content={getTooltip('COLUMN_SELECTOR.COLUMN_ITEM.DATA_TYPE_BADGE')}>
                  <Badge variant="secondary" className="text-xs">
                    {column.dataType}
                  </Badge>
                </Tooltip>
              )}
              {column.usage?.importance && (
                <Tooltip content={getTooltip('COLUMN_SELECTOR.COLUMN_ITEM.IMPORTANCE_BADGE')}>
                  <Badge
                    variant={column.usage.importance === 'high' ? 'default' : 'outline'}
                    className="text-xs"
                  >
                    {column.usage.importance}
                  </Badge>
                </Tooltip>
              )}
              {/* Search Match Score for Fuzzy Search */}
              {mergedSearchConfig.fuzzySearch && searchResult && effectiveSearchTerm && (
                <Tooltip content={getTooltip('COLUMN_SELECTOR.COLUMN_ITEM.MATCH_SCORE')}>
                  <Badge variant="secondary" className="text-xs">
                    {Math.round(searchResult.totalScore * 100)}% match
                  </Badge>
                </Tooltip>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {isSelected ? (
            <>
              {onReorderColumns && (
                <>
                  <Tooltip content={getTooltip('COLUMN_SELECTOR.COLUMN_ITEM.MOVE_UP')}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMoveUp(column.key)
                      }}
                      disabled={visibleColumns.indexOf(column.key) === 0}
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                  </Tooltip>
                  <Tooltip content={getTooltip('COLUMN_SELECTOR.COLUMN_ITEM.MOVE_DOWN')}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMoveDown(column.key)
                      }}
                      disabled={visibleColumns.indexOf(column.key) === visibleColumns.length - 1}
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                  </Tooltip>
                </>
              )}
              <Tooltip content={getTooltip('COLUMN_SELECTOR.COLUMN_ITEM.REMOVE_COLUMN')}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveColumn(column.key)
                  }}
                  disabled={column.locked}
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
              </Tooltip>
            </>
          ) : (
            <Tooltip content={getTooltip('COLUMN_SELECTOR.COLUMN_ITEM.ADD_COLUMN')}>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-ocean-600 hover:text-ocean-700"
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddColumn(column.key)
                }}
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </Tooltip>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`flex flex-col h-full ${className}`}
      style={{ maxHeight: maxHeight ? `${maxHeight}px` : undefined }}
    >
      {/* Search and Filter Controls */}
      <div className="flex-shrink-0 space-y-3 p-4 border-b border-gray-200">
        {/* Enhanced Search with History */}
        <div className="relative">
          <Tooltip content={getTooltip('COLUMN_SELECTOR.SEARCH_INPUT')}>
            <FloatingLabelSearchInput
              label="Search Columns"
              value={effectiveSearchTerm}
              onChange={handleSearchChange}
              placeholder={`Search columns${mergedSearchConfig.fuzzySearch ? ' (fuzzy search enabled)' : ''}...`}
              className="text-sm"
              isLoading={isSearching}
            />
          </Tooltip>
          <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {/* Search History Button */}
            {mergedSearchConfig.enableHistory && searchHistory.length > 0 && (
              <Tooltip content={getTooltip('COLUMN_SELECTOR.SEARCH_HISTORY')}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => {
                    // Toggle search history dropdown
                    // This will be implemented as a dropdown component
                  }}
                >
                  <History className="h-3 w-3" />
                </Button>
              </Tooltip>
            )}
            {/* Clear Search Button */}
            {effectiveSearchTerm && (
              <Tooltip content={getTooltip('COLUMN_SELECTOR.CLEAR_SEARCH')}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => handleSearchChange('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Search Results Info */}
        {effectiveSearchTerm && (
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {isSearching ? (
                'Searching...'
              ) : hasResults ? (
                `${resultCount} result${resultCount !== 1 ? 's' : ''} found`
              ) : (
                'No results found'
              )}
            </span>
            {mergedSearchConfig.fuzzySearch && (
              <Tooltip content={getTooltip('COLUMN_SELECTOR.FUZZY_SEARCH_BADGE')}>
                <Badge variant="outline" className="text-xs">
                  Fuzzy Search
                </Badge>
              </Tooltip>
            )}
          </div>
        )}

        {/* Filter Dropdown */}
        <FilterDropdown
          hasActiveFilters={hasActiveFilters}
          filterSummary={filterSummary}
          activeFilters={getActiveFilters()}
          categoryInfos={categoryInfos}
          selectedCategory={effectiveSelectedCategory}
          categorySearchTerm={categorySearchTerm}
          filteredCategories={filteredCategories}
          addFilter={addFilter}
          removeFilter={removeFilterById}
          clearAllFilters={clearAllFilters}
          addUsageFilter={addUsageFilter}
          addCategoryFilter={addCategoryFilter}
          handleCategoryChange={handleCategoryChange}
          searchCategories={searchCategories}
          clearCategorySearch={clearCategorySearch}
          canAddMoreFilters={canAddMoreFilters}
          enableCategorization={enableCategorization}
        />

        {/* Stats and Bulk Actions */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Tooltip content={getTooltip('COLUMN_SELECTOR.STATS.SELECTED_COUNT')}>
              <span>{selectedColumns.length} of {columns.length} selected</span>
            </Tooltip>
            {(effectiveSearchTerm || hasActiveFilters || effectiveSelectedCategory !== 'all') && (
              <Tooltip content={getTooltip('COLUMN_SELECTOR.STATS.FILTERED_COUNT')}>
                <span className="text-blue-600">
                  • {filteredColumns.length} shown
                </span>
              </Tooltip>
            )}
            {hasActiveFilters && (
              <Badge variant="secondary" className="text-xs">
                {filterSummary.totalActive} filter{filterSummary.totalActive !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          {enableBulkOperations && (
            <div className="flex gap-2">
              <Tooltip content={getTooltip('COLUMN_SELECTOR.BULK_ACTIONS.SELECT_ALL')}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs px-2"
                  onClick={handleSelectAll}
                  disabled={availableColumns.length === 0 || isLoading}
                >
                  Select All
                </Button>
              </Tooltip>
              <Tooltip content={getTooltip('COLUMN_SELECTOR.BULK_ACTIONS.CLEAR_ALL')}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs px-2"
                  onClick={handleDeselectAll}
                  disabled={selectedColumns.filter(col => !col.locked).length === 0 || isLoading}
                >
                  Clear
                </Button>
              </Tooltip>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded">
            <span>{error}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 ml-auto"
              onClick={() => updateState({ error: null })}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Dual Pane Layout */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Available Columns */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <List className="h-4 w-4 text-gray-600" />
            <h3 className="font-medium text-sm text-gray-900">
              Available ({availableColumns.length})
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1">
            {availableColumns.map((column, index) => renderColumnItem(column, false, index))}
            {availableColumns.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Grid className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No available columns</p>
                {effectiveSearchTerm && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs">Try adjusting your search</p>
                    {mergedSearchConfig.fuzzySearch && (
                      <p className="text-xs">Fuzzy search is enabled for flexible matching</p>
                    )}
                  </div>
                )}
                {hasActiveFilters && (
                  <div className="mt-2">
                    <p className="text-xs">Try removing some filters</p>
                    <FilterResetButton
                      onReset={clearAllFilters}
                      hasActiveItems={activeFilters.length > 0}
                      variant="minimal"
                      size="sm"
                      className="h-6 text-xs px-2 mt-1"
                    />
                  </div>
                )}
                {effectiveSelectedCategory !== 'all' && !effectiveSearchTerm && !hasActiveFilters && (
                  <div className="mt-2">
                    <p className="text-xs">All columns in this category are selected</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs px-2 mt-1"
                      onClick={() => handleCategoryChange('all')}
                    >
                      Show All Categories
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Selected Columns */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="h-4 w-4 text-ocean-600" />
            <h3 className="font-medium text-sm text-gray-900">
              Selected ({selectedColumns.length})
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1">
            {selectedColumns.map((column, index) => renderColumnItem(column, true, index))}
            {selectedColumns.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <EyeOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No columns selected</p>
                <p className="text-xs">Add columns from the left</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ColumnSelector