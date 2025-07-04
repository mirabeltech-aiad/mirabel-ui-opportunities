
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown, AlertTriangle, BarChart3, Target } from 'lucide-react';
import { useDesignSystem } from '@/features/Opportunity/hooks/useDesignSystem';

const LostDealMetricsCards = ({ lostDealsData }) => {
  const { metricCardColors } = useDesignSystem();

  // Ensure safe defaults
  const safeData = {
    summary: { totalLostDeals: 0, totalLostValue: 0, avgLostDealSize: 0, avgDaysToLoss: 0 },
    lossReasons: [],
    repAnalysis: [],
    ...lostDealsData
  };

  const getTopLossReason = () => {
    if (!safeData.lossReasons || safeData.lossReasons.length === 0) {
      return { reason: 'No Data', percentage: 0 };
    }
    return safeData.lossReasons.reduce((max, reason) => 
      (reason.count || 0) > (max.count || 0) ? reason : max
    );
  };

  const getWorstPerformingRep = () => {
    if (!safeData.repAnalysis || safeData.repAnalysis.length === 0) {
      return { repName: 'No Data', lossRate: 0 };
    }
    return safeData.repAnalysis.reduce((worst, rep) => 
      (rep.lossRate || 0) > (worst.lossRate || 0) ? rep : worst
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black">Total Lost Deals</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${metricCardColors.activity}`}>
            {safeData.summary.totalLostDeals}
          </div>
          <p className={`text-xs ${metricCardColors.activitySubtitle}`}>
            Deals lost in period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black">Lost Deal Value</CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${metricCardColors.connection}`}>
            ${((safeData.summary.totalLostValue || 0) / 1000000).toFixed(1)}M
          </div>
          <p className={`text-xs ${metricCardColors.connectionSubtitle}`}>
            Avg: ${((safeData.summary.avgLostDealSize || 0) / 1000).toFixed(0)}K
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black">Top Loss Reason</CardTitle>
          <BarChart3 className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          {(() => {
            const topReason = getTopLossReason();
            return (
              <>
                <div className={`text-2xl font-bold ${metricCardColors.service}`}>
                  {topReason.reason.length > 15 ? topReason.reason.substring(0, 15) + '...' : topReason.reason}
                </div>
                <p className={`text-xs ${metricCardColors.serviceSubtitle}`}>
                  {topReason.percentage}% of losses
                </p>
              </>
            );
          })()}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black">Avg Days to Loss</CardTitle>
          <Target className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${metricCardColors.time}`}>
            {safeData.summary.avgDaysToLoss} days
          </div>
          <p className={`text-xs ${metricCardColors.timeSubtitle}`}>
            Average time before loss
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LostDealMetricsCards;
