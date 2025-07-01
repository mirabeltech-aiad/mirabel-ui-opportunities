
import { useState, useEffect, useCallback } from 'react';
import reportsService from '@/services/reports/reportsService';
import { 
  transformApiDataToKPIMetrics, 
  transformApiDataToPipelineHealth,
  generateRevenueChartFromAPI,
  generatePipelineChartFromAPI,
  generateTeamPerformanceFromAPI
} from '@OpportunityUtils/reportUtils';

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

      console.log('Fetching executive dashboard data for:', {
        period,
        selectedRep,
        customDateRange,
        selectedProduct,
        selectedBusinessUnit
      });
      
      const apiData = await reportsService.getExecutiveDashboardData(
        period, 
        selectedRep, 
        customDateRange,
        selectedProduct,
        selectedBusinessUnit
      );
      
      console.log('API Data received:', apiData);

      // Transform API data to dashboard metrics
      const kpiData = transformApiDataToKPIMetrics(apiData, period);
      const pipelineHealth = transformApiDataToPipelineHealth(apiData);
      const revenueData = generateRevenueChartFromAPI(apiData, period);
      const pipelineData = generatePipelineChartFromAPI(apiData);
      const teamData = generateTeamPerformanceFromAPI(apiData, period);

      setData({
        kpiData,
        pipelineHealth,
        revenueData,
        pipelineData,
        teamData
      });

      setLastUpdated(new Date());
      console.log('Dashboard data updated:', { kpiData, pipelineHealth });
      
    } catch (err) {
      console.error('Error fetching reports data:', err);
      setError(err.message || 'Failed to fetch reports data');
    } finally {
      setIsLoading(false);
    }
  }, [period, selectedRep, customDateRange, selectedProduct, selectedBusinessUnit]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    fetchReportsData();

    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchReportsData(false); // Don't show loading for auto-refresh
      }, 60000); // 60 seconds

      return () => clearInterval(interval);
    }
  }, [fetchReportsData, autoRefresh]);

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
