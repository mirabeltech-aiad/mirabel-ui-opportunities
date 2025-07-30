import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import HelpTooltip from '../../../components/shared/HelpTooltip';

interface ChannelData {
  channel: string;
  trials: number;
  conversions: number;
  conversionRate: number;
  fill: string;
}

interface TrialConversionChannelChartProps {
  channelData: ChannelData[];
}

const TrialConversionChannelChart: React.FC<TrialConversionChannelChartProps> = ({
  channelData
}) => {
  const chartConfig = {
    conversionRate: {
      label: "Conversion Rate",
      color: "hsl(221, 83%, 53%)",
    },
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="flex items-center text-ocean-800">
            <BarChart3 className="w-5 h-5 mr-2" />
            Trial Conversion Rate by Channel
          </CardTitle>
          <HelpTooltip helpId="trial-conversion-by-channel" />
        </div>
        <CardDescription>
          Conversion rates across different acquisition channels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={channelData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="channel" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis label={{ value: 'Conversion Rate (%)', angle: -90, position: 'insideLeft' }} />
              <ChartTooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border rounded shadow-lg">
                        <p className="font-medium">{label}</p>
                        <p className="text-blue-600">
                          Trials: {data.trials.toLocaleString()}
                        </p>
                        <p className="text-green-600">
                          Conversions: {data.conversions.toLocaleString()}
                        </p>
                        <p className="text-purple-600">
                          Rate: {data.conversionRate}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="conversionRate" radius={[4, 4, 0, 0]}>
                {channelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TrialConversionChannelChart;