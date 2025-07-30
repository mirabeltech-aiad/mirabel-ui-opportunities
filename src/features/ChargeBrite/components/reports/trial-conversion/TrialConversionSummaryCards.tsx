
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, Clock, Shield } from 'lucide-react';
import HelpTooltip from '@/components/shared/HelpTooltip';

interface TrialConversionSummaryCardsProps {
  totalTrials: number;
  conversionRate: number;
  averageConversionTime: number;
  retentionRate90Days: number;
}

const TrialConversionSummaryCards: React.FC<TrialConversionSummaryCardsProps> = ({
  totalTrials,
  conversionRate,
  averageConversionTime,
  retentionRate90Days
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              Total Trials
              <HelpTooltip helpId="trial-total-trials" />
            </CardTitle>
          </div>
          <Users className="h-5 w-5 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600 mb-1">{totalTrials.toLocaleString()}</div>
          <p className="text-xs text-gray-600">trial subscriptions started</p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
            Conversion Rate
            <HelpTooltip helpId="trial-conversion-rate" />
          </CardTitle>
          <TrendingUp className="h-5 w-5 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600 mb-1">{conversionRate}%</div>
          <p className="text-xs text-gray-600">trials converted to paid</p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
            Avg Conversion Time
            <HelpTooltip helpId="trial-avg-conversion-time" />
          </CardTitle>
          <Clock className="h-5 w-5 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-600 mb-1">{averageConversionTime} days</div>
          <p className="text-xs text-gray-600">average time to convert</p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
            90-Day Retention
            <HelpTooltip helpId="trial-90day-retention" />
          </CardTitle>
          <Shield className="h-5 w-5 text-rose-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-rose-600 mb-1">{retentionRate90Days}%</div>
          <p className="text-xs text-gray-600">of converted users retained</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrialConversionSummaryCards;
