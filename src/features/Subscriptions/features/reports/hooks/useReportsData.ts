/**
 * @fileoverview Custom hook for managing reports data operations
 */

import { useCallback } from 'react';
import { useReportsContext } from '../context';
import { reportsApiService } from '../services/api';
import { setLoading, setReports, setError, clearError } from '../context/actions';

/**
 * Custom hook for handling reports data operations
 * Provides methods for loading and managing reports data
 */
export const useReportsData = () => {
  const { state, dispatch } = useReportsContext();

  /**
   * Load all reports from the API
   */
  const loadReports = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());
      
      const reports = await reportsApiService.getReports();
      dispatch(setReports(reports));
    } catch (error) {
      console.error('Failed to load reports:', error);
      dispatch(setError(error instanceof Error ? error.message : 'Failed to load reports'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  /**
   * Refresh reports data
   */
  const refreshReports = useCallback(async () => {
    await loadReports();
  }, [loadReports]);

  return {
    // State
    reports: state.reports,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    loadReports,
    refreshReports
  };
};