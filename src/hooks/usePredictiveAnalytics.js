
import { useState, useEffect } from 'react';
import predictiveAnalyticsService from '../services/predictiveAnalyticsService';
import { toast } from '@/hooks/use-toast';

export const usePredictiveAnalytics = (
  period = 'this-quarter',
  selectedRep = 'all',
  customDateRange = null,
  selectedProduct = 'all',
  selectedBusinessUnit = 'all'
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await predictiveAnalyticsService.getPredictiveAnalyticsWithFilters(
        period,
        selectedRep,
        customDateRange,
        selectedProduct,
        selectedBusinessUnit
      );

      setData(response);
    } catch (err) {
      console.error('Error fetching predictive analytics data:', err);
      setError(err);
      toast({
        title: "Error",
        description: "Failed to load predictive analytics data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period, selectedRep, customDateRange, selectedProduct, selectedBusinessUnit]);

  const refetch = () => {
    fetchData();
  };

  return {
    data,
    loading,
    error,
    refetch
  };
};
