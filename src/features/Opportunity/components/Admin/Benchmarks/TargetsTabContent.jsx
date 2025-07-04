
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DollarSign, BarChart3, Info } from 'lucide-react';
import CurrencyInput from '../CurrencyInput';
import { revenueTooltips, pipelineTooltips } from './tooltips';

const TargetsTabContent = ({ benchmarks, updateBenchmark }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base flex items-center gap-2 text-ocean-800">
              <DollarSign className="h-4 w-4" />
              Deal Size Categories
            </CardTitle>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3 w-3 text-ocean-500 hover:text-ocean-600" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Deal size thresholds for opportunity classification and resource allocation decisions.</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          {Object.entries(benchmarks.metrics.revenue).map(([level, amount]) => (
            <div key={level} className="flex items-center justify-between py-1">
              <div className="flex items-center gap-1">
                <Label className="text-sm text-gray-700 font-medium capitalize">{level}</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-ocean-500 hover:text-ocean-600" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{revenueTooltips[level]}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <CurrencyInput
                value={amount}
                onChange={(value) => updateBenchmark('metrics', `revenue.${level}`, value)}
                className="w-36 h-8 text-center border-gray-300 focus:border-ocean-500 focus:ring-ocean-500 rounded-md"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base flex items-center gap-2 text-ocean-800">
              <BarChart3 className="h-4 w-4" />
              Company Pipeline Targets
            </CardTitle>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3 w-3 text-ocean-500 hover:text-ocean-600" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Company-wide total pipeline value targets for maintaining healthy sales coverage and predictable revenue.</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          {Object.entries(benchmarks.metrics.pipeline).map(([level, amount]) => (
            <div key={level} className="flex items-center justify-between py-1">
              <div className="flex items-center gap-1">
                <Label className="text-sm text-gray-700 font-medium capitalize">{level}</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-ocean-500 hover:text-ocean-600" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{pipelineTooltips[level]}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <CurrencyInput
                value={amount}
                onChange={(value) => updateBenchmark('metrics', `pipeline.${level}`, value)}
                className="w-36 h-8 text-center border-gray-300 focus:border-ocean-500 focus:ring-ocean-500 rounded-md"
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default TargetsTabContent;
