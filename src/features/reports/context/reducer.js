
/**
 * Reducer for reports context
 */
import { ACTIONS } from './actions.js';

export const reportsReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_REPORTS:
      return {
        ...state,
        reports: action.payload
      };

    case ACTIONS.SET_FILTERED_REPORTS:
      return {
        ...state,
        filteredReports: action.payload
      };

    case ACTIONS.SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.payload
      };

    case ACTIONS.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload
      };

    case ACTIONS.TOGGLE_STAR:
      return {
        ...state,
        reports: state.reports.map(report =>
          report.id === action.payload
            ? { ...report, isStarred: !report.isStarred }
            : report
        )
      };

    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    default:
      return state;
  }
};
