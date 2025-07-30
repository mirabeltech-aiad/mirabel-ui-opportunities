import React from 'react';
import CrossSellMetricsCards from './cross-sell/CrossSellMetricsCards';
import CrossSellTrendChart from './cross-sell/CrossSellTrendChart';
import CrossSellTimeDistributionChart from './cross-sell/CrossSellTimeDistributionChart';
import CrossSellProductCombinationsChart from './cross-sell/CrossSellProductCombinationsChart';
import CrossSellSegmentAnalysis from './cross-sell/CrossSellSegmentAnalysis';
import CrossSellAffinityMatrix from './cross-sell/CrossSellAffinityMatrix';
import CrossSellCustomerJourney from './cross-sell/CrossSellCustomerJourney';
import CrossSellInsights from './cross-sell/CrossSellInsights';
import { HelpTooltip } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { supabaseReportsService } from '@/services/reports';
import { useProductFilter } from '@/contexts/ProductFilterContext';

interface CrossSellAttachRateReportProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  selectedPeriod?: string;
}

const CrossSellAttachRateReport: React.FC<CrossSellAttachRateReportProps> = ({
  dateRange,
  selectedPeriod
}) => {
  const {
    selectedProducts,
    selectedBusinessUnits,
    isAllProductsSelected,
    isAllBusinessUnitsSelected
  } = useProductFilter();

  // Use React Query to fetch real Cross-sell Attach Rate data from Supabase
  const { data: crossSellData, isLoading, error } = useQuery({
    queryKey: ['cross-sell-attach-rate', { 
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange 
    }],
    queryFn: () => supabaseReportsService.getCrossSellAttachRateData({
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange
    })
  });

  if (isLoading) {
    return <div className="animate-fade-in">Loading Cross-sell Attach Rate data...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error loading Cross-sell Attach Rate data</div>;
  }

  const {
    overallAttachRate = 0,
    crossSellRevenue = 0,
    avgProductsPerCustomer = 0,
    trendData = [],
    productCombinationData = [],
    segmentData = [],
    timeToXSellData = [],
    affinityMatrix = [],
    crossSellJourneyData = []
  } = crossSellData || {};

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      {/* Key Metrics Cards */}
      <CrossSellMetricsCards overallAttachRate={overallAttachRate} crossSellRevenue={crossSellRevenue} avgProductsPerCustomer={avgProductsPerCustomer} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CrossSellTrendChart data={trendData} />
        <CrossSellTimeDistributionChart data={timeToXSellData} />
      </div>

      {/* Product Combinations Performance */}
      <CrossSellProductCombinationsChart data={productCombinationData} />

      {/* Segment Analysis */}
      <CrossSellSegmentAnalysis data={segmentData} />

      {/* Product Affinity Matrix */}
      <CrossSellAffinityMatrix data={affinityMatrix} />

      {/* Customer Cross-sell Journey Table */}
      <CrossSellCustomerJourney data={crossSellJourneyData} />

      {/* Key Insights */}
      <CrossSellInsights />
    </div>
  );
};

export default CrossSellAttachRateReport;
