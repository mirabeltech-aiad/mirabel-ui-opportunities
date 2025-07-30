
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, FileText, BarChart3, Users } from 'lucide-react';
import { ExpansionMetrics } from './types';
import HelpTooltip from '@/components/shared/HelpTooltip';

interface ExpansionMetricsCardsProps {
  metrics: ExpansionMetrics;
}

const ExpansionMetricsCards: React.FC<ExpansionMetricsCardsProps> = ({ metrics }) => {
  const cards = [
    {
      title: 'Contract Expansion Metrics',
      helpId: 'contract-expansion-metrics',
      icon: BarChart3,
      content: (
        <div className="grid grid-cols-2 gap-4">
          <div className="text-left">
            <div className="text-2xl font-bold text-blue-600">{metrics.overallExpansionRate}%</div>
            <div className="text-sm text-blue-300">Expansion Rate</div>
          </div>
          <div className="text-left">
            <div className="text-2xl font-bold text-purple-600">{metrics.averageExpansionPercentage ? `${metrics.averageExpansionPercentage}%` : '0%'}</div>
            <div className="text-sm text-purple-300">Avg Expansion</div>
          </div>
        </div>
      )
    },
    {
      title: 'Total Expansion Revenue',
      helpId: 'total-expansion-revenue',
      icon: DollarSign,
      content: (
        <div className="text-left">
          <div className="text-3xl font-bold text-green-600">${metrics.totalExpansionRevenue ? metrics.totalExpansionRevenue.toLocaleString() : '0'}</div>
          <div className="text-sm text-green-300">This Period</div>
        </div>
      )
    },
    {
      title: 'Net Revenue Retention',
      helpId: 'net-revenue-retention',
      icon: TrendingUp,
      content: (
        <div className="text-left">
          <div className="text-3xl font-bold text-rose-600">{metrics.netRevenueRetention || 0}%</div>
          <div className="text-sm text-rose-300">Net Revenue Retention</div>
        </div>
      )
    },
    {
      title: 'Expansion MRR',
      helpId: 'expansion-mrr',
      icon: FileText,
      content: (
        <div className="text-left">
          <div className="text-3xl font-bold text-indigo-600">${metrics.expansionMRR || 0}</div>
          <div className="text-sm text-indigo-300">Monthly Expansion MRR</div>
        </div>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center">
                <CardTitle className="text-sm font-medium text-ocean-800">{card.title}</CardTitle>
                <HelpTooltip helpId={card.helpId} />
              </div>
              <Icon className="h-4 w-4 text-muted-foreground" />
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

export default ExpansionMetricsCards;
