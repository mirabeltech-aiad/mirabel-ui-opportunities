
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { FunnelChart, Funnel, LabelList, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { FunnelStep } from '../../../types/subscription';
import { HelpTooltip } from '../../../components';

interface AcquisitionFunnelChartProps {
  funnelData: FunnelStep[];
}

const AcquisitionFunnelChart: React.FC<AcquisitionFunnelChartProps> = ({ funnelData }) => {
  const chartConfig = {
    prospects: {
      label: "Prospects",
      color: "#3b82f6",
    },
    trials: {
      label: "Trials",
      color: "#8b5cf6",
    },
    subscriptions: {
      label: "Subscriptions",
      color: "#10b981",
    },
    renewals: {
      label: "Renewals",
      color: "#f59e0b",
    },
    churned: {
      label: "Churned",
      color: "#ef4444",
    },
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Acquisition Funnel
          </CardTitle>
          <HelpTooltip helpId="acquisition-funnel" />
        </div>
        <p className="text-sm text-gray-600">Customer journey from prospect to subscriber</p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Funnel
                dataKey="count"
                data={funnelData}
                isAnimationActive={true}
                fill="var(--color-prospects)"
              >
                <LabelList position="center" fill="#fff" stroke="none" />
              </Funnel>
              <ChartTooltip content={<ChartTooltipContent />} />
            </FunnelChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AcquisitionFunnelChart;
