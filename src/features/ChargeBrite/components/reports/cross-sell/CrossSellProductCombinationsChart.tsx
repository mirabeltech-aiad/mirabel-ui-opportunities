
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ProductCombination } from './types';
import { HelpTooltip } from '@/components';

interface CrossSellProductCombinationsChartProps {
  data: ProductCombination[];
}

const CrossSellProductCombinationsChart: React.FC<CrossSellProductCombinationsChartProps> = ({ data }) => {
  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Product Combination Performance</CardTitle>
          <HelpTooltip helpId="product-combinations-chart" />
        </div>
        <CardDescription>Most successful product combinations and their performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" fontSize={12} tick={{ fill: '#0369a1' }} />
            <YAxis dataKey="combination" type="category" fontSize={12} tick={{ fill: '#0369a1' }} width={120} />
            <Tooltip 
              formatter={(value, name) => [`${value}${name === 'rate' ? '%' : ''}`, name === 'rate' ? 'Attach Rate' : 'Count']}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #bae6fd',
                borderRadius: '6px'
              }}
            />
            <Bar dataKey="count" fill="#3b82f6" name="Count" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CrossSellProductCombinationsChart;
