import { useState, useEffect } from 'react';
import { advancedSearchApi } from '../services/advancedSearchApi';

export const useSearchResults = (searchParams) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResults = async () => {
    if (!searchParams) return;

    setLoading(true);
    setError(null);

    try {
      const results = await advancedSearchApi.search(searchParams);
      setData(results);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [searchParams]);

  const refetch = () => {
    fetchResults();
  };

  return {
    data,
    loading,
    error,
    refetch
  };
};