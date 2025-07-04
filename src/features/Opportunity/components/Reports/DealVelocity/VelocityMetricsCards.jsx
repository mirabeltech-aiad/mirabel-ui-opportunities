import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, TrendingUp, TrendingDown, AlertTriangle, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { useDesignSystem } from '@/features/Opportunity/hooks/useDesignSystem';

const VelocityMetricsCards = ({ velocityMetrics = {}, bottlenecks = [], velocityTrends = [] }) => {
  const { metricCardColors } = useDesignSystem();

  // Ensure we have safe defaults
  const safeVelocityMetrics = {
    avgSalesCycle: 0,
    stageVelocity: [],
    fastestDeal: 0,
    slowestDeal: 0,
    totalDeals: 0,
    ...velocityMetrics
  };

  const safeBottlenecks = Array.isArray(bottlenecks) ? bottlenecks : [];

  const getFastestStage = () => {
    if (!safeVelocityMetrics.stageVelocity || safeVelocityMetrics.stageVelocity.length === 0) {
      return { stage: 'N/A', avgDays: 0 };
    }
    return safeVelocityMetrics.stageVelocity.reduce((min, stage) => 
      (stage.avgDays || 0) < (min.avgDays || 0) ? stage : min
    );
  };

  const getSlowestStage = () => {
    if (!safeVelocityMetrics.stageVelocity || safeVelocityMetrics.stageVelocity.length === 0) {
      return { stage: 'N/A', avgDays: 0 };
    }
    return safeVelocityMetrics.stageVelocity.reduce((max, stage) => 
      (stage.avgDays || 0) > (max.avgDays || 0) ? stage : max
    );
  };

  // Calculate overall trend from velocity trends
  const getOverallTrend = () => {
    if (!velocityTrends || velocityTrends.length < 2) {
      return { change: 0, changePercent: 0 };
    }
    
    const latest = velocityTrends[velocityTrends.length - 1];
    const previous = velocityTrends[velocityTrends.length - 2];
    
    const change = latest.avgVelocity - previous.avgVelocity;
    const changePercent = previous.avgVelocity > 0 
      ? Math.round(((latest.avgVelocity - previous.avgVelocity) / previous.avgVelocity) * 100)
      : 0;
    
    return { change, changePercent };
  };

  const getTrendIcon = (changePercent) => {
    if (changePercent > 0) return <ArrowUp className="h-3 w-3" />;
    if (changePercent < 0) return <ArrowDown className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  };

  const getTrendColor = (changePercent, isVelocity = false) => {
    // For velocity, lower is better (faster cycle), so reverse the colors
    if (isVelocity) {
      if (changePercent > 0) return 'text-red-600'; // Slower is bad
      if (changePercent < 0) return 'text-green-600'; // Faster is good
    } else {
      if (changePercent > 0) return 'text-green-600';
      if (changePercent < 0) return 'text-red-600';
    }
    return 'text-gray-400';
  };

  const overallTrend = getOverallTrend();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black">Avg Sales Cycle</CardTitle>
          <Calendar className="h-4 w-4 text-rose-600" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${metricCardColors.time}`}>{safeVelocityMetrics.avgSalesCycle} days</div>
          <p className={`text-xs ${getTrendColor(overallTrend.changePercent, true)} flex items-center gap-1`}>
            {getTrendIcon(overallTrend.changePercent)}
            {overallTrend.changePercent !== 0 ? (
              <>
                {Math.abs(overallTrend.changePercent)}% vs last month
                {overallTrend.changePercent < 0 ? ' (faster)' : ' (slower)'}
              </>
            ) : (
              'No change vs last month'
            )}
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black">Fastest Deal</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${metricCardColors.connection}`}>
            {safeVelocityMetrics.fastestDeal || 'N/A'}
            {safeVelocityMetrics.fastestDeal ? ' days' : ''}
          </div>
          <p className={`text-xs ${metricCardColors.connectionSubtitle}`}>
            Record time to close
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black">Slowest Deal</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {safeVelocityMetrics.slowestDeal || 'N/A'}
            {safeVelocityMetrics.slowestDeal ? ' days' : ''}
          </div>
          <p className="text-xs text-red-300">
            Longest time to close
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black">Bottlenecks</CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${metricCardColors.activity}`}>{safeBottlenecks.length}</div>
          <p className={`text-xs ${metricCardColors.activitySubtitle}`}>Stages above benchmark</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VelocityMetricsCards;
