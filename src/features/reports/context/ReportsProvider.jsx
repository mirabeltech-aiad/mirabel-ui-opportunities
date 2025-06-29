import React, { useReducer, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { reportsReducer } from './reducer.js';
import { initialState } from './initialState.js';
import { useReportsDashboard, useUpdateReportStar, useReorderReports, prepareStarTogglePayload, prepareReorderPayload } from '../hooks/useService.js';
import * as Actions from './actions.js';
import { ReportsContext } from './Context.js';
import { formatReportData, formatCategories } from '../helpers/formatters.js';

/**
 * Provider component for reports context
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const ReportsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reportsReducer, initialState);
  const [updatingReportId, setUpdatingReportId] = useState(null);
  const [isReordering, setIsReordering] = useState(false);
  const { data, isLoading, error, refetch } = useReportsDashboard();
  const { mutate: updateStarStatus, isPending: isUpdatingStar, isSuccess: isStarUpdateSuccess, isError: isStarUpdateError } = useUpdateReportStar();
  const { mutate: reorderReportsApi, isPending: isReorderingPending, isSuccess: isReorderSuccess, isError: isReorderError } = useReorderReports();

  // Update reports when API data is available
  useEffect(() => {
    if (data && !isLoading && !error) {
      const reportsArray = Array.isArray(data) ? data.map(formatReportData) : [];
      const categoriesArray = Array.isArray(data) ? formatCategories(data) : [];

      dispatch({ type: Actions.ACTIONS.SET_REPORTS, payload: reportsArray });
      dispatch({ type: Actions.ACTIONS.SET_CATEGORIES, payload: categoriesArray });
    }
  }, [data, isLoading, error]);

  // Clear updating report ID when mutation completes
  useEffect(() => {
    if (!isUpdatingStar && (isStarUpdateSuccess || isStarUpdateError)) {
      setUpdatingReportId(null);
      // Refetch data after star update to ensure consistency
      if (isStarUpdateSuccess) {
        refetch();
      }
    }
  }, [isUpdatingStar, isStarUpdateSuccess, isStarUpdateError, refetch]);

  // Clear reordering state when reorder operation completes
  useEffect(() => {
    if (!isReorderingPending && (isReorderSuccess || isReorderError)) {
      setIsReordering(false);
      // Refetch data after reorder to ensure consistency
      if (isReorderSuccess) {
        refetch();
      }
    }
  }, [isReorderingPending, isReorderSuccess, isReorderError, refetch]);

  const hasFavorites = useMemo(() => state.reports.some(report => report.isStarred), [state.reports]);

  const displayCategories = useMemo(() => {
    const favoritesCategory = 'Favorites';
    const remainingCategories = state.categories.filter(c => c !== favoritesCategory);
    
    if (hasFavorites) {
      return [favoritesCategory, ...remainingCategories];
    }
    
    return remainingCategories;
  }, [state.categories, hasFavorites]);

  const filteredReports = useMemo(() => {
    const reports = Array.isArray(state.reports) ? state.reports : [];
    if (state.activeTab !== 'All') {
      return reports.filter(report =>
        (state.activeTab === 'Favorites' ? report.isStarred : report.category.includes(state.activeTab))
      );
    }
    if (state.searchQuery) {
      return reports.filter(report =>
        report.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        report.tags.some(tag => tag.toLowerCase().includes(state.searchQuery.toLowerCase()))
      );
    }
    return reports;
  }, [state.reports, state.activeTab, state.searchQuery]);

  const tabCounts = useMemo(() => {
    const reports = Array.isArray(state.reports) ? state.reports : [];
    const counts = { All: reports.length, Favorites: reports.filter(r => r.isStarred).length };
    reports.forEach(report => {
      report.category.forEach(cat => {
        if (cat !== 'All') {
          counts[cat] = (counts[cat] || 0) + 1;
        }
      });
    });
    return counts;
  }, [state.reports]);

  const handleSetActiveTab = (tab) => {
    dispatch({ type: Actions.ACTIONS.SET_ACTIVE_TAB, payload: tab });
  };

  const handleSetSearchQuery = (query) => {
    dispatch({ type: Actions.ACTIONS.SET_SEARCH_QUERY, payload: query });
  };

  const handleToggleStar = async (report) => {
    if (report) {
      // Optimistic update
      dispatch({
        type: Actions.ACTIONS.TOGGLE_REPORT_STAR,
        payload: { reportId: report.id, isStarred: !report.isStarred }
      });
      
      setUpdatingReportId(report.id);
      const payload = prepareStarTogglePayload(report, !report.isStarred);

      try {
        await updateStarStatus(payload);
      } catch (error) {
        // Revert optimistic update on error
        dispatch({
          type: Actions.ACTIONS.TOGGLE_REPORT_STAR,
          payload: { reportId: report.id, isStarred: report.isStarred }
        });
      }
    }
  };

  const handleSetReports = (reports) => {
    dispatch({ type: Actions.ACTIONS.SET_REPORTS, payload: reports });
  };

  const handleReorderReports = async (activeId, overId) => {
    // First update the local state optimistically
    dispatch({
      type: Actions.ACTIONS.REORDER_REPORTS,
      payload: { activeId, overId }
    });

    // Then prepare the updated reports array with new sortOrder values
    const updatedReports = [...state.reports];
    const activeIndex = updatedReports.findIndex(r => r.id === activeId);
    const overIndex = updatedReports.findIndex(r => r.id === overId);

    if (activeIndex !== -1 && overIndex !== -1) {
      // Move item in array
      const [movedItem] = updatedReports.splice(activeIndex, 1);
      updatedReports.splice(overIndex, 0, movedItem);

      // Update sortOrder for all reports
      const reorderedReports = updatedReports.map((report, index) => ({
        ...report,
        sortOrder: index + 1
      }));

      // Set reordering state and make API call
      setIsReordering(true);
      const payload = prepareReorderPayload(reorderedReports);
      
      try {
        await reorderReportsApi(payload);
      } catch (error) {
        // Revert optimistic update on error
        dispatch({
          type: Actions.ACTIONS.SET_REPORTS,
          payload: state.reports
        });
      }
    }
  };

  const value = {
    ...state,
    categories: displayCategories,
    filteredReports,
    tabCounts,
    isLoading: isLoading,
    error,
    isUpdatingStar,
    updatingReportId,
    isReordering,
    isReorderingPending,
    setActiveTab: handleSetActiveTab,
    setSearchQuery: handleSetSearchQuery,
    toggleStar: handleToggleStar,
    setReports: handleSetReports,
    reorderReports: handleReorderReports,
  };

  return (
    <ReportsContext.Provider value={value}>
      {children}
    </ReportsContext.Provider>
  );
};

ReportsProvider.propTypes = {
  children: PropTypes.node.isRequired
}; 