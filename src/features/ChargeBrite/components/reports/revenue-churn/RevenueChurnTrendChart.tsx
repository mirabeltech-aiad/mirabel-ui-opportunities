
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { RevenueChurnTrend } from './types';
import ChartTooltip from '@/components/ui/ChartTooltip';
import HelpTooltip from '@/components/shared/HelpTooltip';

interface RevenueChurnTrendChartProps {
  data: RevenueChurnTrend[];
}

const RevenueChurnTrendChart: React.FC<RevenueChurnTrendChartProps> = ({ data }) => {
  const CustomTooltipContent = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const formattedPayload = payload.map((entry: any) => ({
      ...entry,
      name: entry.dataKey === 'grossChurnRate' ? 'Gross Churn Rate' : 'Net Churn Rate',
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
    <Card className="bg-white">
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Revenue Churn Trend</CardTitle>
          <HelpTooltip helpId="revenue-churn-trend" />
        </div>
        <CardDescription>12-month trend of gross vs net revenue churn rates</CardDescription>
      </CardHeader>
      <CardContent className="bg-white">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" fontSize={12} tick={{ fill: '#0369a1' }} />
            <YAxis fontSize={12} label={{ value: 'Churn Rate (%)', angle: -90, position: 'insideLeft' }} tick={{ fill: '#0369a1' }} />
            <CustomTooltipContent />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="grossChurnRate" 
              stroke="#f43f5e" 
              strokeWidth={2}
              name="Gross Churn Rate"
            />
            <Line 
              type="monotone" 
              dataKey="netChurnRate" 
              stroke="#f59e0b" 
              strokeWidth={2}
              name="Net Churn Rate"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueChurnTrendChart;
