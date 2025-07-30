
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { colorTokens } from '@/styles/designTokens';
import { ExpansionDistribution } from './types';
import HelpTooltip from '@/components/shared/HelpTooltip';

interface ExpansionDistributionChartProps {
  data: ExpansionDistribution[];
}

const ExpansionDistributionChart: React.FC<ExpansionDistributionChartProps> = ({ data }) => {
  const colors = [
    colorTokens.chartPrimary.emerald,
    colorTokens.chartPrimary.blue,
    colorTokens.chartPrimary.purple,
    colorTokens.chartPrimary.rose,
    colorTokens.chartPrimary.amber
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Expansion Amount Distribution</CardTitle>
          <HelpTooltip helpId="expansion-distribution" />
        </div>
        <CardDescription>Distribution of contract expansion amounts by value range</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name}: ${percentage}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [value, 'Count']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ExpansionDistributionChart;
