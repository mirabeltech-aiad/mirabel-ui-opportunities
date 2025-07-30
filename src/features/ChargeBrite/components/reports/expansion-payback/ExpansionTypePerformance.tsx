
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { ExpansionTypeData } from './types';
import { HelpTooltip } from '@/components';

interface ExpansionTypePerformanceProps {
  data: ExpansionTypeData[];
}

const ExpansionTypePerformance: React.FC<ExpansionTypePerformanceProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Expansion Type Performance</CardTitle>
          <HelpTooltip helpId="expansion-type-performance" />
        </div>
        <CardDescription>Performance comparison across different expansion types</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="type" 
              fontSize={12} 
              tick={{ fill: '#0369a1' }}
            />
            <YAxis 
              fontSize={12} 
              tick={{ fill: '#0369a1' }}
              label={{ value: 'Avg Payback (Months)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'avgPayback') return [`${value} months`, 'Avg Payback'];
                if (name === 'avgROI') return [`${value}%`, 'Avg ROI'];
                return [value, name];
              }}
              labelFormatter={(label) => `Type: ${label}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px'
              }}
            />
            <Bar dataKey="avgPayback" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ExpansionTypePerformance;
