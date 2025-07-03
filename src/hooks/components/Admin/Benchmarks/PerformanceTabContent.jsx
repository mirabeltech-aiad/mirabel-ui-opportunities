
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@OpportunityComponents/ui/card";
import { Input } from "@OpportunityComponents/ui/input";
import { Label } from "@OpportunityComponents/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@OpportunityComponents/ui/tooltip";
import { Award, Info } from 'lucide-react';
import { performanceTooltips } from './tooltips';

const PerformanceTabContent = ({ benchmarks, updateBenchmark }) => {
  return (
    <Card className="border-gray-200 bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base flex items-center gap-2 text-ocean-800">
            <Award className="h-4 w-4" />
            Performance Thresholds (% of Quota)
          </CardTitle>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-3 w-3 text-ocean-500 hover:text-ocean-600" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">Performance evaluation thresholds as percentage of individual quota achievement.</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {Object.entries(benchmarks.performance).map(([level, percentage]) => (
          <div key={level} className="flex items-center justify-between py-1">
            <div className="flex items-center gap-1">
              <Label className="text-sm text-gray-700 font-medium capitalize">{level}</Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3 w-3 text-ocean-500 hover:text-ocean-600" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{performanceTooltips[level]}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="relative">
              <Input
                type="number"
                value={percentage}
                onChange={(e) => updateBenchmark('performance', level, e.target.value)}
                className="w-20 h-8 text-center border-gray-300 focus:border-ocean-500 focus:ring-ocean-500 pr-6 rounded-md"
              />
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PerformanceTabContent;
