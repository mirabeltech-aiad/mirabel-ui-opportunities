
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@OpportunityComponents/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Target, Users, Clock } from 'lucide-react';
import MetricTooltip from '../MetricTooltip';

const KPICards = ({ kpiData, pipelineHealth, selectedPeriod, onMetricClick }) => {
  const formatCurrency = (value) => {
    const numValue = Number(value) || 0;
    // Show actual values without rounding
    return `$${numValue.toLocaleString()}`;
  };

  const formatPercentage = (value) => {
    const numValue = Number(value) || 0;
    // Show actual percentage with 2 decimal places
    return `${numValue.toFixed(2)}%`;
  };

  // Ensure all data has default values
  const safeKpiData = {
    totalRevenue: 0,
    revenueGrowth: 0,
    dealsWon: 0,
    dealGrowth: 0,
    winRate: 0,
    totalDeals: 0,
    avgSalesCycle: 0,
    cycleChange: 0,
    activeReps: 0,
    avgRevenuePerRep: 0,
    ...kpiData
  };

  const safePipelineHealth = {
    pipelineValue: 0,
    totalDeals: 0,
    ...pipelineHealth
  };

  const getPeriodLabel = () => {
    return selectedPeriod === "all" ? "All periods" :
           selectedPeriod === "today" ? "Today" :
           selectedPeriod === "yesterday" ? "Yesterday" :
           selectedPeriod === "this-week" ? "This week" :
           selectedPeriod === "last-week" ? "Last week" :
           selectedPeriod === "last-7-days" ? "Last 7 days" :
           selectedPeriod === "last-14-days" ? "Last 14 days" :
           selectedPeriod === "this-month" ? "This month" :
           selectedPeriod === "last-month" ? "Last month" :
           selectedPeriod === "last-30-days" ? "Last 30 days" :
           selectedPeriod === "last-60-days" ? "Last 60 days" :
           selectedPeriod === "last-90-days" ? "Last 90 days" :
           selectedPeriod === "this-quarter" ? "Current quarter" : 
           selectedPeriod === "last-quarter" ? "Last quarter" :
           selectedPeriod === "last-120-days" ? "Last 120 days" :
           selectedPeriod === "last-6-months" ? "Last 6 months" :
           selectedPeriod === "this-year" ? "This year" :
           selectedPeriod === "ytd" ? "Year to date" : 
           selectedPeriod === "last-year" ? "Last year" :
           selectedPeriod === "last-12-months" ? "Last 12 months" :
           selectedPeriod === "last-18-months" ? "Last 18 months" :
           selectedPeriod === "last-24-months" ? "Last 24 months" :
           selectedPeriod === "custom" ? "Custom date range" : "All periods";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <MetricTooltip
        title="Total Revenue"
        description="Total revenue generated from closed deals in the selected period. Growth percentage compares to the previous equivalent period."
        calculation="Sum of all closed-won opportunity amounts"
        period={getPeriodLabel()}
        benchmarks={{
          good: "> 20% growth",
          average: "5-20% growth", 
          concerning: "< 5% growth"
        }}
      >
        <Card className="hover:shadow-md transition-shadow cursor-pointer aspect-[4/3]" onClick={() => onMetricClick('revenue')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-ocean-800 text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(safeKpiData.totalRevenue)}</div>
            <p className="text-xs text-green-300 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{formatPercentage(safeKpiData.revenueGrowth)} from last period
            </p>
          </CardContent>
        </Card>
      </MetricTooltip>

      <MetricTooltip
        title="Deals Closed"
        description="Number of opportunities successfully closed and won during the selected period. Shows deal velocity and team productivity."
        calculation="Count of opportunities with 'Closed Won' status"
        period={getPeriodLabel()}
        benchmarks={{
          good: "> 15% increase",
          average: "5-15% increase",
          concerning: "< 5% increase"
        }}
      >
        <Card className="hover:shadow-md transition-shadow cursor-pointer aspect-[4/3]" onClick={() => onMetricClick('deals')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-ocean-800 text-sm font-medium">Deals Closed</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{safeKpiData.dealsWon}</div>
            <p className="text-xs text-blue-300 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{formatPercentage(safeKpiData.dealGrowth)} from last period
            </p>
          </CardContent>
        </Card>
      </MetricTooltip>

      <MetricTooltip
        title="Pipeline Value"
        description="Total value of all active opportunities in the sales pipeline. Higher values indicate stronger future revenue potential."
        calculation="Sum of all open opportunity amounts"
        period="Current active opportunities"
        benchmarks={{
          good: "> 3x monthly quota",
          average: "2-3x monthly quota",
          concerning: "< 2x monthly quota"
        }}
      >
        <Card className="hover:shadow-md transition-shadow cursor-pointer aspect-[4/3]" onClick={() => onMetricClick('pipeline')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-ocean-800 text-sm font-medium">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(safePipelineHealth.pipelineValue)}</div>
            <p className="text-xs text-purple-300">
              {safePipelineHealth.totalDeals} active opportunities
            </p>
          </CardContent>
        </Card>
      </MetricTooltip>

      <MetricTooltip
        title="Win Rate"
        description="Percentage of opportunities that resulted in closed-won deals. Higher rates indicate more effective sales processes and qualification."
        calculation="(Closed Won / Total Closed) × 100"
        period={getPeriodLabel()}
        benchmarks={{
          good: "> 25%",
          average: "15-25%",
          concerning: "< 15%"
        }}
      >
        <Card className="hover:shadow-md transition-shadow cursor-pointer aspect-[4/3]" onClick={() => onMetricClick('conversion')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-ocean-800 text-sm font-medium">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">{formatPercentage(safeKpiData.winRate)}</div>
            <p className="text-xs text-rose-300">
              {safeKpiData.dealsWon} won / {safeKpiData.totalDeals} total
            </p>
          </CardContent>
        </Card>
      </MetricTooltip>

      <MetricTooltip
        title="Average Sales Cycle"
        description="Average time from opportunity creation to close. Shorter cycles indicate more efficient sales processes and faster revenue realization."
        calculation="Average days between opportunity creation and close date"
        period={getPeriodLabel()}
        benchmarks={{
          good: "< 60 days",
          average: "60-90 days",
          concerning: "> 90 days"
        }}
      >
        <Card className="hover:shadow-md transition-shadow cursor-pointer aspect-[4/3]" onClick={() => onMetricClick('cycle')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-ocean-800 text-sm font-medium">Avg Sales Cycle</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{safeKpiData.avgSalesCycle} days</div>
            <p className="text-xs text-amber-300">
              {safeKpiData.cycleChange > 0 ? 'Slower' : 'Faster'} by {Math.abs(safeKpiData.cycleChange || 0)} days
            </p>
          </CardContent>
        </Card>
      </MetricTooltip>

      <MetricTooltip
        title="Active Sales Reps"
        description="Number of sales representatives with active deals or recent activity. Average revenue per rep shows individual productivity levels."
        calculation="Count of reps with opportunities in the pipeline or closed deals"
        period={getPeriodLabel()}
        benchmarks={{
          good: "> $500K per rep",
          average: "$250K-500K per rep",
          concerning: "< $250K per rep"
        }}
      >
        <Card className="hover:shadow-md transition-shadow cursor-pointer aspect-[4/3]" onClick={() => onMetricClick('team')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-ocean-800 text-sm font-medium">Active Reps</CardTitle>
            <Users className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{safeKpiData.activeReps}</div>
            <p className="text-xs text-indigo-300">
              Avg {formatCurrency(safeKpiData.avgRevenuePerRep)} per rep
            </p>
          </CardContent>
        </Card>
      </MetricTooltip>
    </div>
  );
};

export default KPICards;
