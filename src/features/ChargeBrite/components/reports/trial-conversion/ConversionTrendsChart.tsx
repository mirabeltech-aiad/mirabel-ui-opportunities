
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import HelpTooltip from '@/components/shared/HelpTooltip';

interface ConversionTrendsChartProps {
  monthlyConversionTrends: Array<{
    month: string;
    conversionRate: number;
    trials: number;
    conversions: number;
  }>;
}

const ConversionTrendsChart: React.FC<ConversionTrendsChartProps> = ({ monthlyConversionTrends }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800 flex items-center gap-1">
            <TrendingUp className="w-5 h-5 mr-2" />
            Monthly Conversion Trends
            <HelpTooltip helpId="trial-conversion-trends" />
          </CardTitle>
        </div>
        <CardDescription>Trial to paid conversion rates over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyConversionTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" fontSize={12} tick={{ fill: '#075985' }} />
            <YAxis fontSize={12} tick={{ fill: '#075985' }} />
            <Tooltip 
              formatter={(value, name) => [`${value}%`, 'Conversion Rate']}
              labelFormatter={(label) => `Month: ${label}`}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #bae6fd',
                borderRadius: '6px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="conversionRate" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ConversionTrendsChart;
