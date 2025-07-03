
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@OpportunityComponents/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@OpportunityComponents/ui/tabs';
import { Button } from '@OpportunityComponents/ui/button';
import { AlertTriangle, Download, TrendingDown, Users, Target, BarChart3 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import exportService from '@/services/exportService';
import { useDesignSystem } from '@/hooks/useDesignSystem';

// Extracted components
import LostDealMetricsCards from './LostDealAnalysis/LostDealMetricsCards';
import LossReasonsTab from './LostDealAnalysis/LossReasonsTab';
import StagePatternsTab from './LostDealAnalysis/StagePatternsTab';
import LossTrendsTab from './LostDealAnalysis/LossTrendsTab';
import CompetitorsTab from './LostDealAnalysis/CompetitorsTab';
import LostDealFilterBar from './LostDealAnalysis/LostDealFilterBar';

// New API-based hook
import { useLostDealsApiData } from './LostDealAnalysis/hooks/useLostDealsApiData';

const LostDealAnalysis = ({ opportunities = [] }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('last-6-months');
  const [salesRep, setSalesRep] = useState('all');
  const [product, setProduct] = useState('all');
  const [businessUnit, setBusinessUnit] = useState('all');
  const { getTitleClass, getInteractiveButtonClass, getTabContainerClass } = useDesignSystem();

  // Use new API-based hook
  const { lostDealsData, isLoading, error } = useLostDealsApiData(
    selectedPeriod,
    salesRep,
    product,
    businessUnit
  );

  const handleExport = () => {
    try {
      exportService.exportLostDealAnalysis(lostDealsData, lostDealsData.monthlyTrends);
      toast({
        title: "Export Complete",
        description: "Lost deal analysis data has been exported successfully."
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRefresh = () => {
    // Trigger a re-fetch by updating a timestamp or similar
    toast({
      title: "Data Refreshed",
      description: "Lost deal analysis data has been refreshed successfully."
    });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading lost deal data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600 mb-2">Error loading lost deal data</p>
            <p className="text-muted-foreground text-sm">{error}</p>
            <Button onClick={handleRefresh} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${getTitleClass()} flex items-center gap-2`}>
            <AlertTriangle className="h-6 w-6 text-red-600" />
            Lost Deal Analysis
          </h2>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <TrendingDown className="h-4 w-4 text-red-500" />
            Understand why deals are being lost and identify trends
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Download className="h-4 w-4 text-red-600" />
          <Button onClick={handleExport} className={getInteractiveButtonClass()}>
            Export Analysis
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <LostDealFilterBar 
        timeRange={selectedPeriod}
        salesRep={salesRep}
        product={product}
        businessUnit={businessUnit}
        onTimeRangeChange={setSelectedPeriod}
        onSalesRepChange={setSalesRep}
        onProductChange={setProduct}
        onBusinessUnitChange={setBusinessUnit}
        onExport={handleExport}
        onRefresh={handleRefresh}
      />

      {/* Metrics Cards - now using API data */}
      <LostDealMetricsCards lostDealsData={lostDealsData} />

      {/* Analytics Tabs */}
      <Tabs defaultValue="reasons" className="w-full">
        <TabsList className={`grid w-full grid-cols-4 ${getTabContainerClass()}`}>
          <TabsTrigger value="reasons" className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors">
            <AlertTriangle className="h-4 w-4" />
            Loss Reasons
          </TabsTrigger>
          <TabsTrigger value="stage-patterns" className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors">
            <Target className="h-4 w-4" />
            Stage Patterns
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors">
            <TrendingDown className="h-4 w-4" />
            Loss Trends
          </TabsTrigger>
          <TabsTrigger value="competitors" className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors">
            <Users className="h-4 w-4" />
            Rep Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reasons" className="space-y-4">
          <LossReasonsTab lossReasons={lostDealsData.lossReasons} />
        </TabsContent>

        <TabsContent value="stage-patterns" className="space-y-4">
          <StagePatternsTab stageAnalysis={lostDealsData.stageAnalysis} />
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <LossTrendsTab lossTrends={lostDealsData.monthlyTrends} />
        </TabsContent>

        <TabsContent value="competitors" className="space-y-4">
          <CompetitorsTab repAnalysis={lostDealsData.repAnalysis} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LostDealAnalysis;
