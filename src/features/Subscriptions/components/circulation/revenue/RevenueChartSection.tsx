
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '../../../components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import HelpTooltip from '../../shared/HelpTooltip';

interface RevenueChartSectionProps {
  title: string;
  children?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
  helpId?: string;
}

const RevenueChartSection: React.FC<RevenueChartSectionProps> = ({
  title,
  children,
  isLoading,
  className = "",
  helpId
}) => {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">{title}</CardTitle>
            {helpId && <HelpTooltip helpId={helpId} />}
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">{title}</CardTitle>
          {helpId && <HelpTooltip helpId={helpId} />}
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default RevenueChartSection;
