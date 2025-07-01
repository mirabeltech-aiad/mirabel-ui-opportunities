
import { useMemo, useState, useEffect } from 'react';
import repPerformanceService from '@/services/repPerformanceService';

export const useConversionFunnelData = (timeRange, selectedRep, selectedProduct, selectedBusinessUnit) => {
  const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API when filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log(`Fetching conversion funnel data for filters:`, {
          timeRange,
          selectedRep,
          selectedProduct,
          selectedBusinessUnit
        });
        
        const response = await repPerformanceService.getConversionFunnelData(
          timeRange,
          selectedRep,
          selectedProduct,
          selectedBusinessUnit
        );
        
        setApiData(response);
        console.log('Conversion funnel data fetched successfully:', response);
      } catch (err) {
        console.error('Error fetching conversion funnel data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange, selectedRep, selectedProduct, selectedBusinessUnit]);

  // Transform and process funnel data
  const funnelData = useMemo(() => {
    if (!apiData) {
      console.log('No API data available for funnel analysis');
      return [];
    }
    
    const transformedData = repPerformanceService.transformToCompleteFunnelData(apiData);
    console.log('Funnel Data Generated from API:', transformedData.funnelStages);
    return transformedData.funnelStages;
  }, [apiData]);

  // Get conversion rates data
  const conversionRates = useMemo(() => {
    if (!apiData) {
      return [];
    }
    
    const rates = repPerformanceService.transformToConversionRates(apiData);
    console.log('Conversion Rates Data Generated from API:', rates);
    return rates;
  }, [apiData]);

  // Get bottleneck analysis data
  const bottleneckAnalysis = useMemo(() => {
    if (!apiData) {
      return [];
    }
    
    const bottlenecks = repPerformanceService.transformToBottleneckAnalysis(apiData);
    console.log('Bottleneck Analysis Data Generated from API:', bottlenecks);
    return bottlenecks;
  }, [apiData]);

  // Calculate overall metrics
  const overallMetrics = useMemo(() => {
    if (!funnelData || funnelData.length === 0) {
      return {
        totalStarting: 0,
        totalClosed: 0,
        overallConversion: 0,
        biggestDropOff: null,
        activeOpportunities: 0
      };
    }

    const totalStarting = funnelData[0]?.count || 0;
    const totalClosed = funnelData[funnelData.length - 1]?.count || 0;
    const overallConversion = totalStarting > 0 ? ((totalClosed / totalStarting) * 100).toFixed(1) : '0';
    
    // Find biggest drop-off stage
    const biggestDropOff = funnelData.reduce((max, stage) => 
      stage.dropOff > (max?.dropOff || 0) ? stage : max, null
    );

    // Calculate active opportunities (sum of open opportunities)
    const activeOpportunities = funnelData.reduce((sum, stage) => sum + (stage.open || 0), 0);

    return {
      totalStarting,
      totalClosed,
      overallConversion: parseFloat(overallConversion),
      biggestDropOff,
      activeOpportunities
    };
  }, [funnelData]);

  return {
    funnelData,
    conversionRates,
    bottleneckAnalysis,
    overallMetrics,
    isLoading,
    error
  };
};
