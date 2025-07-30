
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabaseReportsService } from '@/services/reports';
import { useProductFilter } from '@/contexts/ProductFilterContext';
import HelpTooltip from '@/components/shared/HelpTooltip';
import RenewalMetricsCards from './renewal-performance/RenewalMetricsCards';
import AutoVsManualChart from './renewal-performance/AutoVsManualChart';
import RenewalTrendsChart from './renewal-performance/RenewalTrendsChart';
import CampaignPerformanceTable from './renewal-performance/CampaignPerformanceTable';
import AnalysisSummary from './renewal-performance/AnalysisSummary';
import ScrollToTopButton from '@/components/ui/ScrollToTopButton';

interface RenewalPerformanceReportProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  selectedPeriod?: string;
}

const RenewalPerformanceReport: React.FC<RenewalPerformanceReportProps> = ({
  dateRange,
  selectedPeriod
}) => {
  const {
    selectedProducts,
    selectedBusinessUnits,
    isAllProductsSelected,
    isAllBusinessUnitsSelected
  } = useProductFilter();

  // Use React Query to fetch real renewal performance data from Supabase
  const { data: renewalReportData, isLoading, error } = useQuery({
    queryKey: ['renewal-performance', { 
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange 
    }],
    queryFn: () => supabaseReportsService.getRenewalData({
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange
    })
  });

  if (isLoading) {
    return <div className="animate-fade-in">Loading renewal performance data...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error loading renewal performance data</div>;
  }

  const {
    renewalData = {
      firstTimeRenewals: { total: 0, successful: 0, rate: 0 },
      multiTimeRenewals: { total: 0, successful: 0, rate: 0 },
      autoRenewals: { total: 0, successful: 0, rate: 0 },
      manualRenewals: { total: 0, successful: 0, rate: 0 }
    },
    renewalTrendData = [],
    renewalTypeData = [],
    campaignData = []
  } = renewalReportData || {};
  
  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-12 bg-blue-50 border-b border-gray-200 rounded-none p-0">
          <TabsTrigger 
            value="overview"
            className="data-[state=active]:bg-ocean-600 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-ocean-600 text-gray-600 hover:text-gray-900 px-6 py-3 rounded-none border-b-2 border-transparent transition-all duration-200 font-medium"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="trends"
            className="data-[state=active]:bg-ocean-600 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-ocean-600 text-gray-600 hover:text-gray-900 px-6 py-3 rounded-none border-b-2 border-transparent transition-all duration-200 font-medium"
          >
            Trends
          </TabsTrigger>
          <TabsTrigger 
            value="campaigns"
            className="data-[state=active]:bg-ocean-600 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-ocean-600 text-gray-600 hover:text-gray-900 px-6 py-3 rounded-none border-b-2 border-transparent transition-all duration-200 font-medium"
          >
            Campaigns
          </TabsTrigger>
          <TabsTrigger 
            value="analysis"
            className="data-[state=active]:bg-ocean-600 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-ocean-600 text-gray-600 hover:text-gray-900 px-6 py-3 rounded-none border-b-2 border-transparent transition-all duration-200 font-medium"
          >
            Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <RenewalMetricsCards renewalData={renewalData} />
          <AutoVsManualChart renewalTypeData={renewalTypeData} />
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <RenewalTrendsChart renewalTrendData={renewalTrendData} />
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <CampaignPerformanceTable campaignData={campaignData} />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <AnalysisSummary />
        </TabsContent>
      </Tabs>
      
      <ScrollToTopButton />
    </div>
  );
};

export default RenewalPerformanceReport;
