
import { useMemo } from 'react';
import { useReportsContext } from '../context/index.js';
import { setActiveTab, setSearchQuery, toggleStar, setReports } from '../context/actions.js';

/**
 * Custom hook for managing reports data and interactions
 * @returns {Object} Reports state and methods
 */
export const useReports = () => {
  const { state, dispatch } = useReportsContext();

  /**
   * Set the active tab filter
   * @param {string} tab - Tab name to set as active
   */
  const handleSetActiveTab = (tab) => {
    dispatch(setActiveTab(tab));
  };

  /**
   * Set the search query
   * @param {string} query - Search query string
   */
  const handleSetSearchQuery = (query) => {
    dispatch(setSearchQuery(query));
  };

  /**
   * Toggle star status of a report
   * @param {number} reportId - ID of report to toggle
   */
  const handleToggleStar = (reportId) => {
    dispatch(toggleStar(reportId));
  };

  /**
   * Set reports data
   * @param {Array} reports - Array of report objects
   */
  const handleSetReports = (reports) => {
    dispatch(setReports(reports));
  };

  /**
   * Get tab counts for all categories
   * @returns {Object} Object with tab names as keys and counts as values
   */
  const getTabCounts = useMemo(() => {
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

  /**
   * Get filtered reports based on active tab and search query
   * @returns {Array} Filtered array of reports
   */
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

  return {
    reports: state.reports,
    filteredReports,
    activeTab: state.activeTab,
    searchQuery: state.searchQuery,
    loading: state.loading,
    error: state.error,
    tabCounts: getTabCounts,
    setActiveTab: handleSetActiveTab,
    setSearchQuery: handleSetSearchQuery,
    toggleStar: handleToggleStar,
    setReports: handleSetReports
  };
};
