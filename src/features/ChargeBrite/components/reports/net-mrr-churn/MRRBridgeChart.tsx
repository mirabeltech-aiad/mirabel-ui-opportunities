
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { HelpTooltip } from '@/components';

interface MRRBridgeChartProps {
  data: Array<{
    category: string;
    value: number;
    type: 'positive' | 'negative' | 'neutral';
  }>;
}

const MRRBridgeChart: React.FC<MRRBridgeChartProps> = ({ data }) => {
  const getColor = (type: string) => {
    switch (type) {
      case 'positive': return '#10b981';
      case 'negative': return '#f43f5e';
      default: return '#6b7280';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            MRR Movement Bridge
          </CardTitle>
          <HelpTooltip helpId="mrr-bridge-chart" />
        </div>
        <CardDescription>Waterfall view of MRR changes from different sources</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="category" fontSize={12} tick={{ fill: '#075985' }} />
            <YAxis fontSize={12} tick={{ fill: '#075985' }} />
            <Tooltip 
              formatter={(value) => [`$${Number(value).toLocaleString()}`, 'MRR Change']}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #bae6fd',
                borderRadius: '6px'
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

export default MRRBridgeChart;
