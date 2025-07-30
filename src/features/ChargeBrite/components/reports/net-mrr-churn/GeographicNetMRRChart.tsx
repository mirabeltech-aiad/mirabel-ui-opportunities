
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartTooltip from '@/components/ui/ChartTooltip';
import { HelpTooltip } from '@/components';

interface GeographicMRRData {
  region: string;
  netChurnRate: number;
  expansionRate: number;
  customerCount?: number;
}

interface GeographicNetMRRChartProps {
  data: GeographicMRRData[];
}

const GeographicNetMRRChart: React.FC<GeographicNetMRRChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    region: item.region,
    'Net Churn Rate': item.netChurnRate,
    'Expansion Rate': item.expansionRate
  }));

  const colors = {
    'Net Churn Rate': '#3b82f6', // blue-500
    'Expansion Rate': '#10b981' // emerald-500
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Regional Comparison of Net Churn Rates and Expansion</CardTitle>
          <HelpTooltip helpId="geographic-net-mrr" />
        </div>
        <CardDescription>Geographic analysis of churn and expansion performance</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="region" 
              fontSize={12}
              tick={{ fill: '#075985' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              fontSize={12}
              tick={{ fill: '#075985' }}
              axisLine={{ stroke: '#e5e7eb' }}
              label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              content={<ChartTooltip />}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #bae6fd',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="Net Churn Rate" fill={colors['Net Churn Rate']} radius={[2, 2, 0, 0]} />
            <Bar dataKey="Expansion Rate" fill={colors['Expansion Rate']} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default GeographicNetMRRChart;
