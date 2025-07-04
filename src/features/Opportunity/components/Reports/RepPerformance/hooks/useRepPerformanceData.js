
import { useMemo, useState, useEffect } from 'react';
import repPerformanceService from '@/features/Opportunity/Services/repPerformanceService';

export const useRepPerformanceData = (timeRange, selectedRep, selectedProduct, selectedBusinessUnit) => {
  const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API when filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log(`Fetching rep performance data for filters:`, {
          timeRange,
          selectedRep,
          selectedProduct,
          selectedBusinessUnit
        });
        
        const response = await repPerformanceService.getRepPerformanceData(
          timeRange,
          selectedRep,
          'all', // status - always 'all' for rep performance
          selectedProduct,
          selectedBusinessUnit
        );
        
        setApiData(response);
        console.log('Rep performance data fetched successfully:', response);
      } catch (err) {
        console.error('Error fetching rep performance data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange, selectedRep, selectedProduct, selectedBusinessUnit]);

  // Calculate overall metrics from API data (Table)
  const overallMetrics = useMemo(() => {
    if (!apiData) {
      console.log('No API data available for metrics');
      return {
        totalReps: 0,
        avgQuotaAttainment: 0,
        topPerformer: 'N/A'
      };
    }
    
    const metrics = repPerformanceService.transformToMetrics(apiData);
    console.log(`Metrics calculated from API:`, metrics);
    return metrics;
  }, [apiData]);

  // Get team performance data from API (Table)
  const teamData = useMemo(() => {
    if (!apiData) {
      console.log('No API data available for team data');
      return [];
    }
    
    const team = repPerformanceService.transformToTeamData(apiData);
    console.log('Team Data Generated from API:', team);
    return team;
  }, [apiData]);

  // Get monthly activity data from API (Table2)
  const repMonthlyData = useMemo(() => {
    if (!apiData) {
      console.log('No API data available for monthly data');
      return [];
    }
    
    const monthly = repPerformanceService.transformToMonthlyData(apiData);
    console.log('Monthly Data Generated from API:', monthly);
    return monthly;
  }, [apiData]);

  // Get activity data from API (Table1)
  const activityData = useMemo(() => {
    if (!apiData) {
      return [];
    }
    
    const activity = repPerformanceService.transformToActivityData(apiData);
    console.log('Activity Data Generated from API:', activity);
    return activity;
  }, [apiData]);

  // Get pipeline stage data from API (Table3)
  const pipelineStageData = useMemo(() => {
    if (!apiData) {
      return [];
    }
    
    const pipeline = repPerformanceService.transformToPipelineStageData(apiData);
    console.log('Pipeline Stage Data Generated from API:', pipeline);
    return pipeline;
  }, [apiData]);

  // Get product performance data from API (Table4)
  const productData = useMemo(() => {
    if (!apiData) {
      return [];
    }
    
    const products = repPerformanceService.transformToProductData(apiData);
    console.log('Product Data Generated from API:', products);
    return products;
  }, [apiData]);

  // Get customer success data from API (Table5)
  const customerData = useMemo(() => {
    if (!apiData) {
      return [];
    }
    
    const customers = repPerformanceService.transformToCustomerData(apiData);
    console.log('Customer Data Generated from API:', customers);
    return customers;
  }, [apiData]);

  return {
    overallMetrics,
    teamData,
    repMonthlyData,
    activityData,
    pipelineStageData,
    productData,
    customerData,
    isLoading,
    error
  };
};
