
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@OpportunityComponents/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, TrendingUp } from 'lucide-react';
import { useDesignSystem } from '@/hooks/useDesignSystem';

const PipelineTrendsTab = ({ pipelineTrend }) => {
  const { getTitleClass, chartColors } = useDesignSystem();

  const chartConfig = {
    value: {
      label: "Pipeline Value",
      color: chartColors.primary[0]
    },
    count: {
      label: "Deal Count",
      color: chartColors.primary[1]
    },
    winRate: {
      label: "Win Rate",
      color: chartColors.primary[2]
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-white">
          <CardTitle className={`${getTitleClass()} flex items-center gap-2`}>
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Pipeline Value Trends
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-ocean-500 hover:text-ocean-600" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Historical view of pipeline value over time showing growth trends and patterns</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <LineChart data={pipelineTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridLines} opacity={0.3} />
              <XAxis dataKey="month" tick={{ fill: chartColors.axisText }} />
              <YAxis 
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                tick={{ fill: chartColors.axisText }} 
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={chartColors.primary[0]} 
                strokeWidth={2}
                name="Pipeline Value"
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader className="bg-white">
          <CardTitle className={`${getTitleClass()} flex items-center gap-2`}>
            <TrendingUp className="h-5 w-5 text-green-600" />
            Deal Count & Win Rate Trends
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-ocean-500 hover:text-ocean-600" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Tracking the number of deals and conversion rates over time to identify performance patterns</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <LineChart data={pipelineTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridLines} opacity={0.3} />
              <XAxis dataKey="month" tick={{ fill: chartColors.axisText }} />
              <YAxis tick={{ fill: chartColors.axisText }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke={chartColors.primary[1]} 
                strokeWidth={2}
                name="Deal Count"
              />
              <Line 
                type="monotone" 
                dataKey="winRate" 
                stroke={chartColors.primary[2]} 
                strokeWidth={2}
                name="Win Rate %"
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default PipelineTrendsTab;
