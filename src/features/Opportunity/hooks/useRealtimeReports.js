import { useState, useEffect, useCallback, useRef } from 'react';
import executiveDashboardService from '@/features/Opportunity/Services/reports/executiveDashboardService';
import { 
  transformExecutiveDashboardToKPIMetrics,
  transformExecutiveDashboardToPipelineHealth,
  transformExecutiveDashboardToRevenueData,
  transformExecutiveDashboardToTeamData
} from '@OpportunityUtils/reports/apiTransformers';


export const useRealtimeReports = (
  period = 'all', 
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
    teamData: null,
    previousPeriodKpiData: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Track pending API calls to prevent duplicates
  const pendingCallRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  const fetchReportsData = useCallback(async (showLoading = true, clearCache = false) => {
    // Create unique call signature to prevent duplicate calls
    const callSignature = JSON.stringify({
      period,
      selectedRep,
      customDateRange,
      selectedProduct,
      selectedBusinessUnit,
      clearCache
    });

    // If same call is already in progress, don't make another one
    if (pendingCallRef.current === callSignature) {
      console.log('🚫 Duplicate API call prevented:', callSignature);
      return;
    }

    try {
      pendingCallRef.current = callSignature;
      
      if (showLoading) {
        setIsLoading(true);
      }
      setError(null);

      console.log('🔴 useRealtimeReports - Fetching executive dashboard data:', {
        period,
        selectedRep,
        customDateRange,
        selectedProduct,
        selectedBusinessUnit,
        callSignature: callSignature.substring(0, 100) + '...',
        timestamp: new Date().toISOString()
      });
      
      // Clear cache when filters change to ensure fresh data
      if (clearCache) {
        console.log('🧹 Clearing executive dashboard cache due to filter change');
        executiveDashboardService.clearCache();
      }
      
      // Call new Executive Dashboard stored procedure service
      const spData = await executiveDashboardService.getExecutiveDashboardData(
        period, 
        selectedRep, 
        customDateRange,
        selectedProduct,
        selectedBusinessUnit
      );
      
      console.log('SP Data received from uspCDCSync_ExecutiveDashboardGet:', spData);

      // The service already returns structured data, so use it directly
      const kpiData = transformExecutiveDashboardToKPIMetrics(spData.kpiMetrics, period);
      const pipelineHealth = transformExecutiveDashboardToPipelineHealth(spData.pipelineHealth);
      const revenueData = transformExecutiveDashboardToRevenueData(spData.revenueTrends);
      
      // Transform previous period KPI data for comparison
      const previousPeriodKpiData = spData.previousPeriodKpiMetrics && Object.keys(spData.previousPeriodKpiMetrics).length > 0 
        ? transformExecutiveDashboardToKPIMetrics(spData.previousPeriodKpiMetrics, period)
        : null;
      
      console.log('📊 Previous Period KPI Data from SP:', spData.previousPeriodKpiMetrics);
      console.log('📊 Transformed Previous Period KPI Data:', previousPeriodKpiData);
      
      // Add debugging for team performance data
      console.log('🏆 useRealtimeReports - Raw team performance data from SP:', spData.teamPerformance);
      console.log('🏆 useRealtimeReports - Team performance data type:', typeof spData.teamPerformance);
      console.log('🏆 useRealtimeReports - Team performance data length:', spData.teamPerformance?.length);
      
      const teamData = transformExecutiveDashboardToTeamData(spData.teamPerformance);
      
      console.log('🏆 useRealtimeReports - Transformed team data:', teamData);
      console.log('🏆 useRealtimeReports - Transformed team data length:', teamData?.length);
      
      // Use pipeline health for pipeline chart data
      const pipelineData = spData.pipelineHealth?.map(stage => ({
        stage: stage.Stage || 'Unknown',
        count: stage.Opportunities || 0,
        value: stage.Value || 0,
        avgProbability: stage.AvgProbability || 0,
        avgDaysInStage: stage.AvgDaysInStage || 0
      })) || [];

      console.log('Transformed SP data:', {
        kpiData,
        pipelineHealth,
        revenueData,
        pipelineData,
        teamData,
        previousPeriodKpiData
      });

      setData({
        kpiData,
        pipelineHealth,
        revenueData,
        pipelineData,
        teamData,
        previousPeriodKpiData
      });

      setLastUpdated(new Date());
      console.log('Executive Dashboard updated with SP data:', { 
        source: spData.metadata?.source,
        resultSetsCount: spData.metadata?.resultSetsCount,
        timestamp: spData.metadata?.timestamp
      });
      
    } catch (err) {
      console.error('❌ Error fetching executive dashboard data from stored procedure:', err);
      setError(err.message || 'Failed to fetch executive dashboard data');
    } finally {
      setIsLoading(false);
      pendingCallRef.current = null; // Clear pending call signature
    }
  }, [period, selectedRep, customDateRange, selectedProduct, selectedBusinessUnit]);

  // Debounced effect to fetch data on filter changes
  useEffect(() => {
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout to debounce rapid filter changes
    debounceTimeoutRef.current = setTimeout(() => {
      console.log('⏱️ Debounced filter change - fetching data');
      fetchReportsData(true, true); // Show loading and clear cache on filter changes
    }, 300); // 300ms debounce

    // Cleanup function
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [period, selectedRep, customDateRange, selectedProduct, selectedBusinessUnit]); // Fixed dependencies to trigger on filter changes

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
  }, [autoRefresh, isLoading, lastUpdated, fetchReportsData]); // Include fetchReportsData to ensure latest version is used

  const refresh = useCallback(() => {
    fetchReportsData(true, true); // Show loading and clear cache on manual refresh
  }, [fetchReportsData]);

  return {
    ...data,
    isLoading,
    error,
    lastUpdated,
    refresh
  };
};