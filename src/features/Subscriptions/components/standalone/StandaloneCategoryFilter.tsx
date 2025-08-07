
import React from 'react';
import StandaloneBadge from './StandaloneBadge';
import StandaloneButton from './StandaloneButton';

interface StandaloneCategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  categoryReportCounts: Record<string, number>;
  favoriteCount: number;
}

const StandaloneCategoryFilter = ({ 
  categories, 
  activeCategory, 
  onCategoryChange, 
  categoryReportCounts,
  favoriteCount 
}: StandaloneCategoryFilterProps) => {
  const allCategories = ['All', 'Favorites', ...categories];

  const getReportCount = (category: string) => {
    if (category === 'All') {
      return Object.values(categoryReportCounts).reduce((sum, count) => sum + count, 0);
    }
    if (category === 'Favorites') {
      return favoriteCount;
    }
    return categoryReportCounts[category] || 0;
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {allCategories.map((category) => (
        <StandaloneButton
          key={category}
          variant={activeCategory === category ? "default" : "outline"}
          onClick={() => onCategoryChange(category)}
          className={`h-8 px-4 rounded-md text-sm font-medium transition-all ${
            activeCategory === category
              ? 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          {category}
          <StandaloneBadge 
            variant="secondary" 
            className={`ml-2 h-5 px-1.5 text-xs ${
              activeCategory === category
                ? 'bg-white/20 text-white border-0'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {getReportCount(category)}
          </StandaloneBadge>
        </StandaloneButton>
      ))}
    </div>
  );
};

export default StandaloneCategoryFilter;
