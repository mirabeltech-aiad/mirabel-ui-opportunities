
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

  // Ensure all data has default values
  const safeKpiData = {
    totalRevenue: 0,
    quota: 1000000, // Default quota to prevent division by zero
    ...kpiData
  };

  const safePipelineHealth = {
    healthScore: 75,
    totalDeals: 0,
    averageDealSize: 0,
    ...pipelineHealth
  };

  const quotaProgress = safeKpiData.quota > 0 ? (safeKpiData.totalRevenue / safeKpiData.quota) * 100 : 0;
  const pipelineHealthScore = safePipelineHealth.healthScore || 75;
  const remainingQuota = Math.max(0, safeKpiData.quota - safeKpiData.totalRevenue);
  const currentMonth = new Date().getMonth() + 1;
  const monthsToGoal = safeKpiData.totalRevenue > 0 && currentMonth > 0 
    ? Math.ceil(remainingQuota / (safeKpiData.totalRevenue / currentMonth))
    : 12;

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
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help">Current: {formatCurrency(safeKpiData.totalRevenue)}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total revenue achieved so far this period</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help">Target: {formatCurrency(safeKpiData.quota)}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Annual revenue quota target set for this period</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Progress value={quotaProgress} className="h-3 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Visual progress bar showing quota completion percentage. Green indicates on-track or ahead of target.</p>
                </TooltipContent>
              </Tooltip>
              <p className="text-xs text-muted-foreground">
                {quotaProgress.toFixed(2)}% of annual quota achieved
              </p>
            </div>
            
            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-2xl font-bold text-green-600 cursor-help">{formatCurrency(remainingQuota)}</div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Amount of revenue still needed to reach the annual quota target</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="text-xs text-muted-foreground">Remaining</div>
                </div>
                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-2xl font-bold text-blue-600 cursor-help">{monthsToGoal}</div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Estimated months to reach quota goal based on current revenue velocity</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="text-xs text-muted-foreground">Months to Goal</div>
                </div>
              </div>
            </div>
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
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Health Score</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className={`cursor-help ${pipelineHealthScore >= 75 ? 'text-green-600' : pipelineHealthScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {pipelineHealthScore.toFixed(2)}%
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Composite score: 75%+ = Healthy, 50-74% = Average, &lt;50% = Needs Attention</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Progress 
                    value={pipelineHealthScore} 
                    className={`h-3 cursor-help ${pipelineHealthScore >= 75 ? 'bg-green-100' : pipelineHealthScore >= 50 ? 'bg-yellow-100' : 'bg-red-100'}`}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Visual health indicator based on pipeline velocity, stage balance, and conversion efficiency</p>
                </TooltipContent>
              </Tooltip>
              <p className="text-xs text-muted-foreground">
                Based on stage distribution and velocity
              </p>
            </div>
            
            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-2xl font-bold text-purple-600 cursor-help">{safePipelineHealth.totalDeals}</div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Number of opportunities currently active in the sales pipeline</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="text-xs text-muted-foreground">Active Deals</div>
                </div>
                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-2xl font-bold text-orange-600 cursor-help">{formatCurrency(safePipelineHealth.averageDealSize)}</div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Average value of opportunities in the pipeline. Higher values indicate larger deal focus.</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="text-xs text-muted-foreground">Avg Deal Size</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default QuotaPipelineSection;
