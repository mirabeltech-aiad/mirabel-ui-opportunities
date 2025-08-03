/**
 * @fileoverview Action creators for Reports feature
 * 
 * Provides typed action creator functions for the reports reducer.
 * Ensures type safety and consistent action structure.
 */

import type { Report, PaginationState } from '../types';
import { ReportsActionType } from './types';
import type {
  SetReportsAction,
  SetFilteredReportsAction,
  SetReportsByCategoryAction,
  SetSearchQueryAction,
  SetActiveCategoryAction,
  ToggleFavoriteAction,
  SetLoadingAction,
  SetErrorAction,
  ClearErrorAction,
  SetPaginationAction,
  SetCurrentPageAction,
  SetCategoriesAction,
  SetCategoryCountsAction,
  SetLastUpdatedAction
} from './types';

/**
 * Data action creators
 */
export const setReports = (reports: Report[]): SetReportsAction => ({
  type: ReportsActionType.SET_REPORTS,
  payload: reports
});

export const setFilteredReports = (reports: Report[]): SetFilteredReportsAction => ({
  type: ReportsActionType.SET_FILTERED_REPORTS,
  payload: reports
});

export const setReportsByCategory = (reportsByCategory: Record<string, Report[]>): SetReportsByCategoryAction => ({
  type: ReportsActionType.SET_REPORTS_BY_CATEGORY,
  payload: reportsByCategory
});

/**
 * Search and filter action creators
 */
export const setSearchQuery = (query: string): SetSearchQueryAction => ({
  type: ReportsActionType.SET_SEARCH_QUERY,
  payload: query
});

export const setActiveCategory = (category: string): SetActiveCategoryAction => ({
  type: ReportsActionType.SET_ACTIVE_CATEGORY,
  payload: category
});

export const toggleFavorite = (reportId: string): ToggleFavoriteAction => ({
  type: ReportsActionType.TOGGLE_FAVORITE,
  payload: reportId
});

/**
 * UI state action creators
 */
export const setLoading = (isLoading: boolean): SetLoadingAction => ({
  type: ReportsActionType.SET_LOADING,
  payload: isLoading
});

export const setError = (error: string | null): SetErrorAction => ({
  type: ReportsActionType.SET_ERROR,
  payload: error
});

export const clearError = (): ClearErrorAction => ({
  type: ReportsActionType.CLEAR_ERROR
});

/**
 * Pagination action creators
 */
export const setPagination = (pagination: Partial<PaginationState>): SetPaginationAction => ({
  type: ReportsActionType.SET_PAGINATION,
  payload: pagination
});

export const setCurrentPage = (page: number): SetCurrentPageAction => ({
  type: ReportsActionType.SET_CURRENT_PAGE,
  payload: page
});

/**
 * Metadata action creators
 */
export const setCategories = (categories: string[]): SetCategoriesAction => ({
  type: ReportsActionType.SET_CATEGORIES,
  payload: categories
});

export const setCategoryReportCounts = (counts: Record<string, number>): SetCategoryCountsAction => ({
  type: ReportsActionType.SET_CATEGORY_COUNTS,
  payload: counts
});

export const setLastUpdated = (date: Date): SetLastUpdatedAction => ({
  type: ReportsActionType.SET_LAST_UPDATED,
  payload: date
});