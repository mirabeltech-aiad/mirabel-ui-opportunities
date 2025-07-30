import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabaseReportsService } from '../../services/reports';
import { useProductFilter } from '../../contexts/ProductFilterContext';
import { HelpTooltip } from '../../components';
import ExpirationSummaryCards from './expiration-forecast/ExpirationSummaryCards';
import ExpirationTimelineChart from './expiration-forecast/ExpirationTimelineChart';
import ExpirationDetailsTable from './expiration-forecast/ExpirationDetailsTable';
import ExpirationActionItems from './expiration-forecast/ExpirationActionItems';

interface ExpirationForecastReportProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  selectedPeriod?: string;
}

const ExpirationForecastReport: React.FC<ExpirationForecastReportProps> = ({ dateRange, selectedPeriod }) => {
  const {
    selectedProducts,
    selectedBusinessUnits,
    isAllProductsSelected,
    isAllBusinessUnitsSelected
  } = useProductFilter();

  // Use React Query to fetch real expiration data from Supabase
  const { data: expirationData, isLoading, error } = useQuery({
    queryKey: ['expiration-forecast', { 
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange 
    }],
    queryFn: () => supabaseReportsService.getExpirationForecastData({
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange
    })
  });

  if (isLoading) {
    return <div className="animate-fade-in">Loading expiration forecast...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error loading expiration data</div>;
  }

  const data = expirationData || {
    expiring30Days: 0,
    expiring60Days: 0, 
    expiring90Days: 0,
    totalExpiring: 0,
    expirationDetails: []
  };

  // Transform data for the timeline chart
  const timelineData = [
    {
      period: '0-30 days',
      count: data.expiring30Days,
      autoRenew: Math.floor(data.expiring30Days * 0.7), // Mock 70% auto-renewal
      manual: Math.floor(data.expiring30Days * 0.3)
    },
    {
      period: '31-60 days', 
      count: data.expiring60Days,
      autoRenew: Math.floor(data.expiring60Days * 0.7),
      manual: Math.floor(data.expiring60Days * 0.3)
    },
    {
      period: '61-90 days',
      count: data.expiring90Days,
      autoRenew: Math.floor(data.expiring90Days * 0.7), 
      manual: Math.floor(data.expiring90Days * 0.3)
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}

      <div className="space-y-6 animate-fade-in">
        <ExpirationSummaryCards 
          expiring30Days={Array(data.expiring30Days).fill({})}
          expiring60Days={Array(data.expiring60Days).fill({})}
          expiring90Days={Array(data.expiring90Days).fill({})}
        />

        <ExpirationTimelineChart summaryData={timelineData} />

        <ExpirationDetailsTable subscriptions={data.expirationDetails as any} />

        <ExpirationActionItems />
      </div>
    </div>
  );
};

export default ExpirationForecastReport;