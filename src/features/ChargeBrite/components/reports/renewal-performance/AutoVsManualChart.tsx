
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { colorTokens } from '@/styles/designTokens';
import { HelpTooltip } from '@/components';

interface RenewalTypeData {
  name: string;
  value: number;
  count: number;
  fill: string;
}

interface AutoVsManualChartProps {
  renewalTypeData: RenewalTypeData[];
}

const AutoVsManualChart = ({ renewalTypeData }: AutoVsManualChartProps) => {
  const COLORS = ['#10b981', '#f59e0b'];

  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Auto vs Manual Renewal Success</CardTitle>
          <HelpTooltip helpId="auto-vs-manual-renewals" />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={renewalTypeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              stroke="#ffffff"
              strokeWidth={2}
            >
              {renewalTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Success Rate']}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #bae6fd',
                borderRadius: '6px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AutoVsManualChart;
