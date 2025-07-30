import React from 'react';
import { RefreshCw, Settings2, ArrowUpDown, Table, Grid3X3, Search, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

interface FilterBarProps {
  children?: React.ReactNode;
  onRefresh?: () => void;
  onSettingsClick?: () => void;
  currentView?: 'table' | 'card';
  onViewChange?: (view: 'table' | 'card') => void;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  children,
  onRefresh,
  onSettingsClick,
  currentView = 'table',
  onViewChange,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 20,
  onPageChange,
  className = ""
}) => {
  const navigate = useNavigate();

  const startItem = ((currentPage - 1) * itemsPerPage) + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePreviousPage = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  const handleSearchClick = () => {
    navigate('/advanced-search');
  };

  const handleViewsClick = () => {
    // Placeholder for saved views functionality
  };

  return (
    <div className={`w-full px-4 py-4 bg-white border-b border-gray-200 min-h-[68px] ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-2">
          {/* Connected Filter Dropdowns */}
          {children && (
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white">
              {children}
            </div>
          )}
          
          {/* Pagination Info Display */}
          {totalItems > 0 && (
            <div className="text-sm text-gray-600 px-3">
              {startItem}-{endItem} of {totalItems.toLocaleString()}
            </div>
          )}
          
          {/* Pagination Navigation Controls */}
          {totalPages > 1 && (
            <div className="flex">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage <= 1}
                className="h-9 w-9 p-0 rounded-sm border-r-0"
              >
                <span className="sr-only">Previous page</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className="h-9 w-9 p-0 rounded-sm"
              >
                <span className="sr-only">Next page</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1">
          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="h-9 w-9 p-0 rounded-sm"
            title="Refresh data"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          {/* Settings Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onSettingsClick}
            className="h-9 w-9 p-0 rounded-sm"
            title="Settings"
          >
            <Settings2 className="h-4 w-4" />
          </Button>

          {/* Sort Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 rounded-sm"
                title="Sort options"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg z-50">
              <DropdownMenuItem>Sort by Name</DropdownMenuItem>
              <DropdownMenuItem>Sort by Date</DropdownMenuItem>
              <DropdownMenuItem>Sort by Value</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Connected View Toggle Buttons */}
          <div className="flex border border-gray-300 rounded-sm overflow-hidden">
            <Button
              variant={currentView === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange?.('table')}
              className="h-9 w-9 p-0 rounded-none border-r border-gray-300"
              title="Table view"
            >
              <Table className="h-4 w-4" />
            </Button>
            <Button
              variant={currentView === 'card' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange?.('card')}
              className="h-9 w-9 p-0 rounded-none"
              title="Card view"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearchClick}
            className="bg-ocean-500 text-white hover:bg-ocean-600 border-ocean-500 h-9 px-3"
            title="Advanced search"
          >
            <Search className="h-4 w-4 mr-1" />
            Search
          </Button>

          {/* Views Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewsClick}
            className="h-9 px-3"
            title="Saved views"
          >
            <BookOpen className="h-4 w-4 mr-1" />
            Views
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;