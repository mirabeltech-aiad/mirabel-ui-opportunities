
/**
 * Action types for reports context
 */
export const ACTIONS = {
  SET_REPORTS: 'SET_REPORTS',
  SET_FILTERED_REPORTS: 'SET_FILTERED_REPORTS',
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  TOGGLE_STAR: 'TOGGLE_STAR',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

/**
 * Action creators
 */
export const setReports = (reports) => ({
  type: ACTIONS.SET_REPORTS,
  payload: reports
});

export const setFilteredReports = (reports) => ({
  type: ACTIONS.SET_FILTERED_REPORTS,
  payload: reports
});

export const setActiveTab = (tab) => ({
  type: ACTIONS.SET_ACTIVE_TAB,
  payload: tab
});

export const setSearchQuery = (query) => ({
  type: ACTIONS.SET_SEARCH_QUERY,
  payload: query
});

export const toggleStar = (reportId) => ({
  type: ACTIONS.TOGGLE_STAR,
  payload: reportId
});

export const setLoading = (loading) => ({
  type: ACTIONS.SET_LOADING,
  payload: loading
});

export const setError = (error) => ({
  type: ACTIONS.SET_ERROR,
  payload: error
});
