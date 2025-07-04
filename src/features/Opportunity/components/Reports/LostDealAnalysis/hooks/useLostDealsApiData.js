
import { useMemo, useState, useEffect } from 'react';
import repPerformanceService from '@/features/Opportunity/Services/repPerformanceService';

export const useLostDealsApiData = (timeRange, selectedRep, selectedProduct, selectedBusinessUnit) => {
  const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API when filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log(`Fetching lost deals data for filters:`, {
          timeRange,
          selectedRep,
          selectedProduct,
          selectedBusinessUnit
        });
        
        const response = await repPerformanceService.getLostDealsData(
          timeRange,
          selectedRep,
          selectedProduct,
          selectedBusinessUnit
        );
        
        setApiData(response);
        console.log('Lost deals data fetched successfully:', response);
      } catch (err) {
        console.error('Error fetching lost deals data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange, selectedRep, selectedProduct, selectedBusinessUnit]);

  // Transform API data to component format
  const lostDealsData = useMemo(() => {
    if (!apiData) {
      console.log('No API data available for lost deals');
      return {
        summary: { totalLostDeals: 0, totalLostValue: 0, avgLostDealSize: 0, avgDaysToLoss: 0 },
        lossReasons: [],
        stageAnalysis: [],
        repAnalysis: [],
        monthlyTrends: []
      };
    }
    
    const transformedData = repPerformanceService.transformToCompleteLostDealsData(apiData);
    console.log('Lost Deals Data Transformed from API:', transformedData);
    return transformedData;
  }, [apiData]);

  return {
    lostDealsData,
    isLoading,
    error
  };
};
