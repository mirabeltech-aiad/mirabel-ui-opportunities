import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react';
import HelpTooltip from '../../../components/shared/HelpTooltip';

interface TrialConversionSummaryCardProps {
  totalTrials: number;
  totalConversions: number;
  overallConversionRate: string;
  totalRevenue: number;
}

const TrialConversionSummaryCard: React.FC<TrialConversionSummaryCardProps> = ({
  totalTrials,
  totalConversions,
  overallConversionRate,
  totalRevenue
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
            Conversion Rate
            <HelpTooltip helpId="trial-to-paid-conversion-rate" />
          </CardTitle>
          <TrendingUp className="h-5 w-5 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600 mb-1">{overallConversionRate}%</div>
          <p className="text-xs text-gray-600">Overall trial success</p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
            Total Trials
            <HelpTooltip helpId="total-trials" />
          </CardTitle>
          <Users className="h-5 w-5 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600 mb-1">{totalTrials.toLocaleString()}</div>
          <p className="text-xs text-gray-600">Trial subscriptions</p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
            Conversions
            <HelpTooltip helpId="total-conversions" />
          </CardTitle>
          <Target className="h-5 w-5 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-600 mb-1">{totalConversions.toLocaleString()}</div>
          <p className="text-xs text-gray-600">Successful conversions</p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
            Trial Revenue
            <HelpTooltip helpId="total-trial-revenue" />
          </CardTitle>
          <DollarSign className="h-5 w-5 text-rose-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-rose-600 mb-1">${(totalRevenue / 1000).toFixed(0)}K</div>
          <p className="text-xs text-gray-600">From conversions</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrialConversionSummaryCard;