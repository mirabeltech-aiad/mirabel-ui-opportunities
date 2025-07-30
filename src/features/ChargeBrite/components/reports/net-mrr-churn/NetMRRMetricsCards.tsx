
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown, TrendingUp, DollarSign, Target } from 'lucide-react';
import { HelpTooltip } from '@/components';

interface NetMRRMetricsCardsProps {
  data: {
    grossMRRChurn: number;
    netMRRChurn: number;
    expansionMRR: number;
    netRevenueRetention: number;
  };
}

const NetMRRMetricsCards: React.FC<NetMRRMetricsCardsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">Gross MRR Churn</CardTitle>
            <HelpTooltip helpId="gross-mrr-churn" />
          </div>
          <TrendingDown className="h-5 w-5 text-rose-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-rose-600 mb-1">{data.grossMRRChurn}%</div>
          <p className="text-xs text-gray-600">monthly revenue lost</p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">Net MRR Churn</CardTitle>
            <HelpTooltip helpId="net-mrr-churn" />
          </div>
          <TrendingUp className="h-5 w-5 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600 mb-1">{data.netMRRChurn}%</div>
          <p className="text-xs text-gray-600">after expansions</p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">Expansion MRR</CardTitle>
            <HelpTooltip helpId="expansion-mrr" />
          </div>
          <DollarSign className="h-5 w-5 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600 mb-1">${data.expansionMRR.toLocaleString()}</div>
          <p className="text-xs text-gray-600">this month</p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">Net Revenue Retention</CardTitle>
            <HelpTooltip helpId="net-revenue-retention" />
          </div>
          <Target className="h-5 w-5 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-600 mb-1">{data.netRevenueRetention}%</div>
          <p className="text-xs text-gray-600">including expansions</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetMRRMetricsCards;
