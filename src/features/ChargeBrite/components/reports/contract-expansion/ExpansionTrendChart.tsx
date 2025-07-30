
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { colorTokens } from '@/styles/designTokens';
import { ExpansionTrendData } from './types';
import HelpTooltip from '@/components/shared/HelpTooltip';

interface ExpansionTrendChartProps {
  data: ExpansionTrendData[];
}

const ExpansionTrendChart: React.FC<ExpansionTrendChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Contract Expansion Rate Trend</CardTitle>
          <HelpTooltip helpId="expansion-rate-trend-chart" />
        </div>
        <CardDescription>Monthly expansion rate over past 12 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={colorTokens.semantic.secondary} />
            <XAxis dataKey="month" fontSize={12} tick={{ fill: colorTokens.ocean[700] }} />
            <YAxis fontSize={12} tick={{ fill: colorTokens.ocean[700] }} />
            <Tooltip 
              formatter={(value, name) => [`${value}%`, 'Expansion Rate']}
              labelFormatter={(label) => `Month: ${label}`}
              contentStyle={{
                backgroundColor: colorTokens.backgrounds.white,
                border: `1px solid ${colorTokens.ocean[200]}`,
                borderRadius: '6px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="expansionRate" 
              stroke={colorTokens.chartPrimary.emerald} 
              strokeWidth={2}
              dot={{ fill: colorTokens.chartPrimary.emerald, strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ExpansionTrendChart;
