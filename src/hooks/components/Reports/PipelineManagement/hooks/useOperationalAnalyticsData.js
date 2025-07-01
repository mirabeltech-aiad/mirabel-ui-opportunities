
import { useMemo, useState, useEffect } from 'react';
import repPerformanceService from '@/services/repPerformanceService';

export const useOperationalAnalyticsData = (timeRange, selectedRep, selectedProduct, selectedBusinessUnit) => {
  const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API when filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log(`Fetching operational analytics data for filters:`, {
          timeRange,
          selectedRep,
          selectedProduct,
          selectedBusinessUnit
        });
        
        const response = await repPerformanceService.getOperationalAnalyticsData(
          timeRange,
          selectedRep,
          selectedProduct,
          selectedBusinessUnit
        );
        
        setApiData(response);
        console.log('Operational analytics data fetched successfully:', response);
      } catch (err) {
        console.error('Error fetching operational analytics data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange, selectedRep, selectedProduct, selectedBusinessUnit]);

  // Transform API data to component format
  const operationalData = useMemo(() => {
    if (!apiData) {
      console.log('No API data available for operational analytics');
      return {
        productPerformance: [],
        businessUnitPerformance: [],
        opportunityTypesAnalysis: [],
        leadSourceAnalysis: []
      };
    }
    
    const transformedData = repPerformanceService.transformToCompleteOperationalData(apiData);
    console.log('Operational Analytics Data Transformed from API:', transformedData);
    return transformedData;
  }, [apiData]);

  return {
    operationalData,
    isLoading,
    error
  };
};
