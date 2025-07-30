
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock } from 'lucide-react';
import HelpTooltip from '@/components/shared/HelpTooltip';

interface ConversionTimeDistributionProps {
  conversionTimeDistribution: Array<{
    timeRange: string;
    conversions: number;
    percentage: number;
  }>;
}

const ConversionTimeDistribution: React.FC<ConversionTimeDistributionProps> = ({ conversionTimeDistribution }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800 flex items-center gap-1">
            <Clock className="w-5 h-5 mr-2" />
            Conversion Time Distribution
            <HelpTooltip helpId="trial-conversion-time-distribution" />
          </CardTitle>
        </div>
        <CardDescription>How quickly trial users convert to paid subscriptions</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={conversionTimeDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="timeRange" fontSize={12} tick={{ fill: '#075985' }} />
            <YAxis fontSize={12} tick={{ fill: '#075985' }} />
            <Tooltip 
              formatter={(value) => [`${value} conversions`, 'Count']}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #bae6fd',
                borderRadius: '6px'
              }}
            />
            <Bar dataKey="conversions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ConversionTimeDistribution;
