/**
 * @fileoverview Context types for Reports feature
 * 
 * Defines TypeScript interfaces for state management in the reports feature.
 * Includes state shape, action types, and context interfaces.
 */

import type React from 'react';
import type { Report, PaginationState } from '../types';

/**
 * Main state interface for the Reports feature
 */
export interface ReportsState {
  // Search and filtering
  searchQuery: string;
  activeCategory: string;
  favoriteReports: Set<string>;
  
  // Data state
  reports: Report[];
  filteredReports: Report[];
  reportsByCategory: Record<string, Report[]>;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Pagination
  pagination: PaginationState;
  
  // Metadata
  categories: string[];
  categoryReportCounts: Record<string, number>;
  lastUpdated: Date | null;
}

/**
 * Action types for the Reports reducer
 */
export enum ReportsActionType {
  // Data actions
  SET_REPORTS = 'SET_REPORTS',
  SET_FILTERED_REPORTS = 'SET_FILTERED_REPORTS',
  SET_REPORTS_BY_CATEGORY = 'SET_REPORTS_BY_CATEGORY',
  
  // Search and filter actions
  SET_SEARCH_QUERY = 'SET_SEARCH_QUERY',
  SET_ACTIVE_CATEGORY = 'SET_ACTIVE_CATEGORY',
  TOGGLE_FAVORITE = 'TOGGLE_FAVORITE',
  
  // UI actions
  SET_LOADING = 'SET_LOADING',
  SET_ERROR = 'SET_ERROR',
  CLEAR_ERROR = 'CLEAR_ERROR',
  
  // Pagination actions
  SET_PAGINATION = 'SET_PAGINATION',
  SET_CURRENT_PAGE = 'SET_CURRENT_PAGE',
  
  // Metadata actions
  SET_CATEGORIES = 'SET_CATEGORIES',
  SET_CATEGORY_COUNTS = 'SET_CATEGORY_COUNTS',
  SET_LAST_UPDATED = 'SET_LAST_UPDATED'
}

/**
 * Action interfaces for type safety
 */
export interface SetReportsAction {
  type: ReportsActionType.SET_REPORTS;
  payload: Report[];
}

export interface SetFilteredReportsAction {
  type: ReportsActionType.SET_FILTERED_REPORTS;
  payload: Report[];
}

export interface SetReportsByCategoryAction {
  type: ReportsActionType.SET_REPORTS_BY_CATEGORY;
  payload: Record<string, Report[]>;
}

export interface SetSearchQueryAction {
  type: ReportsActionType.SET_SEARCH_QUERY;
  payload: string;
}

export interface SetActiveCategoryAction {
  type: ReportsActionType.SET_ACTIVE_CATEGORY;
  payload: string;
}

export interface ToggleFavoriteAction {
  type: ReportsActionType.TOGGLE_FAVORITE;
  payload: string;
}

export interface SetLoadingAction {
  type: ReportsActionType.SET_LOADING;
  payload: boolean;
}

export interface SetErrorAction {
  type: ReportsActionType.SET_ERROR;
  payload: string | null;
}

export interface ClearErrorAction {
  type: ReportsActionType.CLEAR_ERROR;
}

export interface SetPaginationAction {
  type: ReportsActionType.SET_PAGINATION;
  payload: Partial<PaginationState>;
}

export interface SetCurrentPageAction {
  type: ReportsActionType.SET_CURRENT_PAGE;
  payload: number;
}

export interface SetCategoriesAction {
  type: ReportsActionType.SET_CATEGORIES;
  payload: string[];
}

export interface SetCategoryCountsAction {
  type: ReportsActionType.SET_CATEGORY_COUNTS;
  payload: Record<string, number>;
}

export interface SetLastUpdatedAction {
  type: ReportsActionType.SET_LAST_UPDATED;
  payload: Date;
}

/**
 * Union type for all possible actions
 */
export type ReportsAction =
  | SetReportsAction
  | SetFilteredReportsAction
  | SetReportsByCategoryAction
  | SetSearchQueryAction
  | SetActiveCategoryAction
  | ToggleFavoriteAction
  | SetLoadingAction
  | SetErrorAction
  | ClearErrorAction
  | SetPaginationAction
  | SetCurrentPageAction
  | SetCategoriesAction
  | SetCategoryCountsAction
  | SetLastUpdatedAction;

/**
 * Context value interface
 */
export interface ReportsContextValue {
  state: ReportsState;
  dispatch: React.Dispatch<ReportsAction>;
  
  // Computed values
  favoriteReportsData: Report[];
  displayedReports: Report[];
  
  // Action creators (convenience methods)
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: string) => void;
  toggleFavorite: (reportId: string) => void;
  setCurrentPage: (page: number) => void;
  refreshReports: () => Promise<void>;
}