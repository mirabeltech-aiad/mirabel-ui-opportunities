/**
 * @fileoverview Empty State Component for Reports Feature
 * 
 * Provides consistent empty state displays for the reports feature.
 * Handles different scenarios like no reports found, no favorites, etc.
 * 
 * @example
 * ```tsx
 * <ReportsEmptyState 
 *   type="no-results" 
 *   title="No reports found"
 *   description="Try adjusting your filters"
 * />
 * ```
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Search, FileText, Filter } from 'lucide-react';
import { OceanButton } from '@/components/ui/design-system';

interface ReportsEmptyStateProps {
  /** Type of empty state to display */
  type?: 'no-results' | 'no-favorites' | 'no-reports' | 'filtered';
  /** Custom title */
  title?: string;
  /** Custom description */
  description?: string;
  /** Optional action button */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Custom className for styling */
  className?: string;
}

/**
 * Gets the appropriate icon based on empty state type
 */
const getEmptyStateIcon = (type: string) => {
  switch (type) {
    case 'no-favorites':
      return Heart;
    case 'no-results':
      return Search;
    case 'filtered':
      return Filter;
    default:
      return FileText;
  }
};

/**
 * Gets default content based on empty state type
 */
const getDefaultContent = (type: string) => {
  switch (type) {
    case 'no-favorites':
      return {
        title: 'No favorite reports yet',
        description: 'Start favoriting reports to see them here'
      };
    case 'no-results':
      return {
        title: 'No reports found',
        description: 'Try adjusting your search terms or filters'
      };
    case 'filtered':
      return {
        title: 'No reports match your filters',
        description: 'Try adjusting your category or search criteria'
      };
    default:
      return {
        title: 'No reports available',
        description: 'Reports will appear here when they become available'
      };
  }
};

/**
 * Empty state component for reports feature
 */
const ReportsEmptyState: React.FC<ReportsEmptyStateProps> = ({
  type = 'no-reports',
  title,
  description,
  action,
  className = ''
}) => {
  const Icon = getEmptyStateIcon(type);
  const defaultContent = getDefaultContent(type);
  
  const displayTitle = title || defaultContent.title;
  const displayDescription = description || defaultContent.description;

  return (
    <Card className={`bg-white shadow-sm border border-gray-200 rounded-lg ${className}`}>
      <CardContent className="p-12 text-center">
        <div className="space-y-4">
          {/* Icon */}
          <div className="flex justify-center">
            <Icon className="h-12 w-12 text-gray-300" />
          </div>
          
          {/* Title */}
          <h3 className="text-lg font-medium text-gray-600">
            {displayTitle}
          </h3>
          
          {/* Description */}
          <p className="text-gray-400 max-w-md mx-auto">
            {displayDescription}
          </p>
          
          {/* Optional Action Button */}
          {action && (
            <div className="pt-4">
              <OceanButton
                variant="primary"
                size="sm"
                onClick={action.onClick}
              >
                {action.label}
              </OceanButton>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportsEmptyState;