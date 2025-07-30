import React from 'react';
import ProductFilter from '@/components/filters/ProductFilter';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { PerformanceAnalytics } from '@/utils/performanceAnalytics';
import ScrollToTopButton from '@/components/ui/ScrollToTopButton';
import { BarChart3, DollarSign } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';

// Direct lazy imports - now using feature components
const LazyCirculationOverview = React.lazy(() => import('../analytics/CirculationOverview'));
const LazyInteractiveTrendsChart = React.lazy(() => import('../analytics/InteractiveTrendsChart'));
const LazyGrowthMetrics = React.lazy(() => import('../analytics/GrowthMetrics'));
const LazyChurnAnalysis = React.lazy(() => import('@/components/circulation/ChurnAnalysis'));
const LazySubscriptionLifecycleTracker = React.lazy(() => import('@/components/circulation/SubscriptionLifecycleTracker'));
const LazyGeographicDistribution = React.lazy(() => import('@/components/circulation/GeographicDistribution'));
const LazyCirculationRevenueDashboard = React.lazy(() => import('../revenue/CirculationRevenueDashboard'));

const CirculationDashboardContent = () => {
  const [activeTab, setActiveTab] = React.useState('circulation');
  React.useEffect(() => {
    PerformanceAnalytics.markStep('CirculationDashboardContent mounted');
    PerformanceAnalytics.startMeasurement('Initial dashboard render');
    const timer = setTimeout(() => {
      PerformanceAnalytics.endMeasurement('Initial dashboard render');
      PerformanceAnalytics.markStep('Critical content loaded');
    }, 100);
    return () => {
      clearTimeout(timer);
      PerformanceAnalytics.markStep('CirculationDashboardContent unmounted');
      PerformanceAnalytics.logSummary();
    };
  }, []);
  const [dateRange, setDateRange] = React.useState<{
    startDate?: Date;
    endDate?: Date;
  }>({});
  const handleDateRangeChange = React.useCallback((startDate?: Date, endDate?: Date) => {
    PerformanceAnalytics.startMeasurement('DateRangeChange');
    setDateRange({
      startDate,
      endDate
    });
    PerformanceAnalytics.endMeasurement('DateRangeChange');
  }, []);
  return <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ocean-800 mb-2">
          Circulation Dashboard
        </h1>
        <p className="text-gray-600">
          Comprehensive analytics for circulation, growth, and revenue management
        </p>
      </div>
      
      <ProductFilter dateRange={dateRange} onDateRangeChange={handleDateRangeChange} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="w-full grid grid-cols-2 mb-6 bg-blue-50 p-1 rounded-md">
          <button onClick={() => setActiveTab('circulation')} className={`flex items-center gap-2 px-4 py-3 rounded-sm transition-colors ${activeTab === 'circulation' ? 'bg-ocean-gradient text-white' : 'text-muted-foreground hover:text-gray-900'}`}>
            <BarChart3 className="h-4 w-4" />
            Circulation Analytics
          </button>
          <button onClick={() => setActiveTab('revenue')} className={`flex items-center gap-2 px-4 py-3 rounded-sm transition-colors ${activeTab === 'revenue' ? 'bg-ocean-gradient text-white' : 'text-muted-foreground hover:text-gray-900'}`}>
            <DollarSign className="h-4 w-4" />
            Revenue Analytics
          </button>
        </div>
        
        <TabsContent value="circulation" className="space-y-8">
          <React.Suspense fallback={<Skeleton className="h-32 bg-gray-100 animate-pulse rounded-lg" />}>
            <LazyCirculationOverview />
          </React.Suspense>
          
          <React.Suspense fallback={<Skeleton className="h-96 bg-gray-100 animate-pulse rounded-lg" />}>
            <LazyInteractiveTrendsChart />
          </React.Suspense>
          
          <React.Suspense fallback={<Skeleton className="h-96 bg-gray-100 animate-pulse rounded-lg" />}>
            <LazySubscriptionLifecycleTracker />
          </React.Suspense>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <React.Suspense fallback={<Skeleton className="h-64 bg-gray-100 animate-pulse rounded-lg" />}>
              <LazyGrowthMetrics />
            </React.Suspense>
            <React.Suspense fallback={<Skeleton className="h-64 bg-gray-100 animate-pulse rounded-lg" />}>
              <LazyChurnAnalysis />
            </React.Suspense>
          </div>
          
          <React.Suspense fallback={<Skeleton className="h-96 bg-gray-100 animate-pulse rounded-lg" />}>
            <LazyGeographicDistribution />
          </React.Suspense>
        </TabsContent>
        
        <TabsContent value="revenue" className="space-y-8">
          <React.Suspense fallback={<Skeleton className="h-96 bg-gray-100 animate-pulse rounded-lg" />}>
            <LazyCirculationRevenueDashboard />
          </React.Suspense>
        </TabsContent>
      </Tabs>
      
      <ScrollToTopButton />
    </main>;
};
export default CirculationDashboardContent;