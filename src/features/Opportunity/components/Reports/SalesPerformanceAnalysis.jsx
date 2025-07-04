import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { TrendingUp, Target, Users, Filter, Download, Loader2, AlertCircle } from 'lucide-react';
import { toast } from '@/features/Opportunity/hooks/use-toast';
import exportService from '@/features/Opportunity/Services/exportService';
import { useSalesPerformanceData } from './SalesPerformance/hooks/useSalesPerformanceData';
import SalesPerformanceKPICards from './SalesPerformance/SalesPerformanceKPICards';
import SalesPerformanceFilterBar from './SalesPerformance/SalesPerformanceFilterBar';
import SalesPerformanceCharts from './SalesPerformance/SalesPerformanceCharts';
import SalesPerformanceTables from './SalesPerformance/SalesPerformanceTables';
import SalesPerformanceDetailedView from './SalesPerformance/SalesPerformanceDetailedView';
import MetricTooltip from './MetricTooltip';
import { useDesignSystem } from '@/features/Opportunity/hooks/useDesignSystem';

const SalesPerformanceAnalysis = ({ opportunities = [] }) => {
  // Initialize with default values matching API requirements
  const [dateRange, setDateRange] = useState('last-12-months');
  const [selectedRep, setSelectedRep] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState('all');

  // Use design system tokens from knowledge base
  const { getTitleClass, getInteractiveButtonClass, getTabContainerClass } = useDesignSystem();

  const {
    salesReps,
    filteredOpportunities,
    kpis,
    revenueData,
    pipelineData,
    repPerformanceData,
    isLoading,
    error
  } = useSalesPerformanceData(opportunities, dateRange, selectedRep, selectedStatus, selectedProduct, selectedBusinessUnit);

  const handleExport = () => {
    try {
      exportService.exportSalesPerformance(kpis, revenueData, repPerformanceData);
      toast({
        title: "Export Complete",
        description: "Sales performance data has been exported successfully."
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
    // Force refresh by clearing service cache
    if (window.salesPerformanceService) {
      window.salesPerformanceService.clearCache();
    }
    toast({
      title: "Data Refreshed",
      description: "Sales performance data has been refreshed successfully."
    });
  };

  const getPeriodLabel = () => {
    return dateRange === "all-time" ? "All time" :
           dateRange === "this-quarter" ? "Current quarter" :
           dateRange === "last-quarter" ? "Last quarter" :
           dateRange === "last-3-months" ? "Last 3 months" :
           dateRange === "last-6-months" ? "Last 6 months" :
           dateRange === "last-12-months" ? "Last 12 months" :
           dateRange === "ytd" ? "Year to date" :
           dateRange === "this-year" ? "This year" :
           dateRange === "last-year" ? "Last year" : "Last 12 months";
  };

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold ${getTitleClass()} flex items-center gap-2`}>
              <TrendingUp className="h-6 w-6 text-blue-600" />
              Sales Performance Analysis
            </h2>
            <p className="text-muted-foreground">Comprehensive insights into sales metrics and trends</p>
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
      {/* Header - Using knowledge base design system */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${getTitleClass()} flex items-center gap-2`}>
            <TrendingUp className="h-6 w-6 text-blue-600" />
            Sales Performance Analysis
          </h2>
          <p className="text-muted-foreground">Comprehensive insights into sales metrics and trends</p>
        </div>
      </div>

      {/* Updated Comprehensive Filter Bar with all parameters */}
      <MetricTooltip
        title="Performance Filters"
        description="Use these filters to analyze sales performance across different time periods, team members, products, and business units for targeted insights."
        calculation="Filters apply to all metrics, charts, and tables below"
        period="Real-time filtering of all performance data"
      >
        <SalesPerformanceFilterBar 
          timeRange={dateRange}
          salesRep={selectedRep}
          selectedStatus={selectedStatus}
          product={selectedProduct}
          businessUnit={selectedBusinessUnit}
          onTimeRangeChange={setDateRange}
          onSalesRepChange={setSelectedRep}
          onStatusChange={setSelectedStatus}
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
            <p className="text-blue-600">Loading sales performance data...</p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      {!isLoading && (
        <MetricTooltip
          title="Sales Performance KPIs"
          description="Key performance indicators showing total revenue, conversion rates, deal metrics, and sales cycle performance for the selected period."
          calculation="Metrics calculated from live API data based on your current filter selections"
          period={getPeriodLabel()}
          benchmarks={{
            good: "Revenue growth > 15%, Conversion > 25%, Cycle < 60 days",
            average: "Revenue growth 5-15%, Conversion 15-25%, Cycle 60-90 days",
            concerning: "Revenue growth < 5%, Conversion < 15%, Cycle > 90 days"
          }}
        >
          <SalesPerformanceKPICards kpis={kpis} />
        </MetricTooltip>
      )}

      {/* Charts and Tables - Using knowledge base tab styling */}
      {!isLoading && (
        <Tabs defaultValue="trends" className="w-full">
          <TabsList className={`grid w-full grid-cols-4 mb-6 ${getTabContainerClass()} p-1 rounded-md`}>
            <TabsTrigger 
              value="trends" 
              className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors"
            >
              <TrendingUp className="h-4 w-4" />
              Revenue Trends
            </TabsTrigger>
            <TabsTrigger 
              value="pipeline" 
              className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors"
            >
              <Target className="h-4 w-4" />
              Pipeline Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="performance" 
              className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors"
            >
              <Users className="h-4 w-4" />
              Rep Performance
            </TabsTrigger>
            <TabsTrigger 
              value="details" 
              className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors"
            >
              <Filter className="h-4 w-4" />
              Detailed View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-4">
            <SalesPerformanceCharts revenueData={revenueData} pipelineData={pipelineData} />
          </TabsContent>

          <TabsContent value="pipeline" className="space-y-4">
            <SalesPerformanceCharts revenueData={revenueData} pipelineData={pipelineData} />
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <MetricTooltip
              title="Sales Rep Performance Analysis"
              description="Detailed breakdown of individual sales representative performance including deal counts, win rates, revenue generation, and average deal sizes."
              calculation="Performance metrics calculated from live API data within the selected time period"
              period={getPeriodLabel()}
              benchmarks={{
                good: "Win rate > 50%, Revenue per rep > $500K",
                average: "Win rate 25-50%, Revenue per rep $250K-500K",
                concerning: "Win rate < 25%, Revenue per rep < $250K"
              }}
            >
              <SalesPerformanceTables 
                repPerformanceData={repPerformanceData} 
                filteredOpportunities={filteredOpportunities} 
              />
            </MetricTooltip>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <MetricTooltip
              title="Detailed Opportunity Analysis"
              description="Comprehensive view of all opportunities with advanced filtering, sorting, and search capabilities to drill down into specific deals and performance patterns."
              calculation="Real-time data from your CRM API showing all opportunity details within your selected filters"
              period={getPeriodLabel()}
            >
              <SalesPerformanceDetailedView 
                filteredOpportunities={filteredOpportunities}
              />
            </MetricTooltip>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default SalesPerformanceAnalysis;
