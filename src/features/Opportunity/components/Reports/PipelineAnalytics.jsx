
import React, { useState, useMemo, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@OpportunityComponents/ui/tabs';
import { Button } from '@OpportunityComponents/ui/button';
import { Activity, Download, BarChart3, TrendingUp, Target, Layers, Loader2, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import exportService from '@/services/exportService';
import { useDesignSystem } from '@/hooks/useDesignSystem';
import MetricTooltip from './MetricTooltip';

// Extracted components
import PipelineMetricsCards from './PipelineAnalytics/PipelineMetricsCards';
import PipelineAnalyticsFilterBar from './PipelineAnalytics/PipelineAnalyticsFilterBar';
import PipelineHealthTab from './PipelineAnalytics/PipelineHealthTab';
import PipelineTrendsTab from './PipelineAnalytics/PipelineTrendsTab';
import PipelineForecastTab from './PipelineAnalytics/PipelineForecastTab';
import PipelineStageAnalysisTab from './PipelineAnalytics/PipelineStageAnalysisTab';

// New API hook and stage service
import { usePipelineAnalyticsData } from './PipelineAnalytics/hooks/usePipelineAnalyticsData';
import stageService from '@/services/stageService';

const PipelineAnalytics = ({ opportunities = [] }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('last-6-months');
  const [selectedStage, setSelectedStage] = useState('all');
  const [selectedRep, setSelectedRep] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState('all');

  // Use design system tokens
  const { getTitleClass, getInteractiveButtonClass, getTabContainerClass } = useDesignSystem();

  // Use the new API hook for all pipeline data
  const {
    pipelineHealth,
    stageDistribution,
    pipelineMovement,
    pipelineTrend,
    forecastData,
    isLoading,
    error
  } = usePipelineAnalyticsData(selectedPeriod, selectedRep, selectedProduct, selectedBusinessUnit);

  // Get unique values for filters from legacy opportunities data (fallback)
  const salesReps = useMemo(() => {
    // Try to get from API data first, fallback to legacy data
    const apiReps = stageDistribution?.repList || [];
    const legacyReps = [...new Set(opportunities
      .filter(opp => opp.assignedRep)
      .map(opp => opp.assignedRep)
    )];
    
    return apiReps.length > 0 ? apiReps : legacyReps;
  }, [opportunities, stageDistribution]);

  // Use live stages from API
  const [liveStages, setLiveStages] = useState([]);
  
  useEffect(() => {
    const fetchLiveStages = async () => {
      try {
        const stages = await stageService.getLiveStages();
        setLiveStages(stages);
      } catch (error) {
        console.error('Failed to fetch live stages:', error);
        // Fallback to legacy stages from opportunities
        const legacyStages = [...new Set(opportunities.map(opp => opp.stage))];
        setLiveStages(legacyStages.map((stage, index) => ({ 
          id: index, 
          name: stage, 
          value: stage 
        })));
      }
    };
    
    fetchLiveStages();
  }, [opportunities]);

  const handleExport = () => {
    try {
      exportService.exportPipelineAnalytics(pipelineHealth, stageDistribution, pipelineTrend, forecastData);
      toast({
        title: "Export Complete",
        description: "Pipeline analytics data has been exported successfully."
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
      description: "Pipeline analytics data has been refreshed successfully."
    });
  };

  const getPeriodLabel = () => {
    return selectedPeriod === "all-time" ? "All time" :
           selectedPeriod === "this-quarter" ? "Current quarter" :
           selectedPeriod === "last-quarter" ? "Last quarter" :
           selectedPeriod === "last-3-months" ? "Last 3 months" :
           selectedPeriod === "last-6-months" ? "Last 6 months" :
           selectedPeriod === "last-12-months" ? "Last 12 months" :
           selectedPeriod === "ytd" ? "Year to date" :
           selectedPeriod === "this-year" ? "This year" :
           selectedPeriod === "last-year" ? "Last year" : "Selected period";
  };

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold ${getTitleClass()} flex items-center gap-2`}>
              <Activity className="h-6 w-6 text-blue-600" />
              Pipeline Analytics
            </h2>
            <p className="text-muted-foreground">Deep insights into pipeline health, trends, and forecasting</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center p-8 bg-red-50 rounded-lg border border-red-200">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Data</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={handleRefresh} className={getInteractiveButtonClass()}>
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
            <Activity className="h-6 w-6 text-blue-600" />
            Pipeline Analytics
          </h2>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <BarChart3 className="h-4 w-4 text-green-500" />
            Deep insights into pipeline health, trends, and forecasting
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg border border-blue-200">
          <Download className="h-4 w-4 text-blue-600" />
          <Button onClick={handleExport} className={getInteractiveButtonClass()}>
            Export Analytics
          </Button>
        </div>
      </div>

      {/* New Comprehensive Filter Bar */}
      <PipelineAnalyticsFilterBar 
        timeRange={selectedPeriod}
        salesRep={selectedRep}
        product={selectedProduct}
        businessUnit={selectedBusinessUnit}
        onTimeRangeChange={setSelectedPeriod}
        onSalesRepChange={setSelectedRep}
        onProductChange={setSelectedProduct}
        onBusinessUnitChange={setSelectedBusinessUnit}
        onExport={handleExport}
        onRefresh={handleRefresh}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center p-8 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-center">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-blue-600">Loading pipeline analytics data...</p>
          </div>
        </div>
      )}

      {/* KPI Cards with Tooltip */}
      {!isLoading && (
        <MetricTooltip
          title="Pipeline Analytics Overview"
          description="Key performance indicators showing current pipeline health, win rates, deal sizes, and velocity metrics."
          calculation="Pipeline Value: Sum of all open opportunities. Win Rate: Percentage of won deals vs total closed deals. Avg Deal Size: Average value across all opportunities. Avg Velocity: Average days from creation to close."
          period={`Filtered by: ${getPeriodLabel()}`}
          benchmarks={{
            good: "Healthy pipeline growth with balanced distribution",
            average: "Steady performance within expected ranges",
            concerning: "Low conversion rates or pipeline stagnation"
          }}
        >
          <PipelineMetricsCards pipelineHealth={pipelineHealth} />
        </MetricTooltip>
      )}

      {/* Analytics Tabs */}
      {!isLoading && (
        <Tabs defaultValue="health" className="w-full">
          <TabsList className={`grid w-full grid-cols-4 ${getTabContainerClass()} p-1 rounded-md`}>
            <TabsTrigger 
              value="health" 
              className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors"
            >
              <Activity className="h-4 w-4" />
              Pipeline Health
            </TabsTrigger>
            <TabsTrigger 
              value="trends" 
              className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors"
            >
              <TrendingUp className="h-4 w-4" />
              Trend Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="forecast" 
              className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors"
            >
              <Target className="h-4 w-4" />
              Forecasting
            </TabsTrigger>
            <TabsTrigger 
              value="stage-analysis" 
              className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors"
            >
              <Layers className="h-4 w-4" />
              Stage Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="health" className="space-y-4">
            <MetricTooltip
              title="Pipeline Health Analysis"
              description="Visual representation of your pipeline distribution across sales stages, showing both deal count and monetary value to identify potential bottlenecks."
              calculation="Stage Distribution: Count and value of opportunities by current stage. Value by Stage: Total pipeline value grouped by sales stage."
              period="Real-time snapshot of active pipeline"
              benchmarks={{
                good: "Balanced distribution across stages",
                average: "Some concentration in specific stages",
                concerning: "Heavy bottlenecks in early or late stages"
              }}
            >
              <PipelineHealthTab 
                stageDistribution={stageDistribution} 
                pipelineHealth={pipelineHealth} 
              />
            </MetricTooltip>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <MetricTooltip
              title="Pipeline Trend Analysis"
              description="Historical view of pipeline performance over time, showing how your pipeline value, deal count, and conversion rates have evolved."
              calculation="Trend analysis based on historical pipeline data showing month-over-month changes in key metrics."
              period="Historical trends based on selected time period filter"
              benchmarks={{
                good: "Consistent upward trends in pipeline value",
                average: "Stable performance with minor fluctuations",
                concerning: "Declining trends or high volatility"
              }}
            >
              <PipelineTrendsTab pipelineTrend={pipelineTrend} />
            </MetricTooltip>
          </TabsContent>

          <TabsContent value="forecast" className="space-y-4">
            <MetricTooltip
              title="Pipeline Forecasting"
              description="Predictive analysis showing projected revenue and deal closure based on current pipeline health and historical conversion patterns."
              calculation="Forecast models based on stage conversion probabilities, historical win rates, and current pipeline velocity."
              period="Forward-looking projections for next 3-6 months"
              benchmarks={{
                good: "Forecasts meeting or exceeding targets",
                average: "Projected performance within acceptable range",
                concerning: "Forecasts significantly below targets"
              }}
            >
              <PipelineForecastTab forecastData={forecastData} />
            </MetricTooltip>
          </TabsContent>

          <TabsContent value="stage-analysis" className="space-y-4">
            <MetricTooltip
              title="Detailed Stage Analysis"
              description="In-depth analysis of each sales stage including conversion rates, average time spent, and success patterns to optimize your sales process."
              calculation="Stage-specific metrics including deal count, total value, conversion rates, and average duration per stage."
              period="Analysis of all opportunities within selected filters"
              benchmarks={{
                good: "High conversion rates with optimal stage timing",
                average: "Standard conversion patterns",
                concerning: "Low conversion or extended stage durations"
              }}
            >
              <PipelineStageAnalysisTab 
                stageDistribution={stageDistribution}
                pipelineMovement={pipelineMovement} 
              />
            </MetricTooltip>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default PipelineAnalytics;
