import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import HelpTooltip from '@/components/shared/HelpTooltip';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  valueColor?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  helpId?: string;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-gray-500',
  valueColor = 'text-gray-900',
  trend,
  trendValue,
  helpId,
  className
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↗';
      case 'down':
        return '↘';
      default:
        return null;
    }
  };

  return (
    <Card className={cn("bg-white border border-gray-200 hover:shadow-md transition-shadow", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
          {title}
          {helpId && <HelpTooltip helpId={helpId} />}
        </CardTitle>
        <Icon className={cn("h-5 w-5", iconColor)} />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className={cn("text-3xl font-bold mb-1", valueColor)}>
            {value}
          </div>
          {trend && trendValue && (
            <div className={cn("flex items-center text-sm font-medium", getTrendColor())}>
              <span className="mr-1">{getTrendIcon()}</span>
              {trendValue}
            </div>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-gray-600">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;