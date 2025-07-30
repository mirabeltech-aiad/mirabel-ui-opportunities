
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TimeToXSellData } from './types';
import { HelpTooltip } from '@/components';

interface CrossSellTimeDistributionChartProps {
  data: TimeToXSellData[];
}

const CrossSellTimeDistributionChart: React.FC<CrossSellTimeDistributionChartProps> = ({ data }) => {
  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Time to Cross-sell Distribution</CardTitle>
          <HelpTooltip helpId="cross-sell-time-distribution" />
        </div>
        <CardDescription>When customers typically add complementary products</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="range" fontSize={12} tick={{ fill: '#0369a1' }} />
            <YAxis fontSize={12} tick={{ fill: '#0369a1' }} />
            <Tooltip 
              formatter={(value) => [`${value} customers`, 'Count']}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #bae6fd',
                borderRadius: '6px'
              }}
            />
            <Bar dataKey="count" fill="#10b981" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CrossSellTimeDistributionChart;
