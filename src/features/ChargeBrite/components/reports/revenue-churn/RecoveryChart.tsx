
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import ChartTooltip from '@/components/ui/ChartTooltip';

interface RecoveryChartProps {
  data: Array<{ category: string; value: number }>;
}

const RecoveryChart: React.FC<RecoveryChartProps> = ({ data }) => {
  const CustomTooltipContent = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const formattedPayload = payload.map((entry: any) => ({
      ...entry,
      name: 'Value',
      unit: label.includes('Rate') ? '%' : label.includes('Time') ? ' days' : ''
    }));

    return (
      <ChartTooltip
        active={active}
        payload={formattedPayload}
        label={label}  
      />
    );
  };

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="category" 
          fontSize={12}
          tick={{ fill: '#0369a1' }}
        />
        <YAxis 
          fontSize={12} 
          label={{ value: 'Value', angle: -90, position: 'insideLeft' }}
          tick={{ fill: '#0369a1' }}
        />
        <CustomTooltipContent />
        <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RecoveryChart;
