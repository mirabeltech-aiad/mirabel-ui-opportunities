
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Users, Calendar } from 'lucide-react';
import { ExpansionMetrics } from './types';
import HelpTooltip from '@/components/shared/HelpTooltip';

interface RevenueImpactMetricsProps {
  metrics: ExpansionMetrics;
}

const RevenueImpactMetrics: React.FC<RevenueImpactMetricsProps> = ({ metrics }) => {
  const impactCards = [
    {
      title: 'Revenue Impact Analysis',
      helpId: 'revenue-impact-metrics',
      icon: DollarSign,
      content: (
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">${metrics.totalExpansionRevenue ? metrics.totalExpansionRevenue.toLocaleString() : '0'}</div>
            <div className="text-sm text-gray-600">Total Revenue Impact</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">${metrics.averageContractValueAfter ? metrics.averageContractValueAfter.toLocaleString() : '0'}</div>
            <div className="text-sm text-gray-600">Avg Contract Value After</div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-6">
      {impactCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="bg-white border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center">
                <CardTitle className="text-lg font-medium text-ocean-800">{card.title}</CardTitle>
                <HelpTooltip helpId={card.helpId} />
              </div>
              <Icon className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              {card.content}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default RevenueImpactMetrics;
