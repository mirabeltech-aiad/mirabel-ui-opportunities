
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendData } from './types';
import { HelpTooltip } from '@/components';

interface CrossSellTrendChartProps {
  data: TrendData[];
}

const CrossSellTrendChart: React.FC<CrossSellTrendChartProps> = ({ data }) => {
  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Cross-sell Performance Trends</CardTitle>
          <HelpTooltip helpId="cross-sell-trend-chart" />
        </div>
        <CardDescription>Monthly trends in cross-sell attach rates and revenue</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" fontSize={12} tick={{ fill: '#0369a1' }} />
            <YAxis fontSize={12} tick={{ fill: '#0369a1' }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #bae6fd',
                borderRadius: '6px'
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="attachRate" stroke="#8b5cf6" strokeWidth={2} name="Attach Rate (%)" />
            <Line type="monotone" dataKey="crossSells" stroke="#10b981" strokeWidth={2} name="Cross-sells" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CrossSellTrendChart;
