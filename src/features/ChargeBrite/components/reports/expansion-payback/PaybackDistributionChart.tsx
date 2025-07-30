
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { PaybackDistribution } from './types';
import { HelpTooltip } from '@/components';

interface PaybackDistributionChartProps {
  data: PaybackDistribution[];
}

const PaybackDistributionChart: React.FC<PaybackDistributionChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Payback Period Distribution</CardTitle>
          <HelpTooltip helpId="payback-distribution" />
        </div>
        <CardDescription>Distribution of expansion deals by payback period ranges</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="range" 
              fontSize={12} 
              tick={{ fill: '#0369a1' }}
            />
            <YAxis 
              fontSize={12} 
              tick={{ fill: '#0369a1' }}
              label={{ value: 'Number of Deals', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value, name) => [value, 'Deals']}
              labelFormatter={(label) => `Period: ${label}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px'
              }}
            />
            <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PaybackDistributionChart;
