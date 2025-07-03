
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@OpportunityComponents/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@OpportunityComponents/ui/tabs';
import { Button } from '@OpportunityComponents/ui/button';
import { Clock, Download, TrendingUp, Target, BarChart3, Users, DollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import exportService from '@/services/exportService';
import { useDesignSystem } from '@/hooks/useDesignSystem';

// Extracted components
import VelocityMetricsCards from './DealVelocity/VelocityMetricsCards';
import VelocityTrendsTab from './DealVelocity/VelocityTrendsTab';
import StageAnalysisTab from './DealVelocity/StageAnalysisTab';
import BenchmarkComparisonTab from './DealVelocity/BenchmarkComparisonTab';
import OptimizationTab from './DealVelocity/OptimizationTab';
import DealSizeCorrelationTab from './DealVelocity/DealSizeCorrelationTab';
import DealVelocityFilterBar from './DealVelocity/DealVelocityFilterBar';

// Extracted hooks
import { useDealVelocityData } from './DealVelocity/hooks/useDealVelocityData';

const DealVelocityAnalysis = ({ opportunities = [] }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('last-6-months');
  const [salesRep, setSalesRep] = useState('all');
  const [product, setProduct] = useState('all');
  const [businessUnit, setBusinessUnit] = useState('all');

  // Use design system tokens
  const { getTitleClass, getInteractiveButtonClass, getTabContainerClass } = useDesignSystem();

  // Use the new deal velocity data hook
  const {
    velocityData,
    overallMetrics,
    repVelocity,
    stageVelocity,
    velocityTrends,
    bottlenecks,
    isLoading,
    error
  } = useDealVelocityData(selectedPeriod, salesRep, product, businessUnit);

  // Create velocity metrics object for backward compatibility
  const velocityMetrics = useMemo(() => ({
    avgSalesCycle: overallMetrics.avgSalesCycle,
    stageVelocity: stageVelocity,
    totalDeals: overallMetrics.wonDeals,
    totalRevenue: overallMetrics.totalRevenue,
    avgDealSize: overallMetrics.avgDealSize,
    fastestDeal: overallMetrics.fastestDeal,
    slowestDeal: overallMetrics.slowestDeal
  }), [overallMetrics, stageVelocity]);

  // Create chart configuration with proper defaults
  const chartConfig = useMemo(() => ({
    current: {
      label: "Current Performance",
      color: "#3b82f6"
    },
    industry: {
      label: "Industry Average", 
      color: "#6b7280"
    },
    target: {
      label: "Target",
      color: "#10b981"
    },
    avgVelocity: {
      label: "Average Velocity",
      color: "#3b82f6"
    }
  }), []);

  // Create mock data for comparison if needed
  const stageComparison = useMemo(() => {
    return stageVelocity.map(stage => ({
      stage: stage.stage,
      current: stage.avgDays || 0,
      industry: stage.benchmark || 0,
      target: Math.max(1, (stage.benchmark || 0) * 0.8) // 20% better than industry
    }));
  }, [stageVelocity]);

  const handleExport = () => {
    try {
      exportService.exportDealVelocity(velocityMetrics, velocityTrends);
      toast({
        title: "Export Complete",
        description: "Deal velocity data has been exported successfully."
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
    toast({
      title: "Data Refreshed",
      description: "Deal velocity data has been refreshed successfully."
    });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading deal velocity data...</p>
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
            <p className="text-red-600 mb-2">Error loading deal velocity data</p>
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
            <Clock className="h-6 w-6 text-blue-600" />
            Deal Velocity Analysis
          </h2>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <BarChart3 className="h-4 w-4 text-green-500" />
            Analyze deal progression and identify bottlenecks
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg border border-blue-200">
          <Download className="h-4 w-4 text-blue-600" />
          <Button onClick={handleExport} className={getInteractiveButtonClass()}>
            Export Analysis
          </Button>
        </div>
      </div>

      {/* New Comprehensive Filter Bar */}
      <DealVelocityFilterBar 
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

      {/* KPI Metrics Cards */}
      <VelocityMetricsCards 
        velocityMetrics={velocityMetrics} 
        bottlenecks={bottlenecks} 
        velocityTrends={velocityTrends}
      />

      {/* Analysis Tabs */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className={`grid w-full grid-cols-5 ${getTabContainerClass()} p-1 rounded-md`}>
          <TabsTrigger 
            value="trends" 
            className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors"
          >
            <TrendingUp className="h-4 w-4" />
            Velocity Trends
          </TabsTrigger>
          <TabsTrigger 
            value="stage-analysis" 
            className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors"
          >
            <Clock className="h-4 w-4" />
            Stage Analysis
          </TabsTrigger>
          <TabsTrigger 
            value="size-correlation" 
            className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors"
          >
            <DollarSign className="h-4 w-4" />
            Deal Size Impact
          </TabsTrigger>
          <TabsTrigger 
            value="benchmarks" 
            className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors"
          >
            <Target className="h-4 w-4" />
            Benchmark Comparison
          </TabsTrigger>
          <TabsTrigger 
            value="optimization" 
            className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors"
          >
            <Users className="h-4 w-4" />
            Optimization Tips
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <VelocityTrendsTab velocityTrends={velocityTrends} chartConfig={chartConfig} />
        </TabsContent>

        <TabsContent value="stage-analysis" className="space-y-4">
          <StageAnalysisTab velocityMetrics={velocityMetrics} chartConfig={chartConfig} />
        </TabsContent>

        <TabsContent value="size-correlation" className="space-y-4">
          <DealSizeCorrelationTab velocityData={velocityData} chartConfig={chartConfig} />
        </TabsContent>

        <TabsContent value="benchmarks" className="space-y-4">
          <BenchmarkComparisonTab stageComparison={stageComparison} chartConfig={chartConfig} />
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <OptimizationTab velocityMetrics={velocityMetrics} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DealVelocityAnalysis;
