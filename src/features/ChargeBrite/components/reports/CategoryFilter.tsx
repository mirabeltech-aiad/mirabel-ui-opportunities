
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  categoryReportCounts: Record<string, number>;
  favoriteCount: number;
}

const CategoryFilter = ({ 
  categories, 
  activeCategory, 
  onCategoryChange, 
  categoryReportCounts,
  favoriteCount 
}: CategoryFilterProps) => {
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
        <Button
          key={category}
          variant={activeCategory === category ? "ocean" : "ocean-outline"}
          onClick={() => onCategoryChange(category)}
          className={`h-10 px-4 rounded-md text-sm font-medium transition-all flex items-center gap-2`}
        >
          <span>{category}</span>
          <Badge 
            variant="secondary" 
            className={`h-5 px-1.5 text-xs font-medium min-w-[20px] flex items-center justify-center ${
              activeCategory === category
                ? 'bg-white/20 text-white border-0'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {getReportCount(category)}
          </Badge>
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
