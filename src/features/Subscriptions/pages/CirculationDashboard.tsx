
import React, { Suspense } from 'react';
import { DashboardSkeleton } from '../components/ui/dashboard-skeleton';
import { PerformanceAnalytics } from '../utils/performanceAnalytics';
import { ProductFilterProvider } from '../contexts/ProductFilterContext';
import ScrollToTopButton from '../components/ui/ScrollToTopButton';

// Updated import to use new feature structure
const CirculationDashboardContent = React.lazy(() => 
  import('../components/dashboard/CirculationDashboard')
);

const CirculationDashboard = () => {
  React.useEffect(() => {
    PerformanceAnalytics.startMeasurement('CirculationDashboard page load');
    PerformanceAnalytics.markStep('CirculationDashboard component mounted');
    
    return () => {
      PerformanceAnalytics.endMeasurement('CirculationDashboard page load');
    };
  }, []);

  return (
    <ProductFilterProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Suspense fallback={<DashboardSkeleton />}>
          <CirculationDashboardContent />
        </Suspense>
        <ScrollToTopButton />
      </div>
    </ProductFilterProvider>
  );
};

export default CirculationDashboard;
