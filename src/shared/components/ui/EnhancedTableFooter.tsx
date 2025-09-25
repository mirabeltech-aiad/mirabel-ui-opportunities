import React from 'react'
import { Button } from './button'
import { ChevronLeft, ChevronRight, MoreHorizontal, RotateCcw, Download, RefreshCw } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Input } from './input'

interface EnhancedTableFooterProps {
  // Pagination
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  pageSizeOptions?: number[]
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  
  // Selection
  selectedCount?: number
  onClearSelection?: () => void
  
  // Filters
  hasActiveFilters?: boolean
  onResetFilters?: () => void
  
  // Actions
  onRefresh?: () => void
  onExport?: () => void
  isRefreshing?: boolean
  isExporting?: boolean
  
  // Display options
  showPageSizeSelector?: boolean
  showJumpToPage?: boolean
  showExportButton?: boolean
  showRefreshButton?: boolean
  showSelectionInfo?: boolean
  showFilterReset?: boolean
  resetLabel?: string
  
  // Styling
  className?: string
  variant?: 'default' | 'compact' | 'minimal'
}

export const EnhancedTableFooter: React.FC<EnhancedTableFooterProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  selectedCount = 0,
  onClearSelection,
  hasActiveFilters = false,
  onResetFilters,
  onRefresh,
  onExport,
  isRefreshing = false,
  isExporting = false,
  showPageSizeSelector = true,
  showJumpToPage = true,
  showExportButton = true,
  showRefreshButton = true,
  showSelectionInfo = true,
  showFilterReset = true,
  resetLabel = 'Reset Filters',
  className = '',
  variant = 'default'
}) => {
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)
  
  const hasNextPage = currentPage < totalPages
  const hasPreviousPage = currentPage > 1

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisiblePages = variant === 'compact' ? 5 : 7
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      
      if (currentPage > 4) {
        pages.push('...')
      }
      
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i)
        }
      }
      
      if (currentPage < totalPages - 3) {
        pages.push('...')
      }
      
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  const pageNumbers = getPageNumbers()

  // Jump to page handler
  const handleJumpToPage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement
      const page = parseInt(target.value)
      if (page >= 1 && page <= totalPages) {
        onPageChange(page)
        target.value = ''
      }
    }
  }

  // Don't render if no data and minimal variant
  if (totalItems === 0 && variant === 'minimal') {
    return null
  }

  const baseClasses = "relative flex items-center px-6 py-4 border-t border-gray-200 bg-white"
  const compactClasses = "px-4 py-3"
  const minimalClasses = "px-4 py-2"

  const containerClasses = variant === 'compact' 
    ? `${baseClasses} ${compactClasses}` 
    : variant === 'minimal' 
    ? `${baseClasses} ${minimalClasses}`
    : baseClasses

  const noPaging = totalPages <= 1

  return (
    <div className={`${containerClasses} ${className}`}>
      {/* Left Section - Items Info & Selection */}
      <div className={`flex items-center gap-4`}>
        {/* Items Count */}
        <div className="text-sm text-gray-700">
          {totalItems > 0 ? (
            <span>
              Showing <span className="font-medium">{startItem}</span> to{' '}
              <span className="font-medium">{endItem}</span> of{' '}
              <span className="font-medium">{totalItems.toLocaleString()}</span> results
            </span>
          ) : (
            <span className="text-gray-500">No results found</span>
          )}
        </div>

        {/* Selection Info */}
        {showSelectionInfo && selectedCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-blue-600 font-medium">
              {selectedCount} selected
            </span>
            {onClearSelection && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
                className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                Clear
              </Button>
            )}
          </div>
        )}

        {/* Filter Reset */}
        {showFilterReset && hasActiveFilters && onResetFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="h-8 px-3 text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            {resetLabel}
          </Button>
        )}

        {/* When no pagination, keep page size on the left; actions are right-aligned */}
        {noPaging && (
          <div className="flex items-center gap-3 ml-4">
            {/* Page Size Selector */}
            {showPageSizeSelector && onPageSizeChange && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Show:</span>
                <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
                  <SelectTrigger className="w-20 h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {pageSizeOptions.map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-700">per page</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Center Section - Pagination */}
      {!noPaging && (
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPreviousPage}
            className="h-8 px-3"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {variant !== 'compact' && 'Previous'}
          </Button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1 mx-2">
            {pageNumbers.map((pageNum, index) => (
              <React.Fragment key={index}>
                {pageNum === '...' ? (
                  <span className="px-2 py-1 text-gray-500">
                    <MoreHorizontal className="h-4 w-4" />
                  </span>
                ) : (
                  <Button
                    variant={pageNum === currentPage ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onPageChange(pageNum as number)}
                    className={`h-8 min-w-[2rem] ${
                      pageNum === currentPage 
                        ? 'bg-ocean-600 text-white hover:bg-ocean-700' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </Button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className="h-8 px-3"
          >
            {variant !== 'compact' && 'Next'}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Right Section - Controls (always rendered to keep actions right-aligned) */}
      <div className="ml-auto flex items-center gap-3">
        {/* Jump to Page */}
        {showJumpToPage && totalPages > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Go to:</span>
            <Input
              type="number"
              min="1"
              max={totalPages}
              placeholder="Page"
              className="w-16 h-8 text-sm"
              onKeyDown={handleJumpToPage}
            />
          </div>
        )}

        {/* Page Size Selector (only when pagination is present to avoid duplication) */}
        {!noPaging && showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Show:</span>
            <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
              <SelectTrigger className="w-20 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-700">per page</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {showRefreshButton && onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="h-8 px-3"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {variant !== 'compact' && 'column refresh'}
            </Button>
          )}

          {showExportButton && onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              disabled={isExporting || totalItems === 0}
              className="h-8 px-3"
            >
              <Download className={`h-4 w-4 ${isExporting ? 'animate-pulse' : ''}`} />
              {variant !== 'compact' && 'Export'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default EnhancedTableFooter
