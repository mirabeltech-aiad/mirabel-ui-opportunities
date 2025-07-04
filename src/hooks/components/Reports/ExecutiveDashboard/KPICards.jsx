import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@OpportunityComponents/ui/card';
import { TrendingUp, DollarSign, Target, Users, Clock, AlertTriangle } from 'lucide-react';
import MetricTooltip from '../MetricTooltip';

const KPICards = ({ kpiData, pipelineHealth, selectedPeriod, onMetricClick }) => {
  // Show API error if data contains error flag
  if (kpiData?.apiError) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="col-span-full">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">API Data Unavailable</p>
              <p className="text-xs text-gray-500 mt-1">{kpiData.apiError}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  const formatCurrency = (value) => {
    const numValue = Number(value) || 0;
    // Show values in thousands format
    return `$${Math.round(numValue / 1000)}K`;
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
      <Card className="hover:shadow-md transition-shadow cursor-pointer aspect-[4/3]" onClick={() => onMetricClick('revenue')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-ocean-800 text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center h-full">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {formatCurrency(safeKpiData.totalRevenue)}
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {formatPercentage(safeKpiData.revenueGrowth)} growth
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow cursor-pointer aspect-[4/3]" onClick={() => onMetricClick('deals')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-ocean-800 text-sm font-medium">Deals Closed</CardTitle>
          <Target className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center h-full">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {safeKpiData.dealsWon}
            </div>
            <div className="text-xs text-gray-500">
              {safeKpiData.totalDeals} total deals
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow cursor-pointer aspect-[4/3]" onClick={() => onMetricClick('pipeline')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-ocean-800 text-sm font-medium">Pipeline Value</CardTitle>
          <DollarSign className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center h-full">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {formatCurrency(safePipelineHealth.pipelineValue)}
            </div>
            <div className="text-xs text-gray-500">
              {safePipelineHealth.totalDeals} open deals
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow cursor-pointer aspect-[4/3]" onClick={() => onMetricClick('conversion')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-ocean-800 text-sm font-medium">Win Rate</CardTitle>
          <Target className="h-4 w-4 text-rose-600" />
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center h-full">
          <div className="text-center">
            <div className="text-2xl font-bold text-rose-600 mb-1">
              {formatPercentage(safeKpiData.winRate)}
            </div>
            <div className="text-xs text-gray-500">
              conversion rate
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow cursor-pointer aspect-[4/3]" onClick={() => onMetricClick('cycle')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-ocean-800 text-sm font-medium">Avg Sales Cycle</CardTitle>
          <Clock className="h-4 w-4 text-amber-600" />
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center h-full">
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600 mb-1">
              {safeKpiData.avgSalesCycle || safeKpiData.salesCycle || 45} days
            </div>
            <div className="text-xs text-gray-500">
              average cycle
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow cursor-pointer aspect-[4/3]" onClick={() => onMetricClick('team')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-ocean-800 text-sm font-medium">Active Reps</CardTitle>
          <Users className="h-4 w-4 text-indigo-600" />
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center h-full">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600 mb-1">
              {safeKpiData.activeReps}
            </div>
            <div className="text-xs text-gray-500">
              sales reps
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KPICards;
