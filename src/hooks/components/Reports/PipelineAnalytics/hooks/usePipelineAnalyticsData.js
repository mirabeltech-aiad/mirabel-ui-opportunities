
import { useMemo, useState, useEffect } from 'react';
import repPerformanceService from '@/services/repPerformanceService';

export const usePipelineAnalyticsData = (timeRange, selectedRep, selectedProduct, selectedBusinessUnit) => {
  const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API when filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log(`Fetching pipeline analytics data for filters:`, {
          timeRange,
          selectedRep,
          selectedProduct,
          selectedBusinessUnit
        });
        
        const response = await repPerformanceService.getPipelineAnalyticsData(
          timeRange,
          selectedRep,
          selectedProduct,
          selectedBusinessUnit
        );
        
        setApiData(response);
        console.log('Pipeline analytics data fetched successfully:', response);
      } catch (err) {
        console.error('Error fetching pipeline analytics data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange, selectedRep, selectedProduct, selectedBusinessUnit]);

  // Calculate pipeline health metrics from API data (Result Set 2)
  const pipelineHealth = useMemo(() => {
    if (!apiData) {
      console.log('No API data available for pipeline health metrics');
      return {
        totalValue: 0,
        avgDealSize: 0,
        winRate: 0,
        avgVelocity: 0,
        total: 0,
        openDeals: 0,
        wonDeals: 0,
        lostDeals: 0,
        pipelineValue: 0,
        wonValue: 0
      };
    }
    
    const metrics = repPerformanceService.transformToPipelineHealthMetrics(apiData);
    console.log(`Pipeline health metrics calculated from API:`, metrics);
    return metrics;
  }, [apiData]);

  // Get stage distribution data from API (Result Set 1)
  const stageDistribution = useMemo(() => {
    if (!apiData) {
      console.log('No API data available for stage distribution');
      return [];
    }
    
    const stages = repPerformanceService.transformToPipelineStageDistribution(apiData);
    console.log('Stage Distribution Data Generated from API:', stages);
    return stages;
  }, [apiData]);

  // Get pipeline movement data from API (Result Set 3)
  const pipelineMovement = useMemo(() => {
    if (!apiData) {
      console.log('No API data available for pipeline movement');
      return [];
    }
    
    const movement = repPerformanceService.transformToPipelineMovement(apiData);
    console.log('Pipeline Movement Data Generated from API:', movement);
    return movement;
  }, [apiData]);

  // Generate pipeline trends from movement data
  const pipelineTrend = useMemo(() => {
    if (!apiData) {
      console.log('No API data available for pipeline trends');
      return [];
    }
    
    // Convert movement data to trend format for charts
    const trends = pipelineMovement.map((movement, index) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index] || `Stage ${index + 1}`,
      pipeline: movement.value,
      closed: movement.value * 0.3, // Estimate based on stage progression
      value: movement.value,
      count: movement.count,
      winRate: Math.min(75 + (index * 5), 95), // Progressive win rate estimate
      avgDays: movement.avgDaysInStage
    }));
    
    console.log('Pipeline Trends Data Generated from Movement:', trends);
    return trends;
  }, [pipelineMovement]);

  // Get forecast data from API
  const forecastData = useMemo(() => {
    if (!apiData) {
      console.log('No API data available for forecast');
      return [];
    }
    
    const forecast = repPerformanceService.transformToForecastDataFromPipeline(apiData);
    console.log('Forecast Data Generated from API:', forecast);
    return forecast;
  }, [apiData]);

  return {
    pipelineHealth,
    stageDistribution,
    pipelineMovement,
    pipelineTrend,
    forecastData,
    isLoading,
    error
  };
};
