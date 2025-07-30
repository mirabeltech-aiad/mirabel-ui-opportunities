/**
 * @fileoverview Initial state definition for Reports feature
 * 
 * Defines the default state values for the reports feature context.
 * Ensures type safety and provides sensible defaults for all state properties.
 */

import type { ReportsState } from './types';

/**
 * Default initial state for the Reports feature
 */
export const initialState: ReportsState = {
  // Search and filtering
  searchQuery: '',
  activeCategory: 'All',
  favoriteReports: new Set<string>(),
  
  // Data state
  reports: [],
  filteredReports: [],
  reportsByCategory: {},
  
  // UI state
  isLoading: false,
  error: null,
  
  // Pagination
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    hasNext: false,
    hasPrevious: false
  },
  
  // Metadata
  categories: [],
  categoryReportCounts: {},
  lastUpdated: null
};