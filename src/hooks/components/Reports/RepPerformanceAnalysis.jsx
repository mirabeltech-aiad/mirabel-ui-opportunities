
import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@OpportunityComponents/ui/tabs';
import { Users, TrendingUp, Calendar, Target, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@OpportunityComponents/ui/button';
import { toast } from '@/hooks/use-toast';
import { useRepPerformanceData } from './RepPerformance/hooks/useRepPerformanceData';
import RepPerformanceHeader from './RepPerformance/RepPerformanceHeader';
import RepPerformanceMetrics from './RepPerformance/RepPerformanceMetrics';
import RepPerformanceOverview from './RepPerformance/RepPerformanceOverview';
import RepMonthlyActivity from './RepPerformance/RepMonthlyActivity';
import RepQuotaAnalysis from './RepPerformance/RepQuotaAnalysis';
import RepPerformanceFilterBar from './RepPerformance/RepPerformanceFilterBar';
import MetricTooltip from './MetricTooltip';
import { useDesignSystem } from '@/hooks/useDesignSystem';

const RepPerformanceAnalysis = ({ opportunities = [] }) => {
  // Initialize with default values matching API requirements
  const [timeRange, setTimeRange] = useState('last-12-months');
  const [selectedRep, setSelectedRep] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState('all');
  
  // Legacy states for backward compatibility
  const [selectedPeriod, setSelectedPeriod] = useState('q1-2024');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [timeFrame, setTimeFrame] = useState('monthly');

  // Use design system tokens
  const { getTitleClass, getTabContainerClass, getInteractiveButtonClass } = useDesignSystem();

  // Use the new API hook with all data tables
  const {
    overallMetrics,
    teamData,
    repMonthlyData,
    activityData,
    pipelineStageData,
    productData,
    customerData,
    isLoading,
    error
  } = useRepPerformanceData(timeRange, selectedRep, selectedProduct, selectedBusinessUnit);

  // Available years for monthly analysis
  const availableYears = useMemo(() => {
    const years = new Set();
    opportunities.forEach(opp => {
      const date = new Date(opp.actualCloseDate || opp.createdDate);
      if (!isNaN(date.getTime())) {
        years.add(date.getFullYear().toString());
      }
    });
    return Array.from(years).sort().reverse();
  }, [opportunities]);

  const handleExport = () => {
    toast({
      title: "Export Complete",
      description: "Rep performance data has been exported successfully."
    });
  };

  const handleRefresh = () => {
    toast({
      title: "Data Refreshed",
      description: "Rep performance data has been refreshed successfully."
    });
  };

  const getPeriodLabel = () => {
    return timeRange === "all-time" ? "All time" :
           timeRange === "this-quarter" ? "Current quarter" :
           timeRange === "last-quarter" ? "Last quarter" :
           timeRange === "last-3-months" ? "Last 3 months" :
           timeRange === "last-6-months" ? "Last 6 months" :
           timeRange === "last-12-months" ? "Last 12 months" :
           timeRange === "ytd" ? "Year to date" :
           timeRange === "this-year" ? "This year" :
           timeRange === "last-year" ? "Last year" : "Selected period";
  };

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold ${getTitleClass()} flex items-center gap-2`}>
              <Users className="h-6 w-6 text-blue-600" />
              Rep Performance Analysis
            </h2>
            <p className="text-muted-foreground">Individual sales representative performance metrics and trends</p>
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
      {/* Header - Extracted for clarity */}
      <RepPerformanceHeader 
        selectedPeriod={selectedPeriod} 
        onPeriodChange={setSelectedPeriod} 
      />

      {/* New Comprehensive Filter Bar */}
      <MetricTooltip
        title="Rep Performance Filters"
        description="Use these filters to analyze individual sales representative performance across different time periods, products, and business units for targeted insights."
        calculation="Filters apply to all metrics, charts, and tables below"
        period="Real-time filtering of all rep performance data"
      >
        <RepPerformanceFilterBar 
          timeRange={timeRange}
          salesRep={selectedRep}
          product={selectedProduct}
          businessUnit={selectedBusinessUnit}
          onTimeRangeChange={setTimeRange}
          onSalesRepChange={setSelectedRep}
          onProductChange={setSelectedProduct}
          onBusinessUnitChange={setSelectedBusinessUnit}
          onExport={handleExport}
          onRefresh={handleRefresh}
        />
      </MetricTooltip>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center p-8 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-center">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-blue-600">Loading rep performance data...</p>
          </div>
        </div>
      )}

      {/* Key Metrics Cards - Using API data */}
      {!isLoading && (
        <MetricTooltip
          title="Rep Performance Overview Metrics"
          description="High-level metrics showing team size, average quota attainment, and top performer identification for the selected period."
          calculation="Metrics calculated from all sales representatives' performance data within your selected filters"
          period={getPeriodLabel()}
          benchmarks={{
            good: "Avg quota attainment > 100%, consistent top performers",
            average: "Avg quota attainment 80-100%, rotating top performers",
            concerning: "Avg quota attainment < 80%, limited top performers"
          }}
        >
          <RepPerformanceMetrics overallMetrics={overallMetrics} />
        </MetricTooltip>
      )}

      {/* Rep Performance Tabs */}
      {!isLoading && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className={`grid w-full grid-cols-3 ${getTabContainerClass()} p-1 rounded-md`}>
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors"
            >
              <Users className="h-4 w-4" />
              Performance Overview
            </TabsTrigger>
            <TabsTrigger 
              value="monthly" 
              className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors"
            >
              <Calendar className="h-4 w-4" />
              Monthly Activity
            </TabsTrigger>
            <TabsTrigger 
              value="quota" 
              className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors"
            >
              <Target className="h-4 w-4" />
              Quota Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <MetricTooltip
              title="Rep Performance Overview Table"
              description="Detailed breakdown of each sales representative's performance including deals, revenue, quota attainment, and efficiency metrics."
              calculation="Individual rep metrics calculated from all assigned opportunities within the selected time period"
              period={getPeriodLabel()}
              benchmarks={{
                good: "Quota attainment > 100%, win rate > 25%",
                average: "Quota attainment 80-100%, win rate 15-25%",
                concerning: "Quota attainment < 80%, win rate < 15%"
              }}
            >
              <RepPerformanceOverview teamData={teamData} />
            </MetricTooltip>
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4">
            <MetricTooltip
              title="Monthly Activity Analysis"
              description="Month-by-month breakdown of sales activity showing deal creation, wins, and losses to identify seasonal patterns and performance trends."
              calculation="Monthly counts of opportunities created, won, and lost for each sales representative"
              period={`${selectedYear} monthly data`}
              benchmarks={{
                good: "Consistent monthly activity, steady win rates",
                average: "Some monthly variation, seasonal patterns",
                concerning: "Highly irregular activity, poor win consistency"
              }}
            >
              <RepMonthlyActivity 
                repMonthlyData={repMonthlyData}
                selectedYear={selectedYear}
                onYearChange={setSelectedYear}
                availableYears={availableYears}
                timeFrame={timeFrame}
                onTimeFrameChange={setTimeFrame}
              />
            </MetricTooltip>
          </TabsContent>

          <TabsContent value="quota" className="space-y-4">
            <MetricTooltip
              title="Quota Attainment Analysis"
              description="Visual analysis of quota performance across the team showing revenue vs quota targets, helping identify high performers and those needing support."
              calculation="Revenue achieved compared to assigned quota targets for each sales representative"
              period={getPeriodLabel()}
              benchmarks={{
                good: "100%+ quota attainment across majority of team",
                average: "80-100% quota attainment for most reps",
                concerning: "< 80% quota attainment for multiple reps"
              }}
            >
              <RepQuotaAnalysis teamData={teamData} />
            </MetricTooltip>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default RepPerformanceAnalysis;
