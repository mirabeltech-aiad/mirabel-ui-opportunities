
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer } from '../../../components/ui/chart';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import ChartTooltip from '../../../components/ui/ChartTooltip';

interface CACData {
  channel: string;
  cac: number;
  customers: number;
}

interface CACByChannelChartProps {
  data: CACData[];
}

const CACByChannelChart: React.FC<CACByChannelChartProps> = ({ data }) => {
  const chartConfig = {
    cac: {
      label: "CAC",
      color: "#3b82f6",
    },
  };

  // Custom tooltip content
  const CustomTooltipContent = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    // Add dollar unit and show customer count
    const formattedPayload = payload.map((entry: any) => ({
      ...entry,
      unit: '$'
    }));

    // Find customer count for this channel
    const channelData = data.find(item => item.channel === label);
    const comparisonData = channelData ? {
      value: `${channelData.customers} customers`,
      label: 'acquired',
      trend: 'neutral' as const
    } : null;

    return (
      <ChartTooltip
        active={active}
        payload={formattedPayload}
        label={label}
        showComparison={!!comparisonData}
        comparisonData={comparisonData}
      />
    );
  };

  return (
    <Card size="large" className="bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <Target className="w-5 h-5 mr-2" />
            Customer Acquisition Cost by Channel
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400 hover:text-ocean-600 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm p-3 bg-white border border-gray-200 shadow-lg rounded-lg text-gray-900">
                <div>
                  <h4 className="font-semibold text-ocean-800 mb-1">CAC by Channel</h4>
                  <p className="text-sm text-gray-600">Breakdown of customer acquisition costs by individual marketing channels, showing which channels are most cost-effective.</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </div>
        <CardDescription>
          Average cost to acquire a customer across different marketing channels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="channel" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
                tick={{ fill: '#075985' }}
              />
              <YAxis tick={{ fill: '#075985' }} />
              <CustomTooltipContent />
              <Bar 
                dataKey="cac" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CACByChannelChart;
