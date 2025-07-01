
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import benchmarksService from '@/services/benchmarksService';
import QuotasTabContent from './Benchmarks/QuotasTabContent';
import PerformanceTabContent from './Benchmarks/PerformanceTabContent';
import ActivitiesTabContent from './Benchmarks/ActivitiesTabContent';
import StagesTabContent from './Benchmarks/StagesTabContent';
import TargetsTabContent from './Benchmarks/TargetsTabContent';

const BenchmarksTab = () => {
  const [benchmarks, setBenchmarks] = useState(benchmarksService.getBenchmarks());
  const [hasChanges, setHasChanges] = useState(false);

  const updateBenchmark = (category, key, value) => {
    let updated;
    
    if (category === 'metrics') {
      const [subcategory, subkey] = key.split('.');
      updated = {
        ...benchmarks,
        metrics: {
          ...benchmarks.metrics,
          [subcategory]: {
            ...benchmarks.metrics[subcategory],
            [subkey]: parseFloat(value) || 0
          }
        }
      };
    } else if (category === 'individualQuotas') {
      const [repName, period] = key.split('.');
      updated = {
        ...benchmarks,
        individualQuotas: {
          ...benchmarks.individualQuotas,
          [repName]: {
            ...benchmarks.individualQuotas[repName],
            [period]: parseFloat(value) || 0
          }
        }
      };
    } else {
      updated = {
        ...benchmarks,
        [category]: {
          ...benchmarks[category],
          [key]: parseFloat(value) || 0
        }
      };
    }
    
    setBenchmarks(updated);
    setHasChanges(true);
  };

  const handleAddRep = (repName) => {
    benchmarksService.addNewRep(repName);
    setBenchmarks(benchmarksService.getBenchmarks());
    setHasChanges(true);
  };

  const handleRemoveRep = (repName) => {
    benchmarksService.removeRep(repName);
    setBenchmarks(benchmarksService.getBenchmarks());
    setHasChanges(true);
  };

  const saveBenchmarks = () => {
    benchmarksService.saveBenchmarks(benchmarks);
    setHasChanges(false);
  };

  const resetToDefaults = () => {
    benchmarksService.resetToDefaults();
    setBenchmarks(benchmarksService.getBenchmarks());
    setHasChanges(false);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex justify-between items-center pb-2">
          <div>
            <h2 className="text-xl font-semibold text-ocean-800">Benchmarks & Goals</h2>
            <p className="text-sm text-gray-600">Configure individual rep targets and company-wide performance benchmarks</p>
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={resetToDefaults} className="text-gray-600 hover:text-gray-800">
              Reset to Defaults
            </Button>
            <Button 
              onClick={saveBenchmarks} 
              disabled={!hasChanges}
              className="bg-ocean-500 hover:bg-ocean-600 text-white"
            >
              Save Changes
            </Button>
          </div>
        </div>

        <Tabs defaultValue="quotas" className="w-full">
          <TabsList className="h-auto p-0 bg-transparent border-b border-gray-200 rounded-none w-full justify-start">
            <TabsTrigger 
              value="quotas" 
              className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 hover:text-blue-600 font-medium"
            >
              Quotas
            </TabsTrigger>
            <TabsTrigger 
              value="performance" 
              className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 hover:text-blue-600 font-medium"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger 
              value="activities" 
              className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 hover:text-blue-600 font-medium"
            >
              Activities
            </TabsTrigger>
            <TabsTrigger 
              value="stages" 
              className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 hover:text-blue-600 font-medium"
            >
              Stages
            </TabsTrigger>
            <TabsTrigger 
              value="targets" 
              className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 hover:text-blue-600 font-medium"
            >
              Targets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quotas" className="mt-6">
            <QuotasTabContent
              benchmarks={benchmarks}
              updateBenchmark={updateBenchmark}
              onAddRep={handleAddRep}
              onRemoveRep={handleRemoveRep}
            />
          </TabsContent>

          <TabsContent value="performance" className="mt-6">
            <PerformanceTabContent
              benchmarks={benchmarks}
              updateBenchmark={updateBenchmark}
            />
          </TabsContent>

          <TabsContent value="activities" className="mt-6">
            <ActivitiesTabContent
              benchmarks={benchmarks}
              updateBenchmark={updateBenchmark}
            />
          </TabsContent>

          <TabsContent value="stages" className="mt-6">
            <StagesTabContent
              benchmarks={benchmarks}
              updateBenchmark={updateBenchmark}
            />
          </TabsContent>

          <TabsContent value="targets" className="mt-6">
            <TargetsTabContent
              benchmarks={benchmarks}
              updateBenchmark={updateBenchmark}
            />
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
};

export default BenchmarksTab;
