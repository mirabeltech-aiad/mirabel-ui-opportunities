import React, { useReducer, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { reportsReducer } from './reducer.js';
import { initialState } from './initialState.js';
import { reportsData } from '../helpers/reportsData.js';
import { useReportsDashboard, useUpdateReportStar, prepareStarTogglePayload } from '../hooks/useService.js';
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
  const { data, isLoading, error } = useReportsDashboard();
  const { mutate: updateStarStatus, isPending: isUpdatingStar } = useUpdateReportStar();
  // Load initial reports data from mock file
  useEffect(() => {
    const formattedReports = reportsData.Reports.map(formatReportData);
    const formattedCategories = formatCategories(reportsData.Categories);
    
    dispatch({ 
      type: Actions.ACTIONS.SET_REPORTS, 
      payload: formattedReports
    });
    dispatch({
      type: Actions.ACTIONS.SET_CATEGORIES,
      payload: formattedCategories
    });
  }, []);

  // Update reports when API data is available
  useEffect(() => {
    if (data && !isLoading && !error) {
      const reportsArray = Array.isArray(data.Reports) ? data.Reports.map(formatReportData) : [];
      const categoriesArray = Array.isArray(data.Categories) ? formatCategories(data.Categories) : [];
      
      dispatch({ type: Actions.ACTIONS.SET_REPORTS, payload: reportsArray });
      dispatch({ type: Actions.ACTIONS.SET_CATEGORIES, payload: categoriesArray });
    }
  }, [data, isLoading, error]);

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

  const handleToggleStar = (report) => {
    if (report) {
        const payload = prepareStarTogglePayload(report, !report.isStarred);
        updateStarStatus(payload);
    }
  };

  const handleSetReports = (reports) => {
    dispatch({ type: Actions.ACTIONS.SET_REPORTS, payload: reports });
  };

  const handleReorderReports = (activeId, overId) => {
    dispatch({
      type: Actions.ACTIONS.REORDER_REPORTS,
      payload: { activeId, overId }
    });
  };

  const value = {
    ...state,
    categories: displayCategories,
    filteredReports,
    tabCounts,
    isLoading: isLoading || isUpdatingStar,
    error,
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