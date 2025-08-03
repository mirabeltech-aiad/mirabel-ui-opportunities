

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PricingOverview from './PricingOverview';
import ABTestingResults from './ABTestingResults';
import PriceElasticityAnalysis from './PriceElasticityAnalysis';
import RevenueOptimizationSuggestions from './RevenueOptimizationSuggestions';
import PricingSegmentAnalysis from './PricingSegmentAnalysis';

const PricingAnalysisDashboard = () => {
  return (
    <div className="space-y-6">
      <PricingOverview />

      <Tabs defaultValue="abtesting" className="w-full">
        <TabsList className="bg-blue-50 w-full grid grid-cols-4 p-1 rounded-md mb-6">
          <TabsTrigger 
            value="abtesting" 
            className="flex items-center gap-2 px-4 py-3 text-muted-foreground rounded-sm transition-colors data-[state=active]:bg-ocean-gradient data-[state=active]:text-white"
          >
            A/B Testing
          </TabsTrigger>
          <TabsTrigger 
            value="elasticity" 
            className="flex items-center gap-2 px-4 py-3 text-muted-foreground rounded-sm transition-colors data-[state=active]:bg-ocean-gradient data-[state=active]:text-white"
          >
            Price Elasticity
          </TabsTrigger>
          <TabsTrigger 
            value="optimization" 
            className="flex items-center gap-2 px-4 py-3 text-muted-foreground rounded-sm transition-colors data-[state=active]:bg-ocean-gradient data-[state=active]:text-white"
          >
            Optimization
          </TabsTrigger>
          <TabsTrigger 
            value="segments" 
            className="flex items-center gap-2 px-4 py-3 text-muted-foreground rounded-sm transition-colors data-[state=active]:bg-ocean-gradient data-[state=active]:text-white"
          >
            Segments
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="abtesting" className="space-y-6">
          <ABTestingResults />
        </TabsContent>
        
        <TabsContent value="elasticity" className="space-y-6">
          <PriceElasticityAnalysis />
        </TabsContent>
        
        <TabsContent value="optimization" className="space-y-6">
          <RevenueOptimizationSuggestions />
        </TabsContent>
        
        <TabsContent value="segments" className="space-y-6">
          <PricingSegmentAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PricingAnalysisDashboard;
