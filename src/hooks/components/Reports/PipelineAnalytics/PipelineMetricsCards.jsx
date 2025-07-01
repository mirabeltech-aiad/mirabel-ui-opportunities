
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, DollarSign, TrendingUp, Users, Target } from 'lucide-react';
import { useDesignSystem } from '@/hooks/useDesignSystem';

const PipelineMetricsCards = ({ pipelineHealth }) => {
  const { metricCardColors } = useDesignSystem();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
            Pipeline Value
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3 w-3 text-ocean-500 hover:text-ocean-600" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Total value of all open opportunities in the pipeline</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${metricCardColors.service}`}>
            {formatCurrency(pipelineHealth.totalValue || 0)}
          </div>
          <p className={`text-xs ${metricCardColors.serviceSubtitle}`}>Active opportunities</p>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
            Win Rate
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3 w-3 text-ocean-500 hover:text-ocean-600" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Percentage of won deals versus total closed deals</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${metricCardColors.connection}`}>
            {pipelineHealth.winRate || 0}%
          </div>
          <p className={`text-xs ${metricCardColors.connectionSubtitle}`}>Conversion rate</p>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
            Avg Deal Size
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3 w-3 text-ocean-500 hover:text-ocean-600" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Average value across all opportunities in the pipeline</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
          <Target className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${metricCardColors.activity}`}>
            {formatCurrency(pipelineHealth.avgDealSize || 0)}
          </div>
          <p className={`text-xs ${metricCardColors.activitySubtitle}`}>Per opportunity</p>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
            Avg Velocity
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3 w-3 text-ocean-500 hover:text-ocean-600" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Average number of days from opportunity creation to close</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
          <Users className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${metricCardColors.time}`}>
            {pipelineHealth.avgVelocity || 0} days
          </div>
          <p className={`text-xs ${metricCardColors.timeSubtitle}`}>Sales cycle</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PipelineMetricsCards;
