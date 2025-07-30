
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { SegmentNetMRR } from './types';
import { LazyChartWrapper } from '@/components/ui/lazy-chart-wrapper';
import HelpTooltip from '@/components/shared/HelpTooltip';

interface SegmentNetMRRChartProps {
  data: SegmentNetMRR[];
}

const SegmentNetMRRChart: React.FC<SegmentNetMRRChartProps> = ({ data }) => {
  return (
    <Card className="!bg-white" style={{ backgroundColor: '#ffffff' }}>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Net MRR by Customer Segment</CardTitle>
          <HelpTooltip helpId="segment-net-mrr" />
        </div>
        <CardDescription>Expansion vs churn performance across customer segments</CardDescription>
      </CardHeader>
      <CardContent>
        <LazyChartWrapper height={350} width={800}>
          <BarChart width={800} height={350} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="segment" fontSize={12} />
            <YAxis fontSize={12} label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value) => [`${value}%`, '']} />
            <Legend />
            <Bar dataKey="grossChurnRate" fill="#ef4444" name="Gross Churn Rate" />
            <Bar dataKey="expansionRate" fill="#10b981" name="Expansion Rate" />
            <Bar dataKey="netChurnRate" fill="#3b82f6" name="Net Churn Rate" />
          </BarChart>
        </LazyChartWrapper>
      </CardContent>
    </Card>
  );
};

export default SegmentNetMRRChart;
