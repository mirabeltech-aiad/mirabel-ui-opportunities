
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { coreColors } from '@/tokens/designTokens';
import { ChurnBySegment } from './types';
import ChartTooltip from '@/components/ui/ChartTooltip';
import { HelpTooltip } from '@/components';

interface ChurnBySegmentChartProps {
  data: ChurnBySegment[];
}

const ChurnBySegmentChart: React.FC<ChurnBySegmentChartProps> = ({ data }) => {
  const CustomTooltipContent = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const formattedPayload = payload.map((entry: any) => ({
      ...entry,
      name: 'Churn Rate',
      unit: '%'
    }));

    return (
      <ChartTooltip
        active={active}
        payload={formattedPayload}
        label={label}
      />
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Churn by Revenue Segment</CardTitle>
          <HelpTooltip helpId="churn-by-segment" />
        </div>
        <CardDescription>Churn rates across customer segments</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="segment" 
              fontSize={10}
              tick={{ fill: coreColors.ocean[700] }}
            />
            <YAxis 
              fontSize={12} 
              label={{ value: 'Churn Rate (%)', angle: -90, position: 'insideLeft' }}
              tick={{ fill: coreColors.ocean[700] }}
            />
            <CustomTooltipContent />
            <Bar dataKey="churnRate" fill={coreColors.chart.primary.amber} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ChurnBySegmentChart;
