
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar, Info } from 'lucide-react';
import { stageTooltips } from './tooltips';

const StagesTabContent = ({ benchmarks, updateBenchmark }) => {
  return (
    <Card className="border-gray-200 bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base flex items-center gap-2 text-ocean-800">
            <Calendar className="h-4 w-4" />
            Stage Velocity (Days)
          </CardTitle>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-3 w-3 text-ocean-500 hover:text-ocean-600" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">Expected number of days opportunities should spend in each sales stage for velocity tracking.</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {Object.entries(benchmarks.stages).map(([stage, days]) => (
          <div key={stage} className="flex items-center justify-between py-1">
            <div className="flex items-center gap-1">
              <Label className="text-sm text-gray-700 font-medium">{stage}</Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3 w-3 text-ocean-500 hover:text-ocean-600" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{stageTooltips[stage]}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              type="number"
              value={days}
              onChange={(e) => updateBenchmark('stages', stage, e.target.value)}
              className="w-16 h-8 text-center border-gray-300 focus:border-ocean-500 focus:ring-ocean-500 rounded-md"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default StagesTabContent;
