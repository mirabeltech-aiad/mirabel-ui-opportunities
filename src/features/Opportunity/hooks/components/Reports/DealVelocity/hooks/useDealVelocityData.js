
import { useMemo, useState, useEffect } from 'react';
import repPerformanceService from '@/features/Opportunity/Services/repPerformanceService';

export const useDealVelocityData = (dateRange, selectedRep, selectedProduct, selectedBusinessUnit) => {
  const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API when filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log(`Fetching deal velocity data for filters:`, {
          dateRange,
          selectedRep,
          selectedProduct,
          selectedBusinessUnit
        });
        
        const response = await repPerformanceService.getDealVelocityData(
          dateRange,
          selectedRep,
          selectedProduct,
          selectedBusinessUnit
        );
        
        setApiData(response);
        console.log('Deal velocity data fetched successfully:', response);
      } catch (err) {
        console.error('Error fetching deal velocity data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateRange, selectedRep, selectedProduct, selectedBusinessUnit]);

  // Transform and process deal velocity data
  const velocityData = useMemo(() => {
    if (!apiData) {
      console.log('No API data available for deal velocity analysis');
      return null;
    }
    
    const transformedData = repPerformanceService.transformToCompleteDealVelocityData(apiData);
    console.log('Deal Velocity Data Generated from API:', transformedData);
    return transformedData;
  }, [apiData]);

  // Get overall metrics
  const overallMetrics = useMemo(() => {
    return velocityData?.overallMetrics || {
      avgSalesCycle: 0,
      wonDeals: 0,
      totalRevenue: 0,
      avgDealSize: 0,
      fastestDeal: 0,
      slowestDeal: 0
    };
  }, [velocityData]);

  // Get rep velocity data
  const repVelocity = useMemo(() => {
    return velocityData?.repVelocity || [];
  }, [velocityData]);

  // Get stage velocity data
  const stageVelocity = useMemo(() => {
    return velocityData?.stageVelocity || [];
  }, [velocityData]);

  // Get velocity trends data
  const velocityTrends = useMemo(() => {
    return velocityData?.velocityTrends || [];
  }, [velocityData]);

  // Calculate bottlenecks (stages with variance > 15%)
  const bottlenecks = useMemo(() => {
    return stageVelocity.filter(stage => stage.variance > 15);
  }, [stageVelocity]);

  return {
    velocityData,
    overallMetrics,
    repVelocity,
    stageVelocity,
    velocityTrends,
    bottlenecks,
    isLoading,
    error
  };
};
