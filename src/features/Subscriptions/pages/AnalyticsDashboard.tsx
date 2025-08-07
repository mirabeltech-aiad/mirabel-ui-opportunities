import React, { Suspense } from 'react';
import { DashboardSkeleton } from '../components/ui/dashboard-skeleton';
import { ProductFilterProvider } from '../contexts/ProductFilterContext';
import { PerformanceAnalytics } from '../utils/performanceAnalytics';
import ScrollToTopButton from '../components/ui/ScrollToTopButton';

const AnalyticsDashboardContent = React.lazy(() => 
  import('../features/analytics/components/AnalyticsDashboard').then(module => ({
    default: module.default
  }))
);

// Named export for consistency
export const AnalyticsDashboardPage = () => {
  React.useEffect(() => {
    PerformanceAnalytics.markStep('Analytics dashboard page mounted');
    
    return () => {
      PerformanceAnalytics.markStep('Analytics dashboard page unmounted');
    };
  }, []);

  return (
    <ProductFilterProvider>
      <div className="min-h-screen bg-gray-50">
        <Suspense fallback={
          <div>
            <div>Loading analytics dashboard...</div>
            <DashboardSkeleton />
          </div>
        }>
          <AnalyticsDashboardContent />
        </Suspense>
        <ScrollToTopButton />
      </div>
    </ProductFilterProvider>
  );
};

export default AnalyticsDashboardPage;