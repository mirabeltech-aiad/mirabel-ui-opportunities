
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';
import { useDesignSystem } from '@/features/Opportunity/hooks/useDesignSystem';

const LossTrendsTab = ({ lossTrends }) => {
  const { getTitleClass, chartColors } = useDesignSystem();

  // Ensure safe defaults
  const safeLossTrends = Array.isArray(lossTrends) ? lossTrends : [];

  const chartConfig = {
    lostDealsCount: {
      label: "Lost Deals",
      color: chartColors.primary[3]
    },
    lostValue: {
      label: "Lost Value",
      color: chartColors.primary[1]
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="bg-gray-50">
          <CardTitle className={getTitleClass()}>Monthly Loss Trends</CardTitle>
        </CardHeader>
        <CardContent>
          {safeLossTrends.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[300px]">
              <LineChart data={safeLossTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridLines} opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: chartColors.axisText }}
                />
                <YAxis 
                  tick={{ fill: chartColors.axisText }}
                />
                <ChartTooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload[0]) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                          <p className="font-medium">{label} {data.year}</p>
                          <p className="text-sm text-gray-600">
                            Lost Deals: {data.lostDealsCount}
                          </p>
                          <p className="text-sm text-gray-600">
                            Lost Value: ${(data.lostValue / 1000000).toFixed(1)}M
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="lostDealsCount" 
                  stroke={chartColors.primary[3]} 
                  strokeWidth={2}
                  name="Lost Deals"
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No loss trends data available
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-gray-50">
          <CardTitle className={getTitleClass()}>Lost Value by Month</CardTitle>
        </CardHeader>
        <CardContent>
          {safeLossTrends.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={safeLossTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridLines} opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: chartColors.axisText }}
                />
                <YAxis 
                  tick={{ fill: chartColors.axisText }}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <ChartTooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload[0]) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                          <p className="font-medium">{label} {data.year}</p>
                          <p className="text-sm text-gray-600">
                            Lost Value: ${(data.lostValue / 1000000).toFixed(1)}M
                          </p>
                          <p className="text-sm text-gray-600">
                            Lost Deals: {data.lostDealsCount}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="lostValue" 
                  fill={chartColors.primary[1]}
                  name="Lost Value"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No loss value trends data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LossTrendsTab;
