

import { useRevenueOverview } from '@/hooks/useRevenueData';
import RevenueMetricsCards from './revenue/RevenueMetricsCards';
import { DollarSign, TrendingUp, Users, Calendar } from 'lucide-react';
import type { RevenueMetrics } from '@/types/revenue';

interface RevenueMetric {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const RevenueOverview: React.FC = () => {
  const { data: overview, isLoading } = useRevenueOverview();

  const metrics: RevenueMetric[] | undefined = overview ? [
    {
      title: 'Total Revenue',
      value: `$${overview.totalRevenue.toLocaleString()}`,
      change: `+${overview.revenueGrowth.toFixed(1)}% from last month`,
      icon: DollarSign,
      color: 'text-blue-600'
    },
    {
      title: 'Monthly Recurring',
      value: `$${overview.monthlyRecurring.toLocaleString()}`,
      change: `+${overview.mrrGrowth.toFixed(1)}% MoM`,
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Average Revenue Per User',
      value: `$${overview.arpu.toFixed(2)}`,
      change: `${overview.arpuChange >= 0 ? '+' : ''}${overview.arpuChange.toFixed(1)}% change`,
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Revenue Per Month',
      value: `$${overview.revenuePerMonth.toLocaleString()}`,
      change: 'Current month projection',
      icon: Calendar,
      color: 'text-rose-600'
    }
  ] : undefined;

  return <RevenueMetricsCards metrics={metrics} isLoading={isLoading} />;
};

export default RevenueOverview;
