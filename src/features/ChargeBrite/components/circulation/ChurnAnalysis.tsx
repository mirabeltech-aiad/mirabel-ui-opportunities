
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { AlertTriangle, TrendingDown } from 'lucide-react';
import { HelpTooltip } from '../../components';
import { useSubscriptionChurnData } from '../../hooks/useSubscriptionData';
import { useDateRangeFromPeriod } from '../../hooks/useDateRangeFromPeriod';
import ChartTooltip from '../../components/ui/ChartTooltip';

interface ChurnAnalysisProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  selectedPeriod?: string;
}

const ChurnAnalysis: React.FC<ChurnAnalysisProps> = ({ 
  dateRange, 
  selectedPeriod = 'last_30_days' 
}) => {
  const effectiveDateRange = useDateRangeFromPeriod({
    selectedPeriod,
    customDateRange: dateRange
  });

  const { data: churnData, isLoading, error } = useSubscriptionChurnData(effectiveDateRange);

  const chartConfig = {
    churnRate: {
      label: "Churn Rate",
      color: "#f43f5e",
    },
  };

  // Custom tooltip content
  const CustomTooltipContent = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    // Add percentage unit and comparison
    const formattedPayload = payload.map((entry: any) => ({
      ...entry,
      unit: '%'
    }));

    // Calculate comparison with previous month
    const currentIndex = churnData.findIndex(item => item.month === label);
    const previousData = currentIndex > 0 ? churnData[currentIndex - 1] : null;
    let comparisonData = null;

    if (previousData) {
      const currentValue = payload[0].value;
      const previousValue = previousData.churnRate;
      const change = currentValue - previousValue;
      
      comparisonData = {
        value: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`,
        label: 'vs last month',
        trend: change < 0 ? 'up' : change > 0 ? 'down' : 'neutral' // Lower churn is better
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

  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm rounded-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Churn Analysis
          </CardTitle>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] bg-gray-100 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (error || !churnData) {
    return (
      <Card className="bg-white shadow-sm rounded-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Churn Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 p-4 bg-red-50 rounded-lg">
            Error loading churn data
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentChurnRate = churnData[churnData.length - 1]?.churnRate || 0;
  const avgChurnRate = churnData.reduce((sum, item) => sum + item.churnRate, 0) / churnData.length;

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CardTitle className="text-ocean-800 flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Churn Analysis
            </CardTitle>
            <HelpTooltip helpId="churn-analysis" />
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Current: {currentChurnRate.toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span>Avg: {avgChurnRate.toFixed(1)}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">
              Churn rate {currentChurnRate < avgChurnRate ? 'improved' : 'increased'} this month
            </span>
          </div>
        </div>
        
        <ChartContainer config={chartConfig} className="w-full h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={churnData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
              <Bar 
                dataKey="churnRate" 
                fill="#f43f5e" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ChurnAnalysis;
