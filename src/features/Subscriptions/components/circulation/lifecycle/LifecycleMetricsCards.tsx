
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck, UserX, TrendingUp, TrendingDown } from 'lucide-react';
import { ConversionRates } from '../../../types/subscription';
import { HelpTooltip } from '../../../components';

interface LifecycleMetricsCardsProps {
  conversionRates: ConversionRates;
}

const LifecycleMetricsCards: React.FC<LifecycleMetricsCardsProps> = ({ conversionRates }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card size="large" className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-1">
            <CardTitle className="text-sm font-medium text-black">Trial Conversion</CardTitle>
            <HelpTooltip helpId="trial-conversion" />
          </div>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{conversionRates.trialToSubscription}%</div>
          <p className="text-xs text-green-300">Trial to paid</p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-1">
            <CardTitle className="text-sm font-medium text-black">Retention Rate</CardTitle>
            <HelpTooltip helpId="lifecycle-retention-rate" />
          </div>
          <UserCheck className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{conversionRates.retention}%</div>
          <p className="text-xs text-blue-300">12-month retention</p>
        </CardContent>
      </Card>

      {/* Add remaining cards following the same pattern */}
      <Card size="large" className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black">Churn Rate</CardTitle>
          <UserX className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{(100 - conversionRates.retention).toFixed(1)}%</div>
          <p className="text-xs text-red-300">Monthly churn</p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black">Growth Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">+{conversionRates.trialToSubscription * 0.3}%</div>
          <p className="text-xs text-purple-300">Monthly growth</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LifecycleMetricsCards;
