
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { RevenueWaterfall } from './types';
import ChartTooltip from '@/components/ui/ChartTooltip';
import HelpTooltip from '@/components/shared/HelpTooltip';

interface RevenueWaterfallChartProps {
  data: RevenueWaterfall[];
}

const RevenueWaterfallChart: React.FC<RevenueWaterfallChartProps> = ({ data }) => {
  const getColor = (category: string) => {
    switch (category) {
      case 'Starting MRR': return '#6b7280';
      case 'New MRR': return '#10b981';
      case 'Expansion MRR': return '#3b82f6';
      case 'Churn MRR': return '#f43f5e';
      case 'Ending MRR': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const CustomTooltipContent = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const formattedPayload = payload.map((entry: any) => ({
      ...entry,
      name: 'MRR',
      unit: '',
      value: `$${Number(entry.value).toLocaleString()}`
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
          <CardTitle className="text-ocean-800">Revenue Waterfall Analysis</CardTitle>
          <HelpTooltip helpId="revenue-waterfall" />
        </div>
        <CardDescription>Monthly recurring revenue flow from different sources</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="category" 
              fontSize={12}
              tick={{ fill: '#0369a1' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              fontSize={12} 
              label={{ value: 'MRR ($)', angle: -90, position: 'insideLeft' }}
              tick={{ fill: '#0369a1' }}
            />
            <CustomTooltipContent />
            <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.category)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueWaterfallChart;
