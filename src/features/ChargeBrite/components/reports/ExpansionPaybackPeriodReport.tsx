import React from 'react';
import ExpansionMetricsCards from './expansion-payback/ExpansionMetricsCards';
import PaybackDistributionChart from './expansion-payback/PaybackDistributionChart';
import ROITrendChart from './expansion-payback/ROITrendChart';
import ExpansionTypePerformance from './expansion-payback/ExpansionTypePerformance';
import InvestmentBreakdownChart from './expansion-payback/InvestmentBreakdownChart';
import ChannelPerformanceTable from './expansion-payback/ChannelPerformanceTable';
import ExpansionDealsTable from './expansion-payback/ExpansionDealsTable';
import ExpansionInsights from './expansion-payback/ExpansionInsights';
import { useQuery } from '@tanstack/react-query';
import { supabaseReportsService } from '@/services/reports';
import { useProductFilter } from '@/contexts/ProductFilterContext';
interface ExpansionPaybackPeriodReportProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  selectedPeriod?: string;
}
const ExpansionPaybackPeriodReport: React.FC<ExpansionPaybackPeriodReportProps> = ({
  dateRange,
  selectedPeriod
}) => {
  const {
    selectedProducts,
    selectedBusinessUnits,
    isAllProductsSelected,
    isAllBusinessUnitsSelected
  } = useProductFilter();

  // Use React Query to fetch real Expansion Payback data from Supabase
  const { data: paybackData, isLoading, error } = useQuery({
    queryKey: ['expansion-payback-period', { 
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange 
    }],
    queryFn: () => supabaseReportsService.getExpansionPaybackPeriodData({
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange
    })
  });

  if (isLoading) {
    return <div className="animate-fade-in">Loading Expansion Payback Period data...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error loading Expansion Payback Period data</div>;
  }

  const {
    expansionDeals = [],
    totalInvestment = 0,
    totalMonthlyRevenue = 0,
    avgPaybackPeriod = 0,
    overallROI = 0,
    dealsThisMonth = 0,
    paybackDistribution = [],
    roiTrendData = [],
    expansionTypeData = [],
    investmentBreakdown = [],
    channelPerformance = []
  } = paybackData || {};
  return <div className="space-y-6">
      <div className="mb-8">
        
        
      </div>

      {/* Key Metrics Cards */}
      <ExpansionMetricsCards avgPaybackPeriod={avgPaybackPeriod} totalInvestment={totalInvestment} overallROI={overallROI} totalMonthlyRevenue={totalMonthlyRevenue} dealsThisMonth={dealsThisMonth} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PaybackDistributionChart data={paybackDistribution} />
        <ROITrendChart data={roiTrendData} />
      </div>

      {/* Expansion Type Performance */}
      <ExpansionTypePerformance data={expansionTypeData} />

      {/* Investment vs Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InvestmentBreakdownChart data={investmentBreakdown} />
        <ChannelPerformanceTable data={channelPerformance} />
      </div>

      {/* Individual Expansion Deals Table */}
      <ExpansionDealsTable data={expansionDeals} />

      {/* Key Insights */}
      <ExpansionInsights />
    </div>;
};
export default ExpansionPaybackPeriodReport;