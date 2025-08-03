
import { Suspense, lazy } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Lazy load revenue components
const RevenueOverview = lazy(() => import('./RevenueOverview'));
const AcquisitionChannelRevenue = lazy(() => import('./AcquisitionChannelRevenue'));
const SubscriptionTypeRevenue = lazy(() => import('./SubscriptionTypeRevenue'));
const GeographicRevenueDistribution = lazy(() => import('./GeographicRevenueDistribution'));
const RevenueAttribution = lazy(() => import('./RevenueAttribution'));

const CirculationRevenueDashboard = () => {
  return (
    <div className="space-y-6">
      <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse rounded-lg" />}>
        <RevenueOverview />
      </Suspense>

      <Tabs defaultValue="attribution" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-blue-50">
          <TabsTrigger value="attribution" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white text-muted-foreground hover:text-gray-900">
            Attribution
          </TabsTrigger>
          <TabsTrigger value="channels" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white text-muted-foreground hover:text-gray-900">
            Channels
          </TabsTrigger>
          <TabsTrigger value="types" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white text-muted-foreground hover:text-gray-900">
            Subscription Types
          </TabsTrigger>
          <TabsTrigger value="geography" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white text-muted-foreground hover:text-gray-900">
            Geography
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="attribution" className="space-y-6">
          <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg" />}>
            <RevenueAttribution />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="channels" className="space-y-6">
          <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg" />}>
            <AcquisitionChannelRevenue />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="types" className="space-y-6">
          <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg" />}>
            <SubscriptionTypeRevenue />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="geography" className="space-y-6">
          <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg" />}>
            <GeographicRevenueDistribution />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CirculationRevenueDashboard;
