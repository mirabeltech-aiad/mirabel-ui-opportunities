
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabaseReportsService } from '@/services/reports';
import { useProductFilter } from '@/contexts/ProductFilterContext';
import DeferredRevenueTiles from './deferred-revenue/DeferredRevenueTiles';
import RevenueTrendsChart from './deferred-revenue/RevenueTrendsChart';
import CustomerSchedulesTable from './deferred-revenue/CustomerSchedulesTable';
import { HelpTooltip } from '@/components';

interface DeferredRevenueReportProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  selectedPeriod?: string;
}

const DeferredRevenueReport: React.FC<DeferredRevenueReportProps> = ({
  dateRange,
  selectedPeriod
}) => {
  const {
    selectedProducts,
    selectedBusinessUnits,
    isAllProductsSelected,
    isAllBusinessUnitsSelected
  } = useProductFilter();

  // Use React Query to fetch real deferred revenue data from Supabase
  const {
    data: deferredRevenueData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['deferred-revenue', {
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange
    }],
    queryFn: () => supabaseReportsService.getDeferredRevenueData({
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange
    })
  });

  if (isLoading) {
    return <div className="animate-fade-in">Loading deferred revenue data...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error loading deferred revenue data</div>;
  }

  const {
    currentDeferredRevenue = 0,
    totalRecognizedRevenue = 0,
    recognitionRate = 0,
    activeContractsCount = 0,
    deferredGrowth = 0,
    revenueTrends = [],
    customerSchedules = []
  } = deferredRevenueData || {};

  return (
    <div className="space-y-6">
      {/* Deferred Revenue Tiles */}

      <DeferredRevenueTiles 
        currentDeferredRevenue={currentDeferredRevenue} 
        totalRecognizedRevenue={totalRecognizedRevenue} 
        recognitionRate={recognitionRate} 
        activeContractsCount={activeContractsCount} 
        deferredGrowth={deferredGrowth} 
      />

      <RevenueTrendsChart data={revenueTrends} />

      <CustomerSchedulesTable data={customerSchedules} />
    </div>
  );
};

export default DeferredRevenueReport;
