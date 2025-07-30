
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';
import { HelpTooltip } from '@/components';
import { useSubscriptionGrowthData } from '@/hooks/useSubscriptionData';
import { useDateRangeFromPeriod } from '@/hooks/useDateRangeFromPeriod';
import ChartTooltip from '@/components/ui/ChartTooltip';
import { useInteractiveTrendsConfig } from './interactive-trends/useInteractiveTrendsConfig';
import InteractiveTrendsControls from './interactive-trends/InteractiveTrendsControls';
import InteractiveTrendsChartRenderer from './interactive-trends/InteractiveTrendsChartRenderer';
import InteractiveTrendsLoading from './interactive-trends/InteractiveTrendsLoading';
import InteractiveTrendsError from './interactive-trends/InteractiveTrendsError';

interface InteractiveTrendsChartProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  selectedPeriod?: string;
}

const InteractiveTrendsChart: React.FC<InteractiveTrendsChartProps> = ({ 
  dateRange, 
  selectedPeriod = 'last_30_days' 
}) => {
  const [chartType, setChartType] = useState<'line' | 'area'>('line');
  const [dataView, setDataView] = useState<'circulation' | 'activity'>('circulation');

  const effectiveDateRange = useDateRangeFromPeriod({
    selectedPeriod,
    customDateRange: dateRange
  });

  const { data: trendsData, isLoading: trendsLoading, error: trendsError } = useSubscriptionGrowthData(effectiveDateRange);
  const { chartConfig } = useInteractiveTrendsConfig();

  if (trendsLoading) {
    return <InteractiveTrendsLoading />;
  }

  if (trendsError || !trendsData) {
    return <InteractiveTrendsError />;
  }

  // Custom tooltip content component
  const CustomTooltipContent = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    // Add units and comparison data
    const formattedPayload = payload.map((entry: any) => ({
      ...entry,
      unit: dataView === 'circulation' ? '' : '/mo'
    }));

    // Calculate comparison data if available
    const currentIndex = trendsData.findIndex(item => item.month === label);
    const previousData = currentIndex > 0 ? trendsData[currentIndex - 1] : null;
    let comparisonData = null;

    if (previousData && payload.length > 0) {
      const currentValue = payload[0].value;
      const previousValue = previousData[payload[0].dataKey];
      const change = ((currentValue - previousValue) / previousValue * 100);
      
      comparisonData = {
        value: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`,
        label: 'vs last month',
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
      };
    }

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
    <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CardTitle className="text-ocean-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-ocean-600" />
              Interactive Circulation Trends
            </CardTitle>
            <HelpTooltip helpId="circulation-trends" />
          </div>
          <InteractiveTrendsControls
            dataView={dataView}
            onDataViewChange={setDataView}
            chartType={chartType}
            onChartTypeChange={setChartType}
          />
        </div>
        <p className="text-sm text-gray-600">
          {dataView === 'circulation' 
            ? 'Total circulation numbers by subscription type' 
            : 'New subscriptions vs churn activity'
          }
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-[400px]">
          <InteractiveTrendsChartRenderer
            data={trendsData}
            chartType={chartType}
            dataView={dataView}
            customTooltip={CustomTooltipContent}
          />
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default InteractiveTrendsChart;
