import React from "react";
import DateRangePicker from "../ui/DateRangePicker";
import MetricComparison from "./MetricComparison";
import MetricDrillDown from "./MetricDrillDown";
import TeamPerformanceTable from "./TeamPerformanceTable";
import MetricTooltip from "./MetricTooltip";
import KPICards from "./ExecutiveDashboard/KPICards";
import QuotaPipelineSection from "./ExecutiveDashboard/QuotaPipelineSection";
import ChartsSection from "./ExecutiveDashboard/ChartsSection";
import DashboardHeader from "./ExecutiveDashboard/DashboardHeader";
import ExecutiveFilterBar from "./ExecutiveDashboard/ExecutiveFilterBar";
import ErrorState from "./ExecutiveDashboard/ErrorState";
import LoadingState from "./ExecutiveDashboard/LoadingState";
import DataValidationWrapper from "./shared/DataValidationWrapper";
import MockDataCleanupBanner from "./shared/MockDataCleanupBanner";
import { useExecutiveDashboard } from "./ExecutiveDashboard/useExecutiveDashboard";

const ExecutiveDashboard = () => {
  const {
    selectedPeriod,
    selectedRep,
    selectedProduct,
    selectedBusinessUnit,
    customDateRange,
    drillDownMetric,
    isDrillDownOpen,
    kpiData,
    pipelineHealth,
    revenueData,
    pipelineData,
    teamData,
    isLoading,
    error,
    handleRefresh,
    handleExport,
    handleMetricClick,
    handlePeriodChange,
    handleCustomDateRangeChange,
    handleRepChange,
    handleProductChange,
    handleBusinessUnitChange,
    setIsDrillDownOpen
  } = useExecutiveDashboard();

  // Show error state when API is unavailable
  if (error) {
    return <ErrorState error={error} onRefresh={handleRefresh} />;
  }

  return (
    <div className="space-y-6">
      <DashboardHeader />

      {/* Data Source Banner */}
      <MockDataCleanupBanner 
        hasMockData={false}
        hasApiConnection={true}
        componentName="Executive Dashboard"
        apiEndpoint="services/admin/common/production/executesp/ → uspCDCSync_ExecutiveDashboardGet"
      />

      {/* Executive Filter Bar */}
      <ExecutiveFilterBar
        timeRange={selectedPeriod}
        salesRep={selectedRep}
        product={selectedProduct}
        businessUnit={selectedBusinessUnit}
        onTimeRangeChange={handlePeriodChange}
        onSalesRepChange={handleRepChange}
        onProductChange={handleProductChange}
        onBusinessUnitChange={handleBusinessUnitChange}
        onExport={handleExport}
        onRefresh={handleRefresh}
      />

      {/* Custom Date Range Picker - Show only when custom period is selected */}
      {selectedPeriod === "custom" && (
        <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <span className="text-sm font-medium text-blue-700">Custom Date Range:</span>
          <DateRangePicker 
            dateRange={customDateRange}
            onDateRangeChange={handleCustomDateRangeChange}
          />
          {customDateRange?.from && customDateRange?.to && (
            <span className="text-sm text-green-600 font-medium">
              ✓ Range selected
            </span>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading && !kpiData && <LoadingState />}

      {/* Dashboard Content */}
      {!error && (
        <>
          {/* KPI Cards Row */}
          <KPICards 
            kpiData={kpiData}
            pipelineHealth={pipelineHealth}
            selectedPeriod={selectedPeriod}
            onMetricClick={handleMetricClick}
          />

          {/* Quota Progress & Pipeline Health Row */}
          <QuotaPipelineSection 
            kpiData={kpiData}
            pipelineHealth={pipelineHealth}
          />

          {/* Metric Comparison */}
          <MetricComparison 
            currentPeriod={selectedPeriod}
            onPeriodChange={handlePeriodChange}
            selectedProduct={selectedProduct}
            selectedBusinessUnit={selectedBusinessUnit}
          />

          {/* Charts Row */}
          <ChartsSection 
            revenueData={revenueData}
            pipelineData={pipelineData}
          />

          {/* Team Performance Table */}
          <MetricTooltip
            title="Team Performance Leaderboard"
            description="Individual sales rep performance showing key metrics like deals closed, revenue generated, and quota progress."
            calculation="Real-time data from your CRM showing actual performance metrics"
            period={selectedPeriod === "all" ? "All periods" :
                    selectedPeriod === "today" ? "Today" :
                    selectedPeriod === "yesterday" ? "Yesterday" :
                    selectedPeriod === "this-week" ? "This week" :
                    selectedPeriod === "last-week" ? "Last week" :
                    selectedPeriod === "last-7-days" ? "Last 7 days" :
                    selectedPeriod === "last-14-days" ? "Last 14 days" :
                    selectedPeriod === "this-month" ? "This month" :
                    selectedPeriod === "last-month" ? "Last month" :
                    selectedPeriod === "last-30-days" ? "Last 30 days" :
                    selectedPeriod === "last-60-days" ? "Last 60 days" :
                    selectedPeriod === "last-90-days" ? "Last 90 days" :
                    selectedPeriod === "this-quarter" ? "Current quarter" : 
                    selectedPeriod === "last-quarter" ? "Last quarter" :
                    selectedPeriod === "last-120-days" ? "Last 120 days" :
                    selectedPeriod === "last-6-months" ? "Last 6 months" :
                    selectedPeriod === "this-year" ? "This year" :
                    selectedPeriod === "ytd" ? "Year to date" : 
                    selectedPeriod === "last-year" ? "Last year" :
                    selectedPeriod === "last-12-months" ? "Last 12 months" :
                    selectedPeriod === "last-18-months" ? "Last 18 months" :
                    selectedPeriod === "last-24-months" ? "Last 24 months" :
                    selectedPeriod === "custom" ? "Custom date range" : "All periods"}
          >
            <TeamPerformanceTable data={teamData} />
          </MetricTooltip>
        </>
      )}

      {/* Drill-down Modal */}
      <MetricDrillDown 
        isOpen={isDrillDownOpen}
        onClose={() => setIsDrillDownOpen(false)}
        metric={drillDownMetric}
        period={selectedPeriod}
      />
    </div>
  );
};

export default ExecutiveDashboard;
