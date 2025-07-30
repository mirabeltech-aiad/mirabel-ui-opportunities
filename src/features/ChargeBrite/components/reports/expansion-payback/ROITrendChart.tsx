
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { ROITrendData } from './types';
import { HelpTooltip } from '@/components';

interface ROITrendChartProps {
  data: ROITrendData[];
}

const ROITrendChart: React.FC<ROITrendChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">ROI Trend Analysis</CardTitle>
          <HelpTooltip helpId="roi-trend-analysis" />
        </div>
        <CardDescription>Monthly ROI trend for expansion investments</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              fontSize={12} 
              tick={{ fill: '#0369a1' }}
            />
            <YAxis 
              fontSize={12} 
              tick={{ fill: '#0369a1' }}
              label={{ value: 'ROI (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value, name) => [`${value}%`, 'ROI']}
              labelFormatter={(label) => `Month: ${label}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="roi" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ROITrendChart;
