
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingDown } from 'lucide-react';
import { HelpTooltip } from '@/components';

interface NetMRRTrendChartProps {
  data: Array<{
    month: string;
    grossChurn: number;
    netChurn: number;
    expansion: number;
  }>;
}

const NetMRRTrendChart: React.FC<NetMRRTrendChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800 flex items-center">
            <TrendingDown className="w-5 h-5 mr-2" />
            Net MRR Churn Trends
          </CardTitle>
          <HelpTooltip helpId="net-mrr-trend-chart" />
        </div>
        <CardDescription>Monthly trend of gross vs net MRR churn rates</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" fontSize={12} tick={{ fill: '#075985' }} />
            <YAxis fontSize={12} tick={{ fill: '#075985' }} />
            <Tooltip 
              formatter={(value, name) => [`${value}%`, name === 'grossChurn' ? 'Gross Churn' : name === 'netChurn' ? 'Net Churn' : 'Expansion']}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #bae6fd',
                borderRadius: '6px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="grossChurn" 
              stroke="#f43f5e" 
              strokeWidth={2}
              dot={{ fill: '#f43f5e', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="netChurn" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="expansion" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default NetMRRTrendChart;
