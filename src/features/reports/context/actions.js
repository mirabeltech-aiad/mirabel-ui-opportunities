/**
 * Action types for reports context
 */
export const ACTIONS = {
  SET_REPORTS: 'SET_REPORTS',
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  TOGGLE_REPORT_STAR: 'TOGGLE_REPORT_STAR',
  SET_CATEGORIES: 'SET_CATEGORIES',
  REORDER_REPORTS: 'REORDER_REPORTS'
};

/**
 * Action creators
 */
export const setReports = (reports) => ({
  type: ACTIONS.SET_REPORTS,
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

export const toggleReportStar = (reportId, isStarred) => ({
  type: ACTIONS.TOGGLE_REPORT_STAR,
  payload: { reportId, isStarred }
});

export const setCategories = (categories) => ({
  type: ACTIONS.SET_CATEGORIES,
  payload: categories
});

export const reorderReports = (activeId, overId) => ({
  type: ACTIONS.REORDER_REPORTS,
  payload: { activeId, overId }
});
