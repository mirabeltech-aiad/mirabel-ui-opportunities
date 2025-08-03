
import { useQuery, UseQueryOptions, keepPreviousData } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export const useDeferredQuery = <T>(
  queryKey: unknown[],
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>,
  defer = true
) => {
  const [shouldFetch, setShouldFetch] = useState(!defer);

  useEffect(() => {
    if (defer) {
      // Much faster defer timing for better UX
      const timer = setTimeout(() => setShouldFetch(true), 25);
      return () => clearTimeout(timer);
    }
  }, [defer]);

  return useQuery({
    queryKey,
    queryFn,
    enabled: shouldFetch,
    // Optimized caching strategy
    staleTime: 10 * 60 * 1000,    // 10 minutes - keep data fresh longer
    gcTime: 15 * 60 * 1000,       // 15 minutes - keep in cache longer
    retry: 2,                      // Reduce retry attempts
    retryDelay: 1000,             // Faster retry
    refetchOnWindowFocus: false,   // Prevent unnecessary refetches
    refetchOnMount: false,         // Use cached data when available
    placeholderData: keepPreviousData, // Keep previous data during transitions
    ...options,
  });
};
