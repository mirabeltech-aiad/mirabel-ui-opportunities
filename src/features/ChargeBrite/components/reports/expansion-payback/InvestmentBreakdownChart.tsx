
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { InvestmentBreakdown } from './types';
import { HelpTooltip } from '@/components';

interface InvestmentBreakdownChartProps {
  data: InvestmentBreakdown[];
}

const InvestmentBreakdownChart: React.FC<InvestmentBreakdownChartProps> = ({ data }) => {
  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Investment Breakdown Analysis</CardTitle>
          <HelpTooltip helpId="investment-breakdown" />
        </div>
        <CardDescription>Breakdown of expansion investment by category</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ category, percentage }) => `${category}: ${percentage}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="amount"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`$${value.toLocaleString()}`, 'Investment']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default InvestmentBreakdownChart;
