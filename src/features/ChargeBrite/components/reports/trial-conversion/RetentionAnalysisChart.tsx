
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Shield } from 'lucide-react';
import HelpTooltip from '@/components/shared/HelpTooltip';

interface RetentionAnalysisChartProps {
  retentionData: Array<{
    period: string;
    retentionRate: number;
    customers: number;
  }>;
}

const RetentionAnalysisChart: React.FC<RetentionAnalysisChartProps> = ({ retentionData }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800 flex items-center gap-1">
            <Shield className="w-5 h-5 mr-2" />
            Post-Conversion Retention Analysis
            <HelpTooltip helpId="trial-retention-analysis" />
          </CardTitle>
        </div>
        <CardDescription>Customer retention rates after trial conversion</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={retentionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="period" fontSize={12} tick={{ fill: '#075985' }} />
            <YAxis fontSize={12} tick={{ fill: '#075985' }} />
            <Tooltip 
              formatter={(value, name) => [`${value}%`, 'Retention Rate']}
              labelFormatter={(label) => `Period: ${label}`}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #bae6fd',
                borderRadius: '6px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="retentionRate" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RetentionAnalysisChart;
