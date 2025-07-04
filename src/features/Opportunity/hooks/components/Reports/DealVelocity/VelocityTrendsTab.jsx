
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useDesignSystem } from '@/features/Opportunity/hooks/useDesignSystem';

const VelocityTrendsTab = ({ velocityTrends, chartConfig }) => {
  const { getTitleClass, chartColors } = useDesignSystem();

  return (
    <Card>
      <CardHeader className="bg-gray-50">
        <CardTitle className={`${getTitleClass()} flex items-center gap-2`}>
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Sales Cycle Velocity Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <LineChart data={velocityTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridLines} opacity={0.3} />
            <XAxis dataKey="month" tick={{ fill: chartColors.axisText }} />
            <YAxis 
              label={{ value: 'Days', angle: -90, position: 'insideLeft' }} 
              tick={{ fill: chartColors.axisText }} 
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line 
              type="monotone" 
              dataKey="avgVelocity" 
              stroke={chartColors.primary[1]} 
              strokeWidth={2}
              name="Avg Cycle Time"
            />
            <Line 
              type="monotone" 
              dataKey="target" 
              stroke={chartColors.primary[0]} 
              strokeDasharray="5 5"
              name="Target"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default VelocityTrendsTab;
