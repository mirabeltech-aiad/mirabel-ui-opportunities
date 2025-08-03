/**
 * @fileoverview Tests for Reports action creators
 */

import { describe, it, expect } from 'vitest';
import {
  setLoading,
  setReports,
  setFilteredReports,
  setSearchQuery,
  setActiveCategory,
  toggleFavorite,
  setError,
  clearError,
  setPagination,
  setCurrentPage
} from '../actions';
import { ReportsActionType } from '../types';

describe('Reports Action Creators', () => {
  it('creates SET_LOADING action', () => {
    const action = setLoading(true);
    
    expect(action).toEqual({
      type: ReportsActionType.SET_LOADING,
      payload: true
    });
  });

  it('creates SET_REPORTS action', () => {
    const reports = [{ 
      id: '1', 
      title: 'Test Report', 
      category: 'Analytics',
      description: 'Test description',
      keywords: ['test'],
      color: 'blue',
      iconColor: 'blue'
    }];
    const action = setReports(reports);
    
    expect(action).toEqual({
      type: ReportsActionType.SET_REPORTS,
      payload: reports
    });
  });

  it('creates SET_FILTERED_REPORTS action', () => {
    const reports = [{ 
      id: '1', 
      title: 'Filtered Report', 
      category: 'Performance',
      description: 'Test description',
      keywords: ['test'],
      color: 'blue',
      iconColor: 'blue'
    }];
    const action = setFilteredReports(reports);
    
    expect(action).toEqual({
      type: ReportsActionType.SET_FILTERED_REPORTS,
      payload: reports
    });
  });

  it('creates SET_SEARCH_QUERY action', () => {
    const query = 'test search';
    const action = setSearchQuery(query);
    
    expect(action).toEqual({
      type: ReportsActionType.SET_SEARCH_QUERY,
      payload: query
    });
  });

  it('creates SET_ACTIVE_CATEGORY action', () => {
    const category = 'Analytics';
    const action = setActiveCategory(category);
    
    expect(action).toEqual({
      type: ReportsActionType.SET_ACTIVE_CATEGORY,
      payload: category
    });
  });

  it('creates TOGGLE_FAVORITE action', () => {
    const reportId = 'report-123';
    const action = toggleFavorite(reportId);
    
    expect(action).toEqual({
      type: ReportsActionType.TOGGLE_FAVORITE,
      payload: reportId
    });
  });

  it('creates SET_ERROR action', () => {
    const error = 'Test error';
    const action = setError(error);
    
    expect(action).toEqual({
      type: ReportsActionType.SET_ERROR,
      payload: error
    });
  });

  it('creates CLEAR_ERROR action', () => {
    const action = clearError();
    
    expect(action).toEqual({
      type: ReportsActionType.CLEAR_ERROR,
      payload: undefined
    });
  });

  it('creates SET_PAGINATION action', () => {
    const pagination = { page: 2, limit: 10, total: 50, hasNext: true, hasPrevious: true };
    const action = setPagination(pagination);
    
    expect(action).toEqual({
      type: ReportsActionType.SET_PAGINATION,
      payload: pagination
    });
  });

  it('creates SET_CURRENT_PAGE action', () => {
    const page = 3;
    const action = setCurrentPage(page);
    
    expect(action).toEqual({
      type: ReportsActionType.SET_CURRENT_PAGE,
      payload: page
    });
  });
});