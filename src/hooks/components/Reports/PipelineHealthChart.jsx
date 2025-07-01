
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Activity } from 'lucide-react';
import { useDesignSystem } from '@/hooks/useDesignSystem';

const PipelineHealthChart = ({ data }) => {
  const { getTitleClass, chartColors } = useDesignSystem();

  const chartConfig = {
    count: {
      label: "Deal Count",
      color: chartColors.primary[1]
    },
    value: {
      label: "Pipeline Value",
      color: chartColors.primary[0]
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-white">
        <CardTitle className={`${getTitleClass()} flex items-center gap-2`}>
          <Activity className="h-5 w-5 text-blue-600" />
          Pipeline Distribution by Stage
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-ocean-500 hover:text-ocean-600" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">Distribution of open opportunities across different sales stages showing both deal count and total value to identify bottlenecks</p>
            </TooltipContent>
          </Tooltip>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridLines} opacity={0.3} />
            <XAxis dataKey="stage" tick={{ fill: chartColors.axisText }} />
            <YAxis tick={{ fill: chartColors.axisText }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill={chartColors.primary[1]} name="Deal Count" />
            <Bar dataKey="value" fill={chartColors.primary[0]} name="Pipeline Value" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PipelineHealthChart;
