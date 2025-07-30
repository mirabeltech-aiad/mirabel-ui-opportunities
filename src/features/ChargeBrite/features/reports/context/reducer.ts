/**
 * @fileoverview State reducer for Reports feature
 * 
 * Handles all state transitions for the reports feature using a reducer pattern.
 * Ensures immutable state updates and type safety.
 */

import type { ReportsState, ReportsAction } from './types';
import { ReportsActionType } from './types';

/**
 * Reports feature reducer
 * 
 * @param state - Current state
 * @param action - Action to process
 * @returns New state after applying the action
 */
export const reportsReducer = (state: ReportsState, action: ReportsAction): ReportsState => {
  switch (action.type) {
    // Data actions
    case ReportsActionType.SET_REPORTS:
      return {
        ...state,
        reports: action.payload,
        lastUpdated: new Date()
      };

    case ReportsActionType.SET_FILTERED_REPORTS:
      return {
        ...state,
        filteredReports: action.payload
      };

    case ReportsActionType.SET_REPORTS_BY_CATEGORY:
      return {
        ...state,
        reportsByCategory: action.payload
      };

    // Search and filter actions
    case ReportsActionType.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload,
        pagination: {
          ...state.pagination,
          page: 1 // Reset to first page when searching
        }
      };

    case ReportsActionType.SET_ACTIVE_CATEGORY:
      return {
        ...state,
        activeCategory: action.payload,
        pagination: {
          ...state.pagination,
          page: 1 // Reset to first page when changing category
        }
      };

    case ReportsActionType.TOGGLE_FAVORITE: {
      const newFavorites = new Set(state.favoriteReports);
      if (newFavorites.has(action.payload)) {
        newFavorites.delete(action.payload);
      } else {
        newFavorites.add(action.payload);
      }
      return {
        ...state,
        favoriteReports: newFavorites
      };
    }

    // UI state actions
    case ReportsActionType.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case ReportsActionType.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case ReportsActionType.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    // Pagination actions
    case ReportsActionType.SET_PAGINATION:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.payload
        }
      };

    case ReportsActionType.SET_CURRENT_PAGE:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          page: action.payload
        }
      };

    // Metadata actions
    case ReportsActionType.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload
      };

    case ReportsActionType.SET_CATEGORY_COUNTS:
      return {
        ...state,
        categoryReportCounts: action.payload
      };

    case ReportsActionType.SET_LAST_UPDATED:
      return {
        ...state,
        lastUpdated: action.payload
      };

    default:
      return state;
  }
};