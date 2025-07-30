
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { HelpTooltip } from '../../../components';
import { LazyChartWrapper } from '../../../components/ui/lazy-chart-wrapper';

interface ExpirationTimelineChartProps {
  summaryData: Array<{
    period: string;
    count: number;
    autoRenew: number;
    manual: number;
  }>;
}

const ExpirationTimelineChart: React.FC<ExpirationTimelineChartProps> = ({ summaryData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-ocean-800 flex items-center gap-1">
          Expiration Timeline Overview
          <HelpTooltip helpId="expiration-timeline-overview" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <LazyChartWrapper height={300} width={800}>
          <BarChart width={800} height={300} data={summaryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="autoRenew" fill="#22c55e" name="Auto-Renew" />
            <Bar dataKey="manual" fill="#f59e0b" name="Manual Renewal" />
          </BarChart>
        </LazyChartWrapper>
      </CardContent>
    </Card>
  );
};

export default ExpirationTimelineChart;
