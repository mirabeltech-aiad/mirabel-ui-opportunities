
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@OpportunityComponents/ui/card';
import { DollarSign, Target, TrendingUp, Calendar } from 'lucide-react';
import MetricTooltip from '../MetricTooltip';

const SalesPerformanceKPICards = ({ kpis }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricTooltip
        title="Total Revenue"
        description="Total revenue generated from all won deals in the selected period. This represents actual closed business and recognized income."
        calculation="Sum of all opportunities with 'Won' status within the selected time frame"
        period="Based on deal close dates within your selected filter period"
        benchmarks={{
          good: "> $2M quarterly revenue",
          average: "$1M-2M quarterly revenue",
          concerning: "< $1M quarterly revenue"
        }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50">
            <CardTitle className="text-sm font-medium text-black">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${(kpis.totalRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-green-300">From {kpis.won} won deals</p>
          </CardContent>
        </Card>
      </MetricTooltip>

      <MetricTooltip
        title="Conversion Rate"
        description="Percentage of closed opportunities that resulted in wins. Higher conversion rates indicate more effective sales processes and better qualification."
        calculation="(Won Deals ÷ Total Closed Deals) × 100"
        period="Based on all closed deals within your selected time period"
        benchmarks={{
          good: "> 50% conversion rate",
          average: "25-50% conversion rate",
          concerning: "< 25% conversion rate"
        }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50">
            <CardTitle className="text-sm font-medium text-black">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{kpis.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-blue-300">{kpis.won} won / {kpis.won + kpis.lost} closed</p>
          </CardContent>
        </Card>
      </MetricTooltip>

      <MetricTooltip
        title="Average Deal Size"
        description="Average revenue value per won opportunity. Larger deal sizes indicate stronger value propositions and potentially better customer targeting."
        calculation="Total Revenue ÷ Number of Won Deals"
        period="Calculated from all won deals in your selected time period"
        benchmarks={{
          good: "> $100K average deal size",
          average: "$50K-100K average deal size",
          concerning: "< $50K average deal size"
        }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50">
            <CardTitle className="text-sm font-medium text-black">Avg Deal Size</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">${(kpis.avgDealSize / 1000).toFixed(0)}K</div>
            <p className="text-xs text-purple-300">Per won opportunity</p>
          </CardContent>
        </Card>
      </MetricTooltip>

      <MetricTooltip
        title="Average Sales Cycle"
        description="Average time from opportunity creation to deal closure. Shorter cycles indicate more efficient sales processes and faster revenue realization."
        calculation="Average days between opportunity creation date and close date for all won deals"
        period="Based on won deals within your selected time period"
        benchmarks={{
          good: "< 60 days sales cycle",
          average: "60-120 days sales cycle",
          concerning: "> 120 days sales cycle"
        }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50">
            <CardTitle className="text-sm font-medium text-black">Avg Sales Cycle</CardTitle>
            <Calendar className="h-4 w-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">{kpis.avgSalesCycle} days</div>
            <p className="text-xs text-rose-300">Time to close</p>
          </CardContent>
        </Card>
      </MetricTooltip>
    </div>
  );
};

export default SalesPerformanceKPICards;
