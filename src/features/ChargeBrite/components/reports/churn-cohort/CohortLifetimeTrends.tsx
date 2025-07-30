
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CohortLifetimeTrend } from './types';
import { LazyChartWrapper } from '@/components/ui/lazy-chart-wrapper';
import HelpTooltip from '@/components/shared/HelpTooltip';

interface CohortLifetimeTrendsProps {
  data: CohortLifetimeTrend[];
}

const CohortLifetimeTrends: React.FC<CohortLifetimeTrendsProps> = ({ data }) => {
  // Ensure data is an array and provide fallback
  const validData = Array.isArray(data) ? data : [];
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Cohort Lifetime Trends</CardTitle>
          <HelpTooltip helpId="cohort-lifetime-trends" />
        </div>
        <CardDescription>Retention and churn progression over time</CardDescription>
      </CardHeader>
      <CardContent>
        <LazyChartWrapper height={300}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={validData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(value, name) => [`${value}%`, name]} />
              <Legend />
              <Line 
                dataKey="retentionRate" 
                stroke="#10b981" 
                strokeWidth={2} 
                name="Retention Rate"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
              <Line 
                dataKey="cumulativeChurn" 
                stroke="#ef4444" 
                strokeWidth={2} 
                name="Cumulative Churn"
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </LazyChartWrapper>
      </CardContent>
    </Card>
  );
};

export default CohortLifetimeTrends;
