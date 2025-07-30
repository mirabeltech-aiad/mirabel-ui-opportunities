
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { colorTokens } from '@/styles/designTokens';
import { LazyChartWrapper } from '@/components/ui/lazy-chart-wrapper';
import { HelpTooltip } from '@/components';

interface RenewalTrendData {
  month: string;
  firstTime: number;
  multiTime: number;
  overall: number;
}

interface RenewalTrendsChartProps {
  renewalTrendData: RenewalTrendData[];
}

const RenewalTrendsChart = ({ renewalTrendData }: RenewalTrendsChartProps) => {
  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Renewal Rate Trends</CardTitle>
          <HelpTooltip helpId="renewal-trends" />
        </div>
      </CardHeader>
      <CardContent>
        <LazyChartWrapper height={400} width={800}>
          <BarChart width={800} height={400} data={renewalTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fill: '#0369a1' }} />
            <YAxis tick={{ fill: '#0369a1' }} />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Renewal Rate']}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #bae6fd',
                borderRadius: '6px'
              }}
            />
            <Bar dataKey="firstTime" fill="#3b82f6" name="First-Time" />
            <Bar dataKey="multiTime" fill="#10b981" name="Multi-Time" />
            <Bar dataKey="overall" fill="#8b5cf6" name="Overall" />
          </BarChart>
        </LazyChartWrapper>
      </CardContent>
    </Card>
  );
};

export default RenewalTrendsChart;
