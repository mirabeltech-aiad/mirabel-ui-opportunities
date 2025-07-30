
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { HelpTooltip } from '@/components';

interface RevenueBridgeData {
  category: string;
  value: number;
  type: 'base' | 'positive' | 'negative';
}

interface NetRevenueBridgeAnalysisProps {
  data: RevenueBridgeData[];
}

const NetRevenueBridgeAnalysis: React.FC<NetRevenueBridgeAnalysisProps> = ({ data }) => {
  const getColor = (type: string) => {
    switch (type) {
      case 'positive': return '#10b981';
      case 'negative': return '#f43f5e';
      default: return '#6b7280';
    }
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Net Revenue Bridge Analysis</CardTitle>
          <HelpTooltip helpId="net-revenue-bridge" />
        </div>
        <CardDescription>Detailed breakdown of revenue movements and their impact</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="category" 
              fontSize={12}
              tick={{ fill: '#075985' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              fontSize={12}
              tick={{ fill: '#075985' }}
              axisLine={{ stroke: '#e5e7eb' }}
              label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #bae6fd',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.type)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default NetRevenueBridgeAnalysis;
