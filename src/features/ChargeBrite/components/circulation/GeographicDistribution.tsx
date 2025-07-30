

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { MapPin } from 'lucide-react';
import { HelpTooltip } from '../../components';
import { useSubscriptionGeographicData } from '../../hooks/useSubscriptionData';
import ChartTooltip from '../../components/ui/ChartTooltip';

const GeographicDistribution = () => {
  const { data: geoData, isLoading, error } = useSubscriptionGeographicData();

  const chartConfig = {
    subscribers: {
      label: "Subscribers",
      color: "#3b82f6",
    },
  };

  // Custom tooltip content
  const CustomTooltipContent = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    // Calculate percentage of total if possible
    const totalSubscribers = geoData?.reduce((sum, item) => sum + item.subscribers, 0) || 0;
    const currentValue = payload[0]?.value || 0;
    const percentage = totalSubscribers > 0 ? ((currentValue / totalSubscribers) * 100) : 0;

    const comparisonData = {
      value: `${percentage.toFixed(1)}%`,
      label: 'of total subscribers',
      trend: 'neutral' as const
    };

    return (
      <ChartTooltip
        active={active}
        payload={payload}
        label={label}
        showComparison={true}
        comparisonData={comparisonData}
      />
    );
  };

  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm rounded-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Geographic Distribution
          </CardTitle>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-gray-100 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (error || !geoData) {
    return (
      <Card className="bg-white shadow-sm rounded-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Geographic Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 p-4 bg-red-50 rounded-lg">
            Error loading geographic data
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div>
              <CardTitle className="text-ocean-800 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Geographic Distribution
              </CardTitle>
              <p className="text-sm text-gray-600">Subscriber distribution by region</p>
            </div>
            <HelpTooltip helpId="geographic-distribution" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={geoData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="region" 
                tick={{ fill: '#075985', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fill: '#075985', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <CustomTooltipContent />
              <Bar 
                dataKey="subscribers" 
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

export default GeographicDistribution;
