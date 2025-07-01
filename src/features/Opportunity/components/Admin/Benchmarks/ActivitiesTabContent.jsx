
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Activity, Info } from 'lucide-react';
import { activityTooltips } from './tooltips';

const ActivitiesTabContent = ({ benchmarks, updateBenchmark }) => {
  return (
    <Card className="border-gray-200 bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base flex items-center gap-2 text-ocean-800">
            <Activity className="h-4 w-4" />
            Activity Benchmarks (Per Rep)
          </CardTitle>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-3 w-3 text-ocean-500 hover:text-ocean-600" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">Expected activity levels for individual sales representatives to maintain healthy pipeline and performance.</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {Object.entries(benchmarks.activities).map(([activity, target]) => (
          <div key={activity} className="flex items-center justify-between py-1">
            <div className="flex items-center gap-1">
              <Label className="text-sm text-gray-700 font-medium">{activity.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3 w-3 text-ocean-500 hover:text-ocean-600" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{activityTooltips[activity]}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              type="number"
              step="0.1"
              value={target}
              onChange={(e) => updateBenchmark('activities', activity, e.target.value)}
              className="w-20 h-8 text-center border-gray-300 focus:border-ocean-500 focus:ring-ocean-500 rounded-md"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ActivitiesTabContent;
