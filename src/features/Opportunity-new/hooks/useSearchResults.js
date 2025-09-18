import { useState, useEffect, useCallback, useRef } from 'react';
import { opportunitiesReportService } from '../services/opportunitiesReportService';
import { logger } from '../../../components/shared/logger';

export const useSearchResults = (searchParams) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use refs to prevent infinite loops
  const isInitialMount = useRef(true);
  const lastSearchParamsRef = useRef();

  const fetchResults = useCallback(async (params) => {
    setLoading(true);
    setError(null);

    try {
      let results;

      if (!params || Object.keys(params).length === 0) {
        logger.info('useSearchResults: No search params, fetching initial data');
        results = await opportunitiesReportService.getInitialData();
      } else {
        logger.info('useSearchResults: Executing search with params:', params);
        results = await opportunitiesReportService.executeSearch(params);
      }

      logger.info('useSearchResults: Results received:', results);
      setData(results);
    } catch (err) {
      logger.error('useSearchResults: Error fetching results:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Convert searchParams to string for comparison
    const currentParamsString = JSON.stringify(searchParams || {});
    const lastParamsString = JSON.stringify(lastSearchParamsRef.current || {});

    // Only fetch if this is the initial mount or if params actually changed
    if (isInitialMount.current || currentParamsString !== lastParamsString) {
      isInitialMount.current = false;
      lastSearchParamsRef.current = searchParams;
      fetchResults(searchParams);
    }
  }, [searchParams, fetchResults]);

  // No cleanup needed since we removed AbortController

  const refetch = useCallback(() => {
    fetchResults(searchParams);
  }, [fetchResults, searchParams]);

  return {
    data,
    loading,
    error,
    refetch
  };
};