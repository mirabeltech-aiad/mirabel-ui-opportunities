
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Users, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import HelpTooltip from '../../shared/HelpTooltip';

interface RevenueMetric {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface RevenueMetricsCardsProps {
  metrics?: RevenueMetric[];
  isLoading?: boolean;
}

const RevenueMetricsCards: React.FC<RevenueMetricsCardsProps> = ({ metrics, isLoading }) => {
  if (isLoading || !metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-1" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center">
                <CardTitle className="text-sm font-medium text-black">{metric.title}</CardTitle>
                <HelpTooltip helpId={`revenue-${metric.title.toLowerCase().replace(/\s+/g, '-')}`} />
              </div>
              <Icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.change}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default RevenueMetricsCards;
