import { useState, useEffect, useCallback } from 'react';
import { reportsService } from '../services/reportsService.js';

/**
 * Hook to fetch reports dashboard data using direct service calls
 * @returns {Object} Object with data, loading, error states and refetch function
 */
export const useReportsDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setError(null);
    
    try {
      const result = await reportsService.fetchReports();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    error,
    refetch: fetchData
  };
};

/**
 * Hook to update report star status using direct service calls
 * @returns {Object} Object with mutate function and loading states
 */
export const useUpdateReportStar = () => {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const mutate = useCallback(async (payload) => {
    setIsPending(true);
    setIsSuccess(false);
    setIsError(false);
    
    try {
      await reportsService.updateReportStar(payload);
      setIsSuccess(true);
    } catch (err) {
      setIsError(true);
      console.error('Error updating report star status:', err);
    } finally {
      setIsPending(false);
    }
  }, []);

  return {
    mutate,
    isPending,
    isSuccess,
    isError
  };
};

/**
 * Hook to reorder reports using direct service calls
 * @returns {Object} Object with mutate function and loading states
 */
export const useReorderReports = () => {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const mutate = useCallback(async (payload) => {
    setIsPending(true);
    setIsSuccess(false);
    setIsError(false);
    
    try {
      await reportsService.reorderReports(payload);
      setIsSuccess(true);
    } catch (err) {
      setIsError(true);
      console.error('Error reordering reports:', err);
    } finally {
      setIsPending(false);
    }
  }, []);

  return {
    mutate,
    isPending,
    isSuccess,
    isError
  };
};

/**
 * Helper function to prepare the payload for star toggle
 * @param {Object} report - The report object
 * @param {boolean} isStarred - The new star status
 * @returns {Object} Formatted payload for API
 */
export const prepareStarTogglePayload = (report, isStarred) => {
  let localData = JSON.parse(window.localStorage.getItem("MMClientVars"));
  console.log("LocalStorage", localData?.UserID);
  return {
    "UserId" : localData?.UserID || 1, 
    "ReportId" : report.id,
    "ModifiedTitle" : report.modifiedTitle,
    "IsStarred" : isStarred,
    "SortOrder" : report.sortOrder || 0,
    "CustomTags" : report.tags
  };
};

/**
 * Helper function to prepare the payload for reordering reports
 * @param {Object} report - The report being dragged
 * @param {number} targetSortOrder - The target sort order
 * @returns {Object} Formatted payload for API
 */
export const prepareReorderPayload = (report, targetSortOrder) => {
  let localData = JSON.parse(window.localStorage.getItem("MMClientVars"));
  return {
    UserId: localData?.UserID || 1,
    ReportId: report.id,
    ModifiedTitle: report.modifiedTitle,
    IsStarred: report.isStarred,
    SortOrder: targetSortOrder,
    CustomTags: report.tags
  };
}; 