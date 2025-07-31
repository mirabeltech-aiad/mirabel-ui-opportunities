import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Lazy load revenue components
const RevenueOverview = React.lazy(() => import('../../components/circulation/RevenueOverview'));
const AcquisitionChannelRevenue = React.lazy(() => import('./AcquisitionChannelRevenue'));
const SubscriptionTypeRevenue = React.lazy(() => import('../../components/circulation/SubscriptionTypeRevenue'));
const GeographicRevenueDistribution = React.lazy(() => import('../../components/circulation/GeographicRevenueDistribution'));
const RevenueAttribution = React.lazy(() => import('../../components/circulation/RevenueAttribution'));

const CirculationRevenueDashboard = () => {
  return (
    <div className="space-y-6">
      <React.Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse rounded-lg" />}>
        <RevenueOverview />
      </React.Suspense>

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
          <React.Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg" />}>
            <RevenueAttribution />
          </React.Suspense>
        </TabsContent>
        
        <TabsContent value="channels" className="space-y-6">
          <React.Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg" />}>
            <AcquisitionChannelRevenue />
          </React.Suspense>
        </TabsContent>
        
        <TabsContent value="types" className="space-y-6">
          <React.Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg" />}>
            <SubscriptionTypeRevenue />
          </React.Suspense>
        </TabsContent>
        
        <TabsContent value="geography" className="space-y-6">
          <React.Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg" />}>
            <GeographicRevenueDistribution />
          </React.Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CirculationRevenueDashboard;