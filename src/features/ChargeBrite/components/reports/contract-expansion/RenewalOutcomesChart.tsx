
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { colorTokens } from '@/styles/designTokens';
import { RenewalOutcome } from './types';
import HelpTooltip from '@/components/shared/HelpTooltip';

interface RenewalOutcomesChartProps {
  data: RenewalOutcome[];
}

const RenewalOutcomesChart: React.FC<RenewalOutcomesChartProps> = ({ data }) => {
  const colors = [
    colorTokens.chartPrimary.emerald,
    colorTokens.chartPrimary.blue,
    colorTokens.chartPrimary.amber,
    colorTokens.chartPrimary.rose
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Renewal Outcome Breakdown</CardTitle>
          <HelpTooltip helpId="renewal-outcomes" />
        </div>
        <CardDescription>Distribution of all contract renewal outcomes</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ outcome, percentage }) => `${outcome}: ${percentage}%`}
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

export default RenewalOutcomesChart;
