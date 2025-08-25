import React, { useState, useEffect } from 'react';
import reportsViewsService from '@/services/reportsViewsService';

export const useReportsViews = (refreshKey = 0, pageType = 'reports') => {
  const [savedViews, setSavedViews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchViews = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await reportsViewsService.getViews(pageType);
        
        if (result.success) {
          setSavedViews(result.data || []);
        } else {
          throw new Error(result.error || 'Failed to fetch views');
        }
      } catch (err) {
        console.error('Error fetching views:', err);
        setError(err.message);
        setSavedViews([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchViews();
  }, [refreshKey, pageType]);

  return {
    savedViews,
    isLoading,
    error,
  };
};