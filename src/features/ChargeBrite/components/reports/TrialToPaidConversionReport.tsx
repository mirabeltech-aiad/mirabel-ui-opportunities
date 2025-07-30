
import { useState } from 'react';
import TrialConversionSummaryCards from './trial-conversion/TrialConversionSummaryCards';
import ConversionTrendsChart from './trial-conversion/ConversionTrendsChart';
import ConversionTimeDistribution from './trial-conversion/ConversionTimeDistribution';
import ConversionBySourceTable from './trial-conversion/ConversionBySourceTable';
import RetentionAnalysisChart from './trial-conversion/RetentionAnalysisChart';
import { TrialDetailsTable } from './trial-conversion/TrialDetailsTable';
import { KeyInsightsCard } from './trial-conversion/KeyInsightsCard';

import ScrollToTopButton from '../ui/ScrollToTopButton';
import HelpTooltip from '../shared/HelpTooltip';

interface TrialToPaidConversionReportProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  selectedPeriod?: string;
}

const TrialToPaidConversionReport: React.FC<TrialToPaidConversionReportProps> = ({
  dateRange,
  selectedPeriod
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  
  const summary = { totalTrials: 0, conversionRate: 0, averageConversionTime: 0, retentionRate90Days: 0 };
  const trialData: any[] = [];
  const monthlyConversionTrends: any[] = [];
  const conversionBySource: any[] = [];
  const retentionData: any[] = [];
  const conversionTimeDistribution: any[] = [];
  const insights = { conversionRate: 0, conversionTiming: '', retentionRate90Days: 0, bestSource: { name: 'Unknown', rate: 0, revenue: 0 } };

  // Transform conversionTimeDistribution to match expected interface
  const transformedTimeDistribution = conversionTimeDistribution.map(item => ({
    timeRange: item.days,
    conversions: item.count,
    percentage: item.percentage
  }));

  // Transform conversionBySource to match expected interface
  const transformedConversionBySource = conversionBySource.map(item => ({
    source: item.source,
    trials: item.trials,
    conversions: item.conversions,
    conversionRate: item.conversionRate,
    averageTime: Math.round(item.avgRevenue / 10) // Convert avgRevenue to days approximation
  }));

  // Transform retentionData to match expected interface
  const transformedRetentionData = retentionData.map(item => ({
    period: item.period,
    retentionRate: item.retained,
    customers: Math.round(item.retained * 10) // Approximate customer count
  }));
  
  return (
    <div className="space-y-6">
      <div className="mb-8">
        {/* Page heading already exists - no changes needed */}
      </div>

      {/* Summary Cards */}
      <TrialConversionSummaryCards totalTrials={summary.totalTrials} conversionRate={summary.conversionRate} averageConversionTime={summary.averageConversionTime} retentionRate90Days={summary.retentionRate90Days} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConversionTrendsChart monthlyConversionTrends={monthlyConversionTrends} />
        <ConversionTimeDistribution conversionTimeDistribution={transformedTimeDistribution} />
      </div>

      {/* Conversion by Source */}
      <ConversionBySourceTable conversionBySource={transformedConversionBySource} />

      {/* Retention Analysis */}
      <RetentionAnalysisChart retentionData={transformedRetentionData} />

      {/* Trial Details Table */}
      <TrialDetailsTable trialData={trialData} searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} selectedSource={selectedSource} setSelectedSource={setSelectedSource} />

      {/* Key Insights */}
      <KeyInsightsCard conversionRate={insights.conversionRate} conversionTiming={insights.conversionTiming} retentionRate90Days={insights.retentionRate90Days} bestSource={insights.bestSource} />
      
      <ScrollToTopButton />
    </div>
  );
};

export default TrialToPaidConversionReport;
