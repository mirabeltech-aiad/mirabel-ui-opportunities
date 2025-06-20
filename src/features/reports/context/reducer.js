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

    case ACTIONS.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload
      };

    case ACTIONS.REORDER_REPORTS: {
      const { activeId, overId } = action.payload;
      if (activeId === overId) return state;

      const reports = [...state.reports];
      const activeIndex = reports.findIndex(r => r.id === activeId);
      const overIndex = reports.findIndex(r => r.id === overId);

      if (activeIndex === -1 || overIndex === -1) return state;
      
      // Move item in array
      const [movedItem] = reports.splice(activeIndex, 1);
      reports.splice(overIndex, 0, movedItem);

      // Update sortOrder
      const reorderedReports = reports.map((report, index) => ({
        ...report,
        sortOrder: index + 1
      }));

      return {
        ...state,
        reports: reorderedReports
      };
    }

    default:
      return state;
  }
};
