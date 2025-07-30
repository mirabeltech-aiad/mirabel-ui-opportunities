import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RevenueChurnMetricsCards from './revenue-churn/RevenueChurnMetricsCards';
import RevenueChurnTrendChart from './revenue-churn/RevenueChurnTrendChart';
import RevenueWaterfallChart from './revenue-churn/RevenueWaterfallChart';
import ChurnBySegmentChart from './revenue-churn/ChurnBySegmentChart';
import ChurnByProductChart from './revenue-churn/ChurnByProductChart';
import GeographicChurnChart from './revenue-churn/GeographicChurnChart';
import HighValueChurnTable from './revenue-churn/HighValueChurnTable';
import RevenueRecoveryAnalysis from './revenue-churn/RevenueRecoveryAnalysis';
import CohortRevenueRetention from './revenue-churn/CohortRevenueRetention';
import PredictiveRiskTable from './revenue-churn/PredictiveRiskTable';
import ScrollToTopButton from '@/components/ui/ScrollToTopButton';
import { useQuery } from '@tanstack/react-query';
import { supabaseReportsService } from '@/services/reports';
import { useProductFilter } from '@/contexts/ProductFilterContext';
interface RevenueChurnRateReportProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  selectedPeriod?: string;
}

const RevenueChurnRateReport: React.FC<RevenueChurnRateReportProps> = ({ dateRange, selectedPeriod }) => {
  const {
    selectedProducts,
    selectedBusinessUnits,
    isAllProductsSelected,
    isAllBusinessUnitsSelected
  } = useProductFilter();

  // Use React Query to fetch real Revenue Churn data from Supabase
  const { data: revenueChurnData, isLoading, error } = useQuery({
    queryKey: ['revenue-churn-rate', { 
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange 
    }],
    queryFn: () => supabaseReportsService.getRevenueChurnRateData({
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange
    })
  });

  if (isLoading) {
    return <div className="animate-fade-in">Loading Revenue Churn Rate data...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error loading Revenue Churn Rate data</div>;
  }

  const {
    metrics = {},
    trendData = [],
    waterfallData = [],
    segmentData = [],
    productData = [],
    geographicData = [],
    highValueChurn = [],
    recoveryData = [],
    cohortRetention = [],
    predictiveRisk = []
  } = revenueChurnData || {};
  return <div className="space-y-6">
      <div className="mb-8">
        
        
      </div>

      {/* Key Metrics Dashboard */}
      <RevenueChurnMetricsCards metrics={metrics} />

      {/* Charts and Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChurnTrendChart data={trendData} />
        <RevenueWaterfallChart data={waterfallData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChurnBySegmentChart data={segmentData} />
        <ChurnByProductChart data={productData} />
        <GeographicChurnChart data={geographicData} />
      </div>

      {/* Detailed Analysis */}
      <Tabs defaultValue="high-value" className="w-full">
        <TabsList className="bg-blue-50 grid w-full grid-cols-4">
          <TabsTrigger value="high-value" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white">High-Value Churn</TabsTrigger>
          <TabsTrigger value="recovery" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white">Revenue Recovery</TabsTrigger>
          <TabsTrigger value="cohort" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white">Cohort Retention</TabsTrigger>
          <TabsTrigger value="predictive" className="data-[state=active]:bg-ocean-gradient data-[state=active]:text-white">Risk Scoring</TabsTrigger>
        </TabsList>

        <TabsContent value="high-value" className="space-y-6">
          <HighValueChurnTable data={highValueChurn} />
        </TabsContent>

        <TabsContent value="recovery" className="space-y-6">
          <RevenueRecoveryAnalysis data={recoveryData} />
        </TabsContent>

        <TabsContent value="cohort" className="space-y-6">
          <CohortRevenueRetention data={cohortRetention} />
        </TabsContent>

        <TabsContent value="predictive" className="space-y-6">
          <PredictiveRiskTable data={predictiveRisk} />
        </TabsContent>
      </Tabs>

      {/* Key Insights Summary */}
      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
        <h3 className="text-lg font-semibold mb-4 text-ocean-800">Key Insights &amp; Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3 text-ocean-700">Revenue Impact Highlights</h4>
            <ul className="text-sm space-y-2 text-gray-700">
              <li>• Gross revenue churn rate of {metrics.grossRevenueChurn?.toFixed(1) || 8.2}% indicates significant revenue loss</li>
              <li>• Net revenue churn of {metrics.netRevenueChurn?.toFixed(1) || 3.1}% shows expansion partially offsets losses</li>
              <li>• Enterprise customers have lowest churn rates</li>
              <li>• Product downgrades account for significant revenue churn</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-ocean-700">Action Items</h4>
            <ul className="text-sm space-y-2 text-gray-700">
              <li>• Focus retention efforts on high-value customers</li>
              <li>• Implement proactive outreach for accounts showing usage decline</li>
              <li>• Develop win-back campaigns for recently churned customers</li>
              <li>• Address product gaps causing downgrades</li>
            </ul>
          </div>
        </div>
      </div>
      
      <ScrollToTopButton />
    </div>;
};
export default RevenueChurnRateReport;