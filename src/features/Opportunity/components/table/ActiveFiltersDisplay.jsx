import React from 'react';
import { Button } from '@OpportunityComponents/ui/button';
import { Badge } from '@OpportunityComponents/ui/badge';
import { X, Filter, RotateCcw } from 'lucide-react';
import { useSearch } from '@OpportunityContexts/SearchContext';
const ActiveFiltersDisplay = () => {
  const {
    activeFilters,
    removeFilter,
    clearAllFilters,
    getActiveFilterCount
  } = useSearch();
  const activeFilterCount = getActiveFilterCount();
  if (activeFilterCount === 0) return null;
  const formatFieldName = key => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
  };
  const formatFieldValue = value => {
    const str = value.toString();
    return str.length > 25 ? `${str.substring(0, 25)}...` : str;
  };
  const activeFilterEntries = Object.entries(activeFilters).filter(([key, value]) => value && value.toString().trim() !== '');
  return <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">
            Active Filters ({activeFilterCount})
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={clearAllFilters} className="text-blue-600 border-blue-300 hover:bg-blue-100">
          <RotateCcw className="h-3 w-3 mr-1" />
          Clear All
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {activeFilterEntries.map(([key, value]) => <Badge key={key} variant="secondary" className="bg-white border border-blue-300 text-blue-800 hover:bg-blue-50">
            <span className="font-medium">{formatFieldName(key)}:</span>
            <span className="ml-1">{formatFieldValue(value)}</span>
            <Button variant="ghost" size="sm" onClick={() => removeFilter(key)} className="h-4 w-4 p-0 ml-2 hover:bg-blue-200 rounded">
              <X className="h-3 w-3" />
            </Button>
          </Badge>)}
      </div>
    </div>;
};
export default ActiveFiltersDisplay;