
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@OpportunityComponents/ui/card';
import { Progress } from '@OpportunityComponents/ui/progress';
import { Target, Activity } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@OpportunityComponents/ui/tooltip';

const QuotaPipelineSection = ({ kpiData, pipelineHealth }) => {
  const formatCurrency = (value) => {
    const numValue = Number(value) || 0;
    // Show actual values without rounding
    return `$${numValue.toLocaleString()}`;
  };

  // Use actual SP data with fallbacks
  const safeKpiData = {
    totalRevenue: 0,
    quota: 0,
    quotaProgress: 0,
    ...kpiData
  };

  const safePipelineHealth = {
    healthScore: 0,
    totalDeals: 0,
    averageDealSize: 0,
    pipelineValue: 0,
    score: 0,
    status: "No Data",
    ...pipelineHealth
  };

  const quotaProgress = safeKpiData.quotaProgress || 0;
  const pipelineHealthScore = safePipelineHealth.healthScore || safePipelineHealth.score || 0;
  const remainingQuota = safeKpiData.quota ? Math.max(0, safeKpiData.quota - safeKpiData.totalRevenue) : 0;
  const currentMonth = new Date().getMonth() + 1;
  const monthsToGoal = safeKpiData.totalRevenue > 0 && currentMonth > 0 && safeKpiData.quota
    ? Math.ceil(remainingQuota / (safeKpiData.totalRevenue / currentMonth))
    : 0;

  // Check if we have real data
  const hasQuotaData = safeKpiData.quota > 0 || safeKpiData.totalRevenue > 0;
  const hasPipelineData = safePipelineHealth.totalDeals > 0 || safePipelineHealth.pipelineValue > 0;

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quota Progress */}
        <Card>
          <CardHeader>
            <Tooltip>
              <TooltipTrigger asChild>
                <CardTitle className="text-ocean-800 flex items-center gap-2 cursor-help">
                  <Target className="h-5 w-5 text-green-600" />
                  Quota Progress
                </CardTitle>
              </TooltipTrigger>
              <TooltipContent>
                <p>Progress toward annual revenue quota target. Shows current achievement and projected timeline to goal completion.</p>
              </TooltipContent>
            </Tooltip>
          </CardHeader>
          <CardContent className="space-y-4">
            {hasQuotaData ? (
              <>
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold">{Math.round(quotaProgress)}%</span>
                  </div>
                  <Progress value={quotaProgress} className="h-3" />
                </div>

                {/* Revenue vs Quota */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(safeKpiData.totalRevenue)}</p>
                    <p className="text-sm text-gray-500">Revenue</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-700">{formatCurrency(safeKpiData.quota)}</p>
                    <p className="text-sm text-gray-500">Quota</p>
                  </div>
                </div>

                {/* Additional Metrics */}
                {remainingQuota > 0 && (
                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Remaining</span>
                      <span className="font-medium">{formatCurrency(remainingQuota)}</span>
                    </div>
                    {monthsToGoal > 0 && (
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-600">Months to Goal</span>
                        <span className="font-medium">{monthsToGoal}</span>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">Connect APIs</p>
                <p className="text-gray-400 text-xs">No quota data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pipeline Health */}
        <Card>
          <CardHeader>
            <Tooltip>
              <TooltipTrigger asChild>
                <CardTitle className="text-ocean-800 flex items-center gap-2 cursor-help">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Pipeline Health
                </CardTitle>
              </TooltipTrigger>
              <TooltipContent>
                <p>Overall assessment of sales pipeline quality based on stage distribution, deal velocity, and conversion patterns.</p>
              </TooltipContent>
            </Tooltip>
          </CardHeader>
          <CardContent className="space-y-4">
            {hasPipelineData ? (
              <>
                {/* Health Score */}
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-200"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - pipelineHealthScore / 100)}`}
                        className={
                          pipelineHealthScore >= 80 ? "text-green-500" :
                          pipelineHealthScore >= 60 ? "text-yellow-500" : "text-red-500"
                        }
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{Math.round(pipelineHealthScore)}%</span>
                    </div>
                  </div>
                  <p className={`text-sm font-medium ${
                    pipelineHealthScore >= 80 ? "text-green-600" :
                    pipelineHealthScore >= 60 ? "text-yellow-600" : "text-red-600"
                  }`}>
                    {safePipelineHealth.status}
                  </p>
                </div>

                {/* Pipeline Metrics */}
                <div className="grid grid-cols-2 gap-4 text-center pt-4 border-t">
                  <div>
                    <p className="text-lg font-bold text-blue-600">{safePipelineHealth.totalDeals}</p>
                    <p className="text-sm text-gray-500">Active Deals</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-600">{formatCurrency(safePipelineHealth.pipelineValue)}</p>
                    <p className="text-sm text-gray-500">Pipeline Value</p>
                  </div>
                </div>

                {/* Average Deal Size */}
                {safePipelineHealth.averageDealSize > 0 && (
                  <div className="text-center pt-2">
                    <p className="text-sm text-gray-600">Avg Deal Size</p>
                    <p className="text-lg font-semibold">{formatCurrency(safePipelineHealth.averageDealSize)}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">Connect APIs</p>
                <p className="text-gray-400 text-xs">No pipeline data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default QuotaPipelineSection;
