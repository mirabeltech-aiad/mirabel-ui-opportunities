
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, Cell } from 'recharts';
import HelpTooltip from '../../shared/HelpTooltip';

const TOUCHPOINT_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

interface TouchpointsAttributionProps {
  touchpoints: Array<{
    touchpoint: string;
    attributedRevenue: number;
  }>;
}

const TouchpointsAttribution: React.FC<TouchpointsAttributionProps> = ({ touchpoints }) => {
  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "#3b82f6",
    },
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Multi-Touch Attribution Model</CardTitle>
          <HelpTooltip helpId="revenue-attribution" />
        </div>
      </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart data={touchpoints}>
              <XAxis dataKey="touchpoint" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="attributedRevenue">
                {touchpoints.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={TOUCHPOINT_COLORS[index % TOUCHPOINT_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
    </Card>
  );
};

export default TouchpointsAttribution;
