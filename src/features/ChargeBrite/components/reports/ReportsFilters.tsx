
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ReportsSearch from './ReportsSearch';
import CategoryFilter from './CategoryFilter';

interface ReportsFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  categoryReportCounts: Record<string, number>;
  favoriteCount: number;
}

const ReportsFilters: React.FC<ReportsFiltersProps> = ({
  searchQuery,
  onSearchChange,
  categories,
  activeCategory,
  onCategoryChange,
  categoryReportCounts,
  favoriteCount
}) => {
  const handleClearFilters = () => {
    onSearchChange('');
    onCategoryChange('All');
  };

  const hasActiveFilters = searchQuery || activeCategory !== 'All';

  return (
    <Card className="mb-6 bg-white border border-gray-200 shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Filter Header */}
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 min-w-fit">
            <Filter className="h-4 w-4" />
            Filters:
          </div>

          {/* Connected Filter Controls */}
          <div className="flex items-center gap-0 min-w-0 min-w-full">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-[200px] h-9 rounded-r-none border-r-0 bg-white"
              />
            </div>

            {/* Category Filter */}
            <div className="border-l-0">
              <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={onCategoryChange}
                categoryReportCounts={categoryReportCounts}
                favoriteCount={favoriteCount}
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="flex items-center gap-3 ml-auto">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="h-9 text-xs bg-white"
              >
                <X className="h-3 w-3 mr-1" />
                Clear All Filters
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportsFilters;
