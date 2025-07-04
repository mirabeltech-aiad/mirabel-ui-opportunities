
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Target, Info } from 'lucide-react';
import IndividualRepQuotas from '../IndividualRepQuotas';
import CurrencyInput from '../CurrencyInput';
import { quotaTooltips } from './tooltips';

const QuotasTabContent = ({ benchmarks, updateBenchmark, onAddRep, onRemoveRep }) => {
  return (
    <div className="space-y-6">
      <IndividualRepQuotas
        benchmarks={benchmarks}
        updateBenchmark={updateBenchmark}
        onAddRep={onAddRep}
        onRemoveRep={onRemoveRep}
      />
      
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base flex items-center gap-2 text-ocean-800">
              <Target className="h-4 w-4" />
              Default Rep Quota Targets
            </CardTitle>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3 w-3 text-ocean-500 hover:text-ocean-600" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Default revenue targets used when adding new sales representatives. These can be customized for each individual rep above.</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          {Object.entries(benchmarks.defaultQuotas).map(([period, amount]) => (
            <div key={period} className="flex items-center justify-between py-1">
              <div className="flex items-center gap-1">
                <Label className="text-sm text-gray-700 font-medium">{period.replace('-', ' ').toUpperCase()}</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-ocean-500 hover:text-ocean-600" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{quotaTooltips[period]}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <CurrencyInput
                value={amount}
                onChange={(value) => updateBenchmark('defaultQuotas', period, value)}
                className="w-36 h-8 text-center border-gray-300 focus:border-ocean-500 focus:ring-ocean-500 rounded-md"
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuotasTabContent;
