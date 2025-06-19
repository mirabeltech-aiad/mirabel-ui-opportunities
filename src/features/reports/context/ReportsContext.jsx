import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { reportsReducer } from './reducer.js';
import { initialState } from './initialState.js';
import { reportsData } from '../helpers/reportsData.js';
import { useReportsDashboard, useUpdateReportStar, prepareStarTogglePayload } from '../hooks/useService.js';
import * as Actions from './actions.js';

/**
 * Context for managing reports state
 */
const ReportsContext = createContext();

/**
 * Provider component for reports context
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const ReportsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reportsReducer, initialState);
  const { data, isLoading, error } = useReportsDashboard();
  const { mutate: updateStarStatus, isPending: isUpdatingStar } = useUpdateReportStar();

  // Load initial reports data
  useEffect(() => {
    // Initialize with static data first
    dispatch({ 
      type: Actions.ACTIONS.SET_REPORTS, 
      payload: reportsData.reports 
    });
  }, []);

  // Update reports when API data is available
  useEffect(() => {
    if (data && !isLoading && !error) {
      console.log('Reports API data:', data);
      
      // Process the data and merge with existing reports if needed
      if (Array.isArray(data)) {
        dispatch({ 
          type: Actions.ACTIONS.SET_REPORTS, 
          payload: data 
        });
      }
    }
  }, [data, isLoading, error]);

  // Update loading state
  useEffect(() => {
    dispatch({ 
      type: Actions.ACTIONS.SET_LOADING, 
      payload: isLoading 
    });
  }, [isLoading]);

  // Update error state
  useEffect(() => {
    if (error) {
      dispatch({ 
        type: Actions.ACTIONS.SET_ERROR, 
        payload: error.message 
      });
    }
  }, [error]);

  // Calculate tab counts
  const tabCounts = useMemo(() => {
    const counts = {};
    if (!state.reports) return counts;

    // Calculate counts for each category
    const categories = ['All', 'Favorites', 'Revenue Reports', 'Subscribers', 'Subscriber Reports', 'Performance Reports'];
    
    categories.forEach(category => {
      if (category === 'Favorites') {
        counts[category] = state.reports.filter(report => report.isStarred).length;
      } else if (category === 'All') {
        counts[category] = state.reports.length;
      } else {
        counts[category] = state.reports.filter(report => report.category.includes(category)).length;
      }
    });
    
    return counts;
  }, [state.reports]);

  // Calculate filtered reports
  const filteredReports = useMemo(() => {
    let filtered = state.reports || [];

    // Filter by active tab
    if (state.activeTab === 'Favorites') {
      filtered = filtered.filter(report => report.isStarred);
    } else if (state.activeTab !== 'All') {
      filtered = filtered.filter(report => report.category.includes(state.activeTab));
    }

    // Filter by search query
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(report => 
        report.title.toLowerCase().includes(query) ||
        report.description.toLowerCase().includes(query) ||
        report.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [state.reports, state.activeTab, state.searchQuery]);

  // Handle set active tab
  const handleSetActiveTab = (tab) => {
    dispatch(Actions.setActiveTab(tab));
  };

  // Handle set search query
  const handleSetSearchQuery = (query) => {
    dispatch(Actions.setSearchQuery(query));
  };

  // Handle toggle star with API call
  const handleToggleStar = (reportId) => {
    // Find the report to get its current state
    const report = state.reports.find(r => r.id === reportId);
    if (!report) return;

    // Optimistically update the UI first
    dispatch(Actions.toggleStar(reportId));

    // Prepare the payload for API call
    const newStarStatus = !report.isStarred;
    const payload = prepareStarTogglePayload(report, newStarStatus);

    // Make API call
    updateStarStatus(payload, {
      onError: (error) => {
        // Revert the optimistic update if API call fails
        console.error('Failed to update star status:', error);
        dispatch(Actions.toggleStar(reportId)); // Toggle back to original state
      }
    });
  };

  // Handle set reports
  const handleSetReports = (reports) => {
    dispatch(Actions.setReports(reports));
  };

  const value = {
    // State
    reports: state.reports,
    filteredReports,
    activeTab: state.activeTab,
    searchQuery: state.searchQuery,
    loading: state.loading,
    error: state.error,
    tabCounts,
    isUpdatingStar,
    
    // Actions
    setActiveTab: handleSetActiveTab,
    setSearchQuery: handleSetSearchQuery,
    toggleStar: handleToggleStar,
    setReports: handleSetReports
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

/**
 * Hook to use reports context
 * @returns {Object} Context value with state and actions
 */
export const useReportsContext = () => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReportsContext must be used within a ReportsProvider');
  }
  return context;
};
