import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '../../../../components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import HelpTooltip from '../../../../components/shared/HelpTooltip';
import { useFilteredCirculationData } from '../../../../hooks/useFilteredData';
import ChartTooltip from '../../../../components/ui/ChartTooltip';

const GrowthMetrics = () => {
  const { filteredGrowthData, selectedProductNames } = useFilteredCirculationData();

  const chartConfig = {
    total: {
      label: "Total Circulation",
      color: "#3b82f6",
    },
    print: {
      label: "Print",
      color: "#10b981",
      },
      digital: {
      label: "Digital",
      color: "#8b5cf6",
    },
  };

  // Custom tooltip content
  const CustomTooltipContent = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    // Calculate comparison data
    const currentIndex = filteredGrowthData.findIndex(item => item.month === label);
    const previousData = currentIndex > 0 ? filteredGrowthData[currentIndex - 1] : null;
    let comparisonData = null;

    if (previousData && payload.length > 0) {
      const currentTotal = payload.find((p: any) => p.dataKey === 'total')?.value || 0;
      const previousTotal = previousData.total;
      const change = ((currentTotal - previousTotal) / previousTotal * 100);
      
      comparisonData = {
        value: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`,
        label: 'Total growth vs prev month',
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
      };
    }

    return (
      <ChartTooltip
        active={active}
        payload={payload}
        label={label}
        showComparison={!!comparisonData}
        comparisonData={comparisonData}
      />
    );
  };

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CardTitle className="text-ocean-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Growth Trends
            </CardTitle>
            <HelpTooltip helpId="growth-trends" />
          </div>
        </div>
        <p className="text-sm text-gray-600">
          6-month circulation growth analysis - {selectedProductNames}
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredGrowthData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#075985', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fill: '#075985', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <CustomTooltipContent />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 2, stroke: "#ffffff", r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="print" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: "#10b981", strokeWidth: 2, stroke: "#ffffff", r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="digital" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                dot={{ fill: "#8b5cf6", strokeWidth: 2, stroke: "#ffffff", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default GrowthMetrics;