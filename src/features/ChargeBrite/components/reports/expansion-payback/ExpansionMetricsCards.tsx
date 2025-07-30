
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, DollarSign, TrendingUp, BarChart3, Target } from 'lucide-react';
import { HelpTooltip } from '@/components';

interface ExpansionMetricsCardsProps {
  avgPaybackPeriod: number;
  totalInvestment: number;
  overallROI: number;
  totalMonthlyRevenue: number;
  dealsThisMonth: number;
}

const ExpansionMetricsCards: React.FC<ExpansionMetricsCardsProps> = ({
  avgPaybackPeriod,
  totalInvestment,
  overallROI,
  totalMonthlyRevenue,
  dealsThisMonth
}) => {
  const cards = [
    {
      title: 'Average Payback Period',
      helpId: 'avg-payback-period',
      icon: Clock,
      value: `${avgPaybackPeriod.toFixed(1)} months`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Time to recover investment'
    },
    {
      title: 'Total Expansion Investment',
      helpId: 'total-expansion-investment',
      icon: DollarSign,
      value: `$${totalInvestment.toLocaleString()}`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Total invested in expansion'
    },
    {
      title: 'Overall Expansion ROI',
      helpId: 'expansion-roi',
      icon: TrendingUp,
      value: `${overallROI}%`,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Return on expansion investment'
    },
    {
      title: 'Total Monthly Expansion Revenue',
      helpId: 'monthly-expansion-revenue',
      icon: BarChart3,
      value: `$${totalMonthlyRevenue.toLocaleString()}`,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      description: 'Monthly recurring revenue added'
    },
    {
      title: 'Expansion Deals This Month',
      helpId: 'expansion-deals-count',
      icon: Target,
      value: dealsThisMonth.toString(),
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'New expansion deals closed'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center">
                <CardTitle className="text-sm font-medium text-black">{card.title}</CardTitle>
                <HelpTooltip helpId={card.helpId} />
              </div>
              <div className={`p-2 rounded-full ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ExpansionMetricsCards;
