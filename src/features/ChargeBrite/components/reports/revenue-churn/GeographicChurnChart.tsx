
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { GeographicChurn } from './types';
import ChartTooltip from '@/components/ui/ChartTooltip';
import { HelpTooltip } from '@/components';

interface GeographicChurnChartProps {
  data: GeographicChurn[];
}

const GeographicChurnChart: React.FC<GeographicChurnChartProps> = ({ data }) => {
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
          <CardTitle className="text-ocean-800">Geographic Churn Analysis</CardTitle>
          <HelpTooltip helpId="geographic-churn" />
        </div>
        <CardDescription>Revenue churn rates by geographic region</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="region" 
              fontSize={12}
              tick={{ fill: '#0369a1' }}
            />
            <YAxis 
              fontSize={12} 
              label={{ value: 'Churn Rate (%)', angle: -90, position: 'insideLeft' }}
              tick={{ fill: '#0369a1' }}
            />
            <CustomTooltipContent />
            <Bar dataKey="churnRate" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default GeographicChurnChart;
