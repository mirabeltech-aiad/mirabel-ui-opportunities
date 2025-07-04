import { useState, useEffect, useCallback } from 'react';
import executiveDashboardService from '@/services/reports/executiveDashboardService';
import { 
  transformExecutiveDashboardToKPIMetrics,
  transformExecutiveDashboardToPipelineHealth,
  transformExecutiveDashboardToRevenueData,
  transformExecutiveDashboardToTeamData
} from '@OpportunityUtils/reports/apiTransformers';

export const useRealtimeReports = (
  period = 'this-quarter', 
  selectedRep = 'all', 
  autoRefresh = true, 
  customDateRange = null,
  selectedProduct = 'all',
  selectedBusinessUnit = 'all'
) => {
  const [data, setData] = useState({
    kpiData: null,
    pipelineHealth: null,
    revenueData: null,
    pipelineData: null,
    teamData: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchReportsData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }
      setError(null);

      console.log('Fetching executive dashboard data using stored procedure for:', {
        period,
        selectedRep,
        customDateRange,
        selectedProduct,
        selectedBusinessUnit
      });
      
      // Call new Executive Dashboard stored procedure service
      const spData = await executiveDashboardService.getExecutiveDashboardData(
        period, 
        selectedRep, 
        customDateRange,
        selectedProduct,
        selectedBusinessUnit
      );
      
      console.log('SP Data received from uspCDCSync_ExecutiveDashboardGet:', spData);

      // Transform stored procedure result sets to dashboard metrics
      const kpiData = transformExecutiveDashboardToKPIMetrics(spData.kpiMetrics, period);
      const pipelineHealth = transformExecutiveDashboardToPipelineHealth(spData.pipelineHealth);
      const revenueData = transformExecutiveDashboardToRevenueData(spData.revenueTrends);
      const teamData = transformExecutiveDashboardToTeamData(spData.teamPerformance);
      
      // Use pipeline health for pipeline chart data
      const pipelineData = spData.pipelineHealth.map(stage => ({
        stage: stage.Stage || 'Unknown',
        count: stage.Opportunities || 0,
        value: stage.Value || 0,
        avgProbability: stage.AvgProbability || 0,
        avgDaysInStage: stage.AvgDaysInStage || 0
      }));

      console.log('Transformed SP data:', {
        kpiData,
        pipelineHealth,
        revenueData,
        pipelineData,
        teamData
      });

      setData({
        kpiData,
        pipelineHealth,
        revenueData,
        pipelineData,
        teamData
      });

      setLastUpdated(new Date());
      console.log('Executive Dashboard updated with SP data:', { 
        source: spData.metadata?.source,
        resultSetsCount: spData.metadata?.resultSetsCount,
        timestamp: spData.metadata?.timestamp
      });
      
    } catch (err) {
      console.error('Error fetching executive dashboard data from stored procedure:', err);
      setError(err.message || 'Failed to fetch executive dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [period, selectedRep, customDateRange, selectedProduct, selectedBusinessUnit]);

  // Fetch data on filter changes and handle auto-refresh
  useEffect(() => {
    fetchReportsData();
  }, [fetchReportsData]);

  // Enhanced auto-refresh effect with better conflict prevention
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Only auto-refresh if not currently loading and no recent filter changes
        const now = Date.now();
        const lastFetchTime = lastUpdated ? lastUpdated.getTime() : 0;
        const timeSinceLastFetch = now - lastFetchTime;
        
        // Wait at least 5 seconds after last update before auto-refreshing
        if (!isLoading && timeSinceLastFetch > 5000) {
          console.log('Auto-refreshing dashboard data');
          fetchReportsData(false); // Don't show loading for auto-refresh
        }
      }, 60000); // 60 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh, isLoading, lastUpdated]); // Include lastUpdated to track recent changes

  const refresh = useCallback(() => {
    fetchReportsData(true);
  }, [fetchReportsData]);

  return {
    ...data,
    isLoading,
    error,
    lastUpdated,
    refresh
  };
};
