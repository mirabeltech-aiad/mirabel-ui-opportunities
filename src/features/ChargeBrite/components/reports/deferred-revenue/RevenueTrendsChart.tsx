
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis } from 'recharts';
import HelpTooltip from '@/components/shared/HelpTooltip';

interface RevenueTrend {
  month: string;
  deferredRevenue: number;
  recognizedRevenue: number;
}

interface RevenueTrendsChartProps {
  data: RevenueTrend[];
}

const RevenueTrendsChart = ({ data }: RevenueTrendsChartProps) => {
  const chartConfig = {
    deferredRevenue: {
      label: "Deferred Revenue",
      color: "#ef4444",
    },
    recognizedRevenue: {
      label: "Recognized Revenue",
      color: "#10b981",
    },
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Deferred vs Recognized Revenue Trends</CardTitle>
          <HelpTooltip helpId="revenue-trends-chart" />
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip 
              content={<ChartTooltipContent />}
              formatter={(value: number, name: string) => [
                `$${(value / 1000000).toFixed(1)}M`, 
                name === 'deferredRevenue' ? 'Deferred Revenue' : 'Recognized Revenue'
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="deferredRevenue" 
              stroke="var(--color-deferredRevenue)" 
              strokeWidth={3}
              dot={{ fill: "var(--color-deferredRevenue)", strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="recognizedRevenue" 
              stroke="var(--color-recognizedRevenue)" 
              strokeWidth={3}
              dot={{ fill: "var(--color-recognizedRevenue)", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueTrendsChart;
