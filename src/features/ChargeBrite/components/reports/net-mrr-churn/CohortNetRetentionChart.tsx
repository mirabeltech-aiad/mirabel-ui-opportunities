
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CohortNetRetention } from './types';
import { HelpTooltip } from '@/components';

interface CohortNetRetentionChartProps {
  data: CohortNetRetention[];
}

const CohortNetRetentionChart: React.FC<CohortNetRetentionChartProps> = ({ data }) => {
  const transformedData = [
    { period: 'Month 1', ...data.reduce((acc, cohort) => ({ ...acc, [cohort.cohort]: cohort.month1 }), {}) },
    { period: 'Month 3', ...data.reduce((acc, cohort) => ({ ...acc, [cohort.cohort]: cohort.month3 }), {}) },
    { period: 'Month 6', ...data.reduce((acc, cohort) => ({ ...acc, [cohort.cohort]: cohort.month6 }), {}) },
    { period: 'Month 12', ...data.reduce((acc, cohort) => ({ ...acc, [cohort.cohort]: cohort.month12 }), {}) },
    { period: 'Month 24', ...data.reduce((acc, cohort) => ({ ...acc, [cohort.cohort]: cohort.month24 }), {}) }
  ];

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <Card className="!bg-white" style={{ backgroundColor: '#ffffff' }}>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Cohort Net Revenue Retention</CardTitle>
          <HelpTooltip helpId="cohort-net-retention" />
        </div>
        <CardDescription>Revenue retention curves by customer acquisition cohort</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={transformedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" fontSize={12} />
            <YAxis fontSize={12} label={{ value: 'Net Retention (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value) => [`${value}%`, '']} />
            <Legend />
            {data.map((cohort, index) => (
              <Line
                key={cohort.cohort}
                type="monotone"
                dataKey={cohort.cohort}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                name={cohort.cohort}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CohortNetRetentionChart;
