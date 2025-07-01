
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Target, Activity, AlertTriangle, TrendingUp } from 'lucide-react';
import { useDesignSystem } from '@/hooks/useDesignSystem';
import MetricTooltip from '../MetricTooltip';

const PredictiveAnalyticsMetrics = ({ predictiveMetrics, pipelineHealth, forecastPeriod }) => {
  const { metricCardColors } = useDesignSystem();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricTooltip
        title="Predicted Revenue"
        description="AI-powered revenue prediction for the selected forecast period based on current pipeline health, historical conversion patterns, and market trends."
        calculation="Machine learning model analyzing pipeline velocity, stage probabilities, and seasonal patterns"
        period={`${forecastPeriod} forecast period`}
        benchmarks={{
          good: "Consistent growth trajectory",
          average: "Stable revenue prediction",
          concerning: "Declining revenue forecast"
        }}
      >
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Predicted Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${metricCardColors.connection}`}>${(predictiveMetrics.predictedRevenue / 1000000).toFixed(1)}M</div>
            <p className={`text-xs ${metricCardColors.connectionSubtitle} flex items-center gap-1`}>
              <TrendingUp className="h-3 w-3 text-green-500" />
              {predictiveMetrics.revenueGrowth > 0 ? '+' : ''}{predictiveMetrics.revenueGrowth.toFixed(1)}% vs current period
            </p>
          </CardContent>
        </Card>
      </MetricTooltip>

      <MetricTooltip
        title="Expected Deals"
        description="Number of deals expected to close in the forecast period based on AI analysis of stage progression rates and historical conversion patterns."
        calculation="Sum of (opportunities × stage-specific probability × time-weighted factors)"
        period={`${forecastPeriod} forecast period`}
        benchmarks={{
          good: "Above historical average",
          average: "Within historical range",
          concerning: "Below historical average"
        }}
      >
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Expected Deals</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${metricCardColors.activity}`}>{Math.round(predictiveMetrics.expectedDeals)}</div>
            <p className={`text-xs ${metricCardColors.activitySubtitle}`}>Deals likely to close</p>
          </CardContent>
        </Card>
      </MetricTooltip>

      <MetricTooltip
        title="Pipeline Health Score"
        description="Overall health assessment of your sales pipeline based on stage distribution, velocity metrics, and conversion patterns."
        calculation="Composite score from stage balance, velocity trends, and conversion efficiency"
        period="Current pipeline analysis"
        benchmarks={{
          good: "75-100% health score",
          average: "50-74% health score",
          concerning: "Below 50% health score"
        }}
      >
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Pipeline Health</CardTitle>
            <Activity className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${metricCardColors.service}`}>{pipelineHealth.healthScore}%</div>
            <Badge variant={pipelineHealth.healthScore >= 75 ? "default" : pipelineHealth.healthScore >= 50 ? "secondary" : "destructive"}>
              {pipelineHealth.status}
            </Badge>
          </CardContent>
        </Card>
      </MetricTooltip>

      <MetricTooltip
        title="At Risk Deals"
        description="Number of opportunities identified as high-risk for loss based on stagnation time, activity levels, and behavioral pattern analysis."
        calculation="AI risk scoring based on stage duration, activity frequency, and deal characteristics"
        period="Current active opportunities"
        benchmarks={{
          good: "Less than 10% of pipeline at risk",
          average: "10-20% of pipeline at risk", 
          concerning: "More than 20% at risk"
        }}
      >
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">At Risk Deals</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${metricCardColors.time}`}>{pipelineHealth.atRiskDeals}</div>
            <p className={`text-xs ${metricCardColors.timeSubtitle}`}>Require immediate attention</p>
          </CardContent>
        </Card>
      </MetricTooltip>
    </div>
  );
};

export default PredictiveAnalyticsMetrics;
