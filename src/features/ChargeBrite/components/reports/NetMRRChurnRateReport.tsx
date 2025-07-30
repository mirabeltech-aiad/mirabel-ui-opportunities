import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Users, TrendingUp, Brain } from 'lucide-react';
import NetMRRMetricsCards from './net-mrr-churn/NetMRRMetricsCards';
import NetMRRTrendChart from './net-mrr-churn/NetMRRTrendChart';
import MRRBridgeChart from './net-mrr-churn/MRRBridgeChart';
import SegmentNetMRRChart from './net-mrr-churn/SegmentNetMRRChart';
import CohortNetRetentionChart from './net-mrr-churn/CohortNetRetentionChart';
import CohortNetRetentionTable from './net-mrr-churn/CohortNetRetentionTable';
import ProductMRRAnalysisChart from './net-mrr-churn/ProductMRRAnalysisChart';
import GeographicNetMRRChart from './net-mrr-churn/GeographicNetMRRChart';
import ExpansionOpportunitiesTable from './net-mrr-churn/ExpansionOpportunitiesTable';
import NetRevenueBridgeAnalysis from './net-mrr-churn/NetRevenueBridgeAnalysis';
import PredictiveNetChurnModel from './net-mrr-churn/PredictiveNetChurnModel';
import ScrollToTopButton from '@/components/ui/ScrollToTopButton';
import HelpTooltip from '@/components/shared/HelpTooltip';
import { useQuery } from '@tanstack/react-query';
import { supabaseReportsService } from '@/services/reports';
import { useProductFilter } from '@/contexts/ProductFilterContext';
interface NetMRRChurnRateReportProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  selectedPeriod?: string;
}
const NetMRRChurnRateReport: React.FC<NetMRRChurnRateReportProps> = ({
  dateRange,
  selectedPeriod
}) => {
  const {
    selectedProducts,
    selectedBusinessUnits,
    isAllProductsSelected,
    isAllBusinessUnitsSelected
  } = useProductFilter();

  // Use React Query to fetch real Net MRR Churn data from Supabase
  const { data: netMRRData, isLoading, error } = useQuery({
    queryKey: ['net-mrr-churn-rate', { 
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange 
    }],
    queryFn: () => supabaseReportsService.getNetMRRChurnRateData({
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange
    })
  });

  if (isLoading) {
    return <div className="animate-fade-in">Loading Net MRR Churn Rate data...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error loading Net MRR Churn Rate data</div>;
  }

  const {
    metrics = {},
    trendData = [],
    bridgeData = [],
    segmentData = [],
    cohortData = [],
    productData = [],
    geographicData = [],
    expansionOpportunities = [],
    revenueBridge = [],
    predictiveData = {}
  } = netMRRData || {};

  // Transform the data to match expected interfaces
  const transformedMetrics = {
    grossMRRChurn: metrics.grossMrrChurnRate || 0,
    netMRRChurn: metrics.netMrrChurnRate || 0,
    expansionMRR: (metrics.expansionMrrRate || 0) * 10000,
    netRevenueRetention: metrics.mrrExpansionRatio || 1
  };
  const transformedTrendData = trendData.map(item => ({
    month: item.month,
    grossChurn: item.grossChurnRate,
    netChurn: item.netChurnRate,
    expansion: item.expansionRate
  }));
  const transformedBridgeData = bridgeData.map(item => ({
    category: item.category,
    value: item.value,
    type: item.type === 'churn' ? 'negative' as const : item.type === 'expansion' ? 'positive' as const : 'neutral' as const
  }));
  return <div className="space-y-6">
      <div className="mb-8">
        
        
      </div>

      <NetMRRMetricsCards data={transformedMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="w-full">
          <NetMRRTrendChart data={transformedTrendData} />
        </div>
        <div className="w-full">
          <MRRBridgeChart data={transformedBridgeData} />
        </div>
      </div>

      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="bg-blue-50 grid w-full grid-cols-4">
          <TabsTrigger value="analysis" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white">
            <BarChart3 className="h-4 w-4 text-blue-500 mr-2" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="segments" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white">
            <Users className="h-4 w-4 text-green-500 mr-2" />
            Segments
          </TabsTrigger>
          <TabsTrigger value="cohorts" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white">
            <TrendingUp className="h-4 w-4 text-purple-500 mr-2" />
            Cohorts
          </TabsTrigger>
          <TabsTrigger value="predictions" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white">
            <Brain className="h-4 w-4 text-orange-500 mr-2" />
            Predictions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="w-full">
              <ProductMRRAnalysisChart data={productData} />
            </div>
            <div className="w-full">
              <GeographicNetMRRChart data={geographicData} />
            </div>
          </div>
          <NetRevenueBridgeAnalysis data={revenueBridge} />
        </TabsContent>

        <TabsContent value="segments" className="space-y-6">
          <SegmentNetMRRChart data={segmentData} />
          <ExpansionOpportunitiesTable data={expansionOpportunities} />
        </TabsContent>

        <TabsContent value="cohorts" className="space-y-6">
          <CohortNetRetentionChart data={cohortData} />
          <CohortNetRetentionTable data={cohortData} />
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <PredictiveNetChurnModel data={predictiveData} />
        </TabsContent>
      </Tabs>
      
      <ScrollToTopButton />
    </div>;
};
export default NetMRRChurnRateReport;