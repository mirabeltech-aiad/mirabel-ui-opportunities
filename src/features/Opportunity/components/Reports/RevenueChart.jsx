
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, DollarSign } from 'lucide-react';
import { useDesignSystem } from '@/features/Opportunity/hooks/useDesignSystem';

const RevenueChart = ({ data }) => {
  const { getTitleClass, chartColors } = useDesignSystem();

  const chartConfig = {
    actual: {
      label: "Actual Revenue",
      color: chartColors.primary[0]
    },
    forecast: {
      label: "Forecasted Revenue", 
      color: chartColors.primary[2]
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-white">
        <CardTitle className={`${getTitleClass()} flex items-center gap-2`}>
          <DollarSign className="h-5 w-5 text-green-600" />
          Revenue Trend & Forecast
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-ocean-500 hover:text-ocean-600" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">Shows actual revenue achieved and forecasted future revenue based on pipeline progression and historical conversion rates</p>
            </TooltipContent>
          </Tooltip>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridLines} opacity={0.3} />
            <XAxis dataKey="month" tick={{ fill: chartColors.axisText }} />
            <YAxis 
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              tick={{ fill: chartColors.axisText }} 
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke={chartColors.primary[0]} 
              strokeWidth={2}
              name="Actual Revenue"
            />
            <Line 
              type="monotone" 
              dataKey="forecast" 
              stroke={chartColors.primary[2]} 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Forecasted Revenue"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
