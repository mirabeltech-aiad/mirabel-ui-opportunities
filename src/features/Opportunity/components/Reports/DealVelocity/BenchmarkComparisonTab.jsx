
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@OpportunityComponents/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Target } from 'lucide-react';
import { useDesignSystem } from '@/hooks/useDesignSystem';

const BenchmarkComparisonTab = ({ stageComparison, chartConfig }) => {
  const { getTitleClass, chartColors } = useDesignSystem();

  return (
    <Card>
      <CardHeader className="bg-gray-50">
        <CardTitle className={`${getTitleClass()} flex items-center gap-2`}>
          <Target className="h-5 w-5 text-indigo-600" />
          Stage Performance vs Benchmarks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <BarChart data={stageComparison}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridLines} opacity={0.3} />
            <XAxis dataKey="stage" tick={{ fill: chartColors.axisText }} />
            <YAxis 
              label={{ value: 'Days', angle: -90, position: 'insideLeft' }} 
              tick={{ fill: chartColors.axisText }} 
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="current" fill={chartColors.primary[1]} name="Current" />
            <Bar dataKey="industry" fill={chartColors.primary[3]} name="Industry Avg" />
            <Bar dataKey="target" fill={chartColors.primary[0]} name="Target" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default BenchmarkComparisonTab;
