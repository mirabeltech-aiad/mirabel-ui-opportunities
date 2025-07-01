
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@OpportunityComponents/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Activity, PieChart as PieChartIcon } from 'lucide-react';
import { useDesignSystem } from '@/hooks/useDesignSystem';

const PipelineHealthTab = ({ stageDistribution, pipelineHealth }) => {
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

  const COLORS = [
    chartColors.primary[0],
    chartColors.primary[1], 
    chartColors.primary[2],
    chartColors.primary[3],
    chartColors.primary[4]
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-white">
          <CardTitle className={`${getTitleClass()} flex items-center gap-2`}>
            <Activity className="h-5 w-5 text-blue-600" />
            Stage Distribution
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-ocean-500 hover:text-ocean-600" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Number of opportunities and their total value distributed across different sales stages</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <BarChart data={stageDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridLines} opacity={0.3} />
              <XAxis dataKey="stage" tick={{ fill: chartColors.axisText }} />
              <YAxis tick={{ fill: chartColors.axisText }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill={chartColors.primary[1]} name="Deal Count" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader className="bg-white">
          <CardTitle className={`${getTitleClass()} flex items-center gap-2`}>
            <PieChartIcon className="h-5 w-5 text-purple-600" />
            Value by Stage
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-ocean-500 hover:text-ocean-600" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Total pipeline value distribution across sales stages to identify where the most revenue potential lies</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <PieChart>
              <Pie
                data={stageDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {stageDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default PipelineHealthTab;
