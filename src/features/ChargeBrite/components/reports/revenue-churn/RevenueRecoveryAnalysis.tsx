
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import HelpTooltip from '@/components/shared/HelpTooltip';
import RecoveryMetricsCards from './RecoveryMetricsCards';
import RecoveryChart from './RecoveryChart';

interface RevenueRecoveryAnalysisProps {
  data: any; // Handle flexible data structure from API
}

const RevenueRecoveryAnalysis: React.FC<RevenueRecoveryAnalysisProps> = ({ data }) => {
  // Handle different data structures and provide fallbacks
  const safeData = data || {};
  
  // Extract values with fallbacks
  const totalRecoveryOpportunity = safeData.totalRecoveryOpportunity || 0;
  const successfulRecoveries = safeData.successfulRecoveries || 0;
  const recoveryRate = safeData.recoveryRate || 0;
  const averageRecoveryTime = safeData.averageRecoveryTime || 0;

  // Calculate investment ROI estimate
  const investmentROI = Math.floor(totalRecoveryOpportunity * 0.25);

  // Create chart data
  const chartData = [
    { category: 'Recovery Opportunity', value: totalRecoveryOpportunity },
    { category: 'Successful Recoveries', value: successfulRecoveries },
    { category: 'Recovery Rate', value: recoveryRate },
    { category: 'Avg Recovery Time (days)', value: averageRecoveryTime }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Revenue Recovery Analysis</CardTitle>
          <HelpTooltip helpId="revenue-recovery" />
        </div>
        <CardDescription>Win-back campaign performance and recovery opportunities</CardDescription>
      </CardHeader>
      <CardContent>
        <RecoveryMetricsCards
          recoveryOpportunity={totalRecoveryOpportunity}
          successfulRecoveries={successfulRecoveries}
          investmentROI={investmentROI}
        />
        <RecoveryChart data={chartData} />
      </CardContent>
    </Card>
  );
};

export default RevenueRecoveryAnalysis;
