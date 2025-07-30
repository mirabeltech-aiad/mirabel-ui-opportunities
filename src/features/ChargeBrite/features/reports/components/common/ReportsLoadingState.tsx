/**
 * @fileoverview Loading State Component for Reports Feature
 * 
 * Provides consistent loading indicators and skeleton screens for the reports feature.
 * Used throughout the reports module to maintain visual consistency during data loading.
 * 
 * @example
 * ```tsx
 * <ReportsLoadingState type="grid" count={6} />
 * <ReportsLoadingState type="list" count={3} />
 * ```
 */

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ReportsLoadingStateProps {
  /** Type of loading display */
  type?: 'grid' | 'list' | 'single' | 'spinner';
  /** Number of skeleton items to show */
  count?: number;
  /** Loading message to display */
  message?: string;
  /** Custom className for styling */
  className?: string;
}

/**
 * Skeleton card component for loading states
 */
const SkeletonCard: React.FC = () => (
  <Card className="bg-white shadow-sm border border-gray-200 rounded-lg animate-pulse">
    <CardHeader>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="h-8 bg-gray-200 rounded w-1/3 mt-4"></div>
      </div>
    </CardContent>
  </Card>
);

/**
 * Skeleton list item component for loading states
 */
const SkeletonListItem: React.FC = () => (
  <div className="p-4 border border-gray-200 rounded-lg animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-20"></div>
    </div>
  </div>
);

/**
 * Spinner loading component
 */
const SpinnerLoader: React.FC<{ message?: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-12 space-y-4">
    <Loader2 className="h-8 w-8 animate-spin text-ocean-500" />
    <p className="text-gray-600 text-sm">
      {message || 'Loading reports...'}
    </p>
  </div>
);

/**
 * Main loading state component for reports
 */
const ReportsLoadingState: React.FC<ReportsLoadingStateProps> = ({
  type = 'grid',
  count = 3,
  message,
  className = ''
}) => {
  if (type === 'spinner') {
    return <SpinnerLoader message={message} />;
  }

  if (type === 'single') {
    return (
      <div className={className}>
        <SkeletonCard />
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: count }, (_, index) => (
          <SkeletonListItem key={index} />
        ))}
      </div>
    );
  }

  // Default grid layout
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export default ReportsLoadingState;