
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../../components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { UserCheck } from 'lucide-react';
import { RetentionData } from '../../../types/subscription';
import { HelpTooltip } from '../../../components';

interface RetentionChartProps {
  retentionData: RetentionData[];
}

const RetentionChart: React.FC<RetentionChartProps> = ({ retentionData }) => {
  const chartConfig = {
    month1: {
      label: "Month 1",
      color: "#3b82f6",
    },
    month3: {
      label: "Month 3", 
      color: "#8b5cf6",
    },
    month6: {
      label: "Month 6",
      color: "#10b981",
    },
    month12: {
      label: "Month 12",
      color: "#f59e0b",
    },
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Retention by Cohort
          </CardTitle>
          <HelpTooltip helpId="retention-by-cohort" />
        </div>
        <p className="text-sm text-gray-600">Monthly retention rates over time</p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line 
                type="monotone"
                dataKey="month1" 
                stroke="var(--color-month1)" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone"
                dataKey="month3" 
                stroke="var(--color-month3)" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone"
                dataKey="month6" 
                stroke="var(--color-month6)" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone"
                dataKey="month12" 
                stroke="var(--color-month12)" 
                strokeWidth={2}
                dot={{ r: 4 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RetentionChart;
