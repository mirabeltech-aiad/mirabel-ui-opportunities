
import { useMemo, useState, useEffect } from 'react';
import salesPerformanceService from '@/features/Opportunity/Services/salesPerformanceService';

export const useSalesPerformanceData = (opportunities, dateRange, selectedRep, selectedStatus, selectedProduct, selectedBusinessUnit) => {
  const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API when filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log(`Fetching sales performance data for filters:`, {
          dateRange,
          selectedRep,
          selectedStatus,
          selectedProduct,
          selectedBusinessUnit
        });
        
        const response = await salesPerformanceService.getSalesPerformanceData(
          dateRange,
          selectedRep,
          selectedStatus,
          selectedProduct,
          selectedBusinessUnit
        );
        
        setApiData(response);
        console.log('Sales performance data fetched successfully:', response);
      } catch (err) {
        console.error('Error fetching sales performance data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateRange, selectedRep, selectedStatus, selectedProduct, selectedBusinessUnit]);

  // Get sales reps from API data
  const salesReps = useMemo(() => {
    if (!apiData) return [];
    return salesPerformanceService.getSalesRepsFromData(apiData);
  }, [apiData]);

  // Get filtered opportunities from API data
  const filteredOpportunities = useMemo(() => {
    if (!apiData) {
      console.log('No API data available for opportunities');
      return [];
    }
    
    const opportunities = salesPerformanceService.getOpportunitiesData(apiData);
    console.log(`API opportunities data:`, opportunities.length);
    return opportunities;
  }, [apiData]);

  // Calculate KPIs from API data
  const kpis = useMemo(() => {
    if (!apiData) {
      console.log('No API data available for KPIs');
      return {
        total: 0,
        won: 0,
        lost: 0,
        open: 0,
        totalRevenue: 0,
        avgDealSize: 0,
        conversionRate: 0,
        avgSalesCycle: 0
      };
    }
    
    const calculatedKpis = salesPerformanceService.transformToKPIs(apiData);
    console.log(`KPIs calculated from API:`, calculatedKpis);
    return calculatedKpis;
  }, [apiData]);

  // Generate revenue trend data from API
  const revenueData = useMemo(() => {
    if (!apiData) {
      console.log('No API data available for revenue data');
      return [];
    }
    
    const revenue = salesPerformanceService.transformToRevenueData(apiData);
    console.log('Revenue Data Generated from API:', revenue);
    return revenue;
  }, [apiData]);

  // Generate pipeline data by stage from API
  const pipelineData = useMemo(() => {
    if (!apiData) {
      console.log('No API data available for pipeline data');
      return [];
    }
    
    const pipeline = salesPerformanceService.transformToPipelineData(apiData);
    console.log('Pipeline Data Generated from API:', pipeline);
    return pipeline;
  }, [apiData]);

  // Generate sales rep performance data from API
  const repPerformanceData = useMemo(() => {
    if (!apiData) {
      console.log('No API data available for rep performance data');
      return [];
    }
    
    const repPerformance = salesPerformanceService.transformToRepPerformanceData(apiData);
    console.log('Rep Performance Data Generated from API:', repPerformance);
    return repPerformance;
  }, [apiData]);

  return {
    salesReps,
    filteredOpportunities,
    kpis,
    revenueData,
    pipelineData,
    repPerformanceData,
    isLoading,
    error
  };
};
