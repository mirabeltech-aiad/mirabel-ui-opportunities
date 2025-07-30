
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CohortChurnMetricsCards from './churn-cohort/CohortChurnMetricsCards';
import CohortRetentionHeatmap from './churn-cohort/CohortRetentionHeatmap';
import CohortLifetimeTrends from './churn-cohort/CohortLifetimeTrends';
import CohortChurnPrediction from './churn-cohort/CohortChurnPrediction';
import CohortSegmentAnalysis from './churn-cohort/CohortSegmentAnalysis';
import CohortRevenueImpact from './churn-cohort/CohortRevenueImpact';
import CohortBehaviorComparison from './churn-cohort/CohortBehaviorComparison';
import CohortRiskAnalysis from './churn-cohort/CohortRiskAnalysis';

import { useQuery } from '@tanstack/react-query';
import { supabaseReportsService } from '@/services/reports';
import { useProductFilter } from '@/contexts/ProductFilterContext';
import { HelpTooltip } from '@/components';

interface ChurnByCohortReportProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
}

const ChurnByCohortReport: React.FC<ChurnByCohortReportProps> = ({ 
  dateRange 
}) => {
  const {
    selectedProducts,
    selectedBusinessUnits,
    isAllProductsSelected,
    isAllBusinessUnitsSelected
  } = useProductFilter();

  // Use React Query to fetch real churn by cohort data from Supabase
  const { data: cohortData, isLoading, error } = useQuery({
    queryKey: ['churn-by-cohort', { 
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange 
    }],
    queryFn: () => supabaseReportsService.getChurnByCohortData({
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange
    })
  });

  if (isLoading) {
    return <div className="animate-fade-in">Loading churn by cohort data...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error loading churn by cohort data</div>;
  }
  const {
    metrics = {},
    heatmapData = [],
    lifetimeTrends = [],
    predictions = {},
    segmentData = [],
    revenueImpact = {},
    behaviorData = {},
    riskAnalysis = {}
  } = cohortData || {};
  
  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <CohortChurnMetricsCards data={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CohortRetentionHeatmap data={heatmapData} />
        <CohortLifetimeTrends data={lifetimeTrends} />
      </div>

      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="bg-blue-50 w-full grid grid-cols-4 p-1 rounded-md mb-6">
          <TabsTrigger 
            value="analysis" 
            className="flex items-center gap-2 px-4 py-3 text-muted-foreground rounded-sm transition-colors data-[state=active]:bg-ocean-gradient data-[state=active]:text-white"
          >
            Analysis
          </TabsTrigger>
          <TabsTrigger 
            value="segments" 
            className="flex items-center gap-2 px-4 py-3 text-muted-foreground rounded-sm transition-colors data-[state=active]:bg-ocean-gradient data-[state=active]:text-white"
          >
            Segments
          </TabsTrigger>
          <TabsTrigger 
            value="revenue" 
            className="flex items-center gap-2 px-4 py-3 text-muted-foreground rounded-sm transition-colors data-[state=active]:bg-ocean-gradient data-[state=active]:text-white"
          >
            Revenue Impact
          </TabsTrigger>
          <TabsTrigger 
            value="predictions" 
            className="flex items-center gap-2 px-4 py-3 text-muted-foreground rounded-sm transition-colors data-[state=active]:bg-ocean-gradient data-[state=active]:text-white"
          >
            Predictions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CohortBehaviorComparison data={behaviorData} />
            <CohortRiskAnalysis data={riskAnalysis} />
          </div>
        </TabsContent>

        <TabsContent value="segments" className="space-y-6">
          <CohortSegmentAnalysis data={segmentData} />
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <CohortRevenueImpact data={revenueImpact} />
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <CohortChurnPrediction data={predictions} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChurnByCohortReport;
