import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabaseReportsService } from '../../services/reports';
import { useProductFilter } from '../../contexts/ProductFilterContext';
import ProductFilter from '../filters/ProductFilter';
import TrialConversionSummaryCard from './trial-conversion-new/TrialConversionSummaryCard';
import TrialConversionChannelChart from './trial-conversion-new/TrialConversionChannelChart';
import TrialConversionDetailsTable from './trial-conversion-new/TrialConversionDetailsTable';
import HelpTooltip from '../../components/shared/HelpTooltip';

const TrialConversionReport = () => {
  const {
    selectedProducts,
    selectedBusinessUnits,
    isAllProductsSelected,
    isAllBusinessUnitsSelected
  } = useProductFilter();

  const [dateRange, setDateRange] = React.useState<{
    startDate?: Date;
    endDate?: Date;
  }>({});

  const handleDateRangeChange = React.useCallback((startDate?: Date, endDate?: Date) => {
    setDateRange({
      startDate,
      endDate
    });
  }, []);

  // Use React Query to fetch real trial data from Supabase
  const { data: trialsData, isLoading } = useQuery({
    queryKey: ['trials', { 
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange 
    }],
    queryFn: () => supabaseReportsService.getTrialData({
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange
    })
  });

  if (isLoading) {
    return <div>Loading trial conversion report...</div>;
  }

  const trials = trialsData || [];
  
  // Calculate conversion metrics from real data
  const totalTrials = trials.length;
  const convertedTrials = trials.filter((trial: any) => trial.trial_status === 'converted');
  const totalConversions = convertedTrials.length;
  const overallConversionRate = totalTrials > 0 ? ((totalConversions / totalTrials) * 100).toFixed(1) : '0.0';
  
  // Calculate total revenue from converted trials
  const totalRevenue = convertedTrials.reduce((sum: number, trial: any) => sum + (trial.paid_subscription_value || 0), 0);

  // Group trials by acquisition channel for channel data
  const channelGrouped = trials.reduce((acc: any, trial: any) => {
    const channel = trial.customers?.acquisition_channel || 'Unknown';
    if (!acc[channel]) {
      acc[channel] = { trials: 0, conversions: 0 };
    }
    acc[channel].trials++;
    if (trial.trial_status === 'converted') {
      acc[channel].conversions++;
    }
    return acc;
  }, {});

  // Create channel data with colors for chart
  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];
  const channelData = Object.entries(channelGrouped).map(([channel, data]: [string, any], index) => ({
    channel,
    trials: data.trials,
    conversions: data.conversions,
    conversionRate: data.trials > 0 ? parseFloat(((data.conversions / data.trials) * 100).toFixed(1)) : 0,
    fill: colors[index % colors.length]
  }));

  // Format trial data for the details table
  const trialData = trials.map((trial: any) => ({
    id: trial.id.slice(0, 8), // Shorten UUID for display
    userEmail: trial.customers?.email || 'N/A',
    trialStartDate: trial.trial_start_date,
    conversionDate: trial.conversion_date,
    channel: trial.customers?.acquisition_channel || 'Unknown',
    behaviorScore: trial.engagement_score || 0,
    resultingPlan: trial.trial_status === 'converted' ? 'Premium Plan' : null,
    revenue: trial.paid_subscription_value || 0
  }));

  return (
    <div className="space-y-6">

      {/* Summary Card */}
      <TrialConversionSummaryCard
        totalTrials={totalTrials}
        totalConversions={totalConversions}
        overallConversionRate={overallConversionRate}
        totalRevenue={totalRevenue}
      />

      {/* Conversion Rate by Channel Chart */}
      <TrialConversionChannelChart channelData={channelData} />

      {/* Trial Details Table */}
      <TrialConversionDetailsTable trialData={trialData} />
    </div>
  );
};

export default TrialConversionReport;