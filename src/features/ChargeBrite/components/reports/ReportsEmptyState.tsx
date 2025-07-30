
import React from 'react';
import { Heart } from 'lucide-react';
import { components } from '@/tokens';

interface ReportsEmptyStateProps {
  activeCategory: string;
}

const ReportsEmptyState: React.FC<ReportsEmptyStateProps> = ({ activeCategory }) => {
  return (
    <div 
      className="border border-gray-200 p-12 text-center"
      style={{ 
        backgroundColor: components.cards.large.background,
        borderRadius: components.cards.large.borderRadius,
        boxShadow: components.cards.large.shadow
      }}
    >
      {activeCategory === 'Favorites' ? (
        <>
          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No favorite reports yet</h3>
          <p className="text-gray-400">Start favoriting reports to see them here</p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-medium text-gray-600 mb-2">No reports found</h3>
          <p className="text-gray-400">Try adjusting your search terms or category filter</p>
        </>
      )}
    </div>
  );
};

export default ReportsEmptyState;
