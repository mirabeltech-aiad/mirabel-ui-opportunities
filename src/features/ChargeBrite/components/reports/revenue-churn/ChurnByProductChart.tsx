
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { colorTokens } from '@/styles/designTokens';
import { ChurnByProduct } from './types';
import ChartTooltip from '@/components/ui/ChartTooltip';
import { HelpTooltip } from '@/components';

interface ChurnByProductChartProps {
  data: ChurnByProduct[];
}

const ChurnByProductChart: React.FC<ChurnByProductChartProps> = ({ data }) => {
  const COLORS = [colorTokens.chartPrimary.rose, colorTokens.chartPrimary.amber, colorTokens.chartPrimary.blue];

  const CustomTooltipContent = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    const formattedPayload = [{
      name: 'Percentage',
      value: data.percentage,
      unit: '%',
      color: payload[0].payload.fill,
      dataKey: 'percentage'
    }];

    return (
      <ChartTooltip
        active={active}
        payload={formattedPayload}
        label={data.product}
      />
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Churn by Product</CardTitle>
          <HelpTooltip helpId="churn-by-product" />
        </div>
        <CardDescription>Revenue churn distribution by product</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="percentage"
              label={({ product, percentage }) => `${product}: ${percentage}%`}
              stroke={colorTokens.backgrounds.white}
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <CustomTooltipContent />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ChurnByProductChart;
