/**
 * @fileoverview React context and provider for Reports feature
 * 
 * Provides centralized state management for the reports feature using React Context.
 * Includes computed values and convenience methods for common operations.
 */

import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react';
import { reportsReducer } from './reducer';
import { initialState } from './initialState';
import { 
  setSearchQuery as setSearchQueryAction,
  setActiveCategory as setActiveCategoryAction,
  toggleFavorite as toggleFavoriteAction,
  setCurrentPage as setCurrentPageAction,
  setLoading,
  setError
} from './actions';
import { reportsApiService } from '../services';
import type { ReportsContextValue, ReportsState } from './types';
import type { Report } from '../types';

/**
 * React context for reports feature state
 */
const ReportsContext = createContext<ReportsContextValue | undefined>(undefined);

/**
 * Props for the ReportsProvider component
 */
export interface ReportsProviderProps {
  children: React.ReactNode;
  initialReports?: Report[];
}

/**
 * Provider component for reports context
 */
export const ReportsProvider: React.FC<ReportsProviderProps> = ({ 
  children, 
  initialReports = [] 
}) => {
  const [state, dispatch] = useReducer(reportsReducer, {
    ...initialState,
    reports: initialReports
  });

  // Computed values
  const favoriteReportsData = useMemo(() => {
    return state.filteredReports.filter(report => state.favoriteReports.has(report.id));
  }, [state.filteredReports, state.favoriteReports]);

  const displayedReports = useMemo(() => {
    if (state.activeCategory === 'Favorites') {
      return favoriteReportsData;
    }
    if (state.activeCategory === 'All') {
      return state.filteredReports;
    }
    return state.reportsByCategory[state.activeCategory] || [];
  }, [state.activeCategory, state.filteredReports, state.reportsByCategory, favoriteReportsData]);

  // Action creators (convenience methods)
  const setSearchQuery = useCallback((query: string) => {
    dispatch(setSearchQueryAction(query));
  }, []);

  const setActiveCategory = useCallback((category: string) => {
    dispatch(setActiveCategoryAction(category));
  }, []);

  const toggleFavorite = useCallback((reportId: string) => {
    dispatch(toggleFavoriteAction(reportId));
  }, []);

  const setCurrentPage = useCallback((page: number) => {
    dispatch(setCurrentPageAction(page));
  }, []);

  const refreshReports = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const reports = await reportsApiService.getReports();
      dispatch(setSearchQueryAction(''));
      dispatch(setActiveCategoryAction('All'));
      // Additional logic for processing reports would go here
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to refresh reports'));
    } finally {
      dispatch(setLoading(false));
    }
  }, []);

  const contextValue: ReportsContextValue = useMemo(() => ({
    state,
    dispatch,
    favoriteReportsData,
    displayedReports,
    setSearchQuery,
    setActiveCategory,
    toggleFavorite,
    setCurrentPage,
    refreshReports
  }), [
    state,
    favoriteReportsData,
    displayedReports,
    setSearchQuery,
    setActiveCategory,
    toggleFavorite,
    setCurrentPage,
    refreshReports
  ]);

  return (
    <ReportsContext.Provider value={contextValue}>
      {children}
    </ReportsContext.Provider>
  );
};

/**
 * Hook to access the reports context
 */
export const useReportsContext = (): ReportsContextValue => {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error('useReportsContext must be used within a ReportsProvider');
  }
  return context;
};

/**
 * Hook to access only the reports state (read-only)
 */
export const useReportsState = (): ReportsState => {
  const { state } = useReportsContext();
  return state;
};