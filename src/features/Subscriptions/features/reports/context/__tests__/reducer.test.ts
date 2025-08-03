/**
 * @fileoverview Tests for Reports reducer
 */

import { describe, it, expect } from 'vitest';
import { reportsReducer } from '../reducer';
import { initialState } from '../initialState';
import { ReportsActionType } from '../types';
import type { ReportsAction } from '../types';

describe('reportsReducer', () => {
  it('handles SET_LOADING action', () => {
    const action: ReportsAction = {
      type: ReportsActionType.SET_LOADING,
      payload: true
    };

    const newState = reportsReducer(initialState, action);

    expect(newState.isLoading).toBe(true);
    expect(newState).not.toBe(initialState); // Immutability check
  });

  it('handles SET_REPORTS action', () => {
    const mockReports = [
      { 
        id: '1', 
        title: 'Test Report 1', 
        category: 'Analytics',
        description: 'Test description',
        keywords: ['test'],
        color: 'blue',
        iconColor: 'blue'
      },
      { 
        id: '2', 
        title: 'Test Report 2', 
        category: 'Performance',
        description: 'Test description',
        keywords: ['test'],
        color: 'green',
        iconColor: 'green'
      }
    ];

    const action: ReportsAction = {
      type: ReportsActionType.SET_REPORTS,
      payload: mockReports
    };

    const newState = reportsReducer(initialState, action);

    expect(newState.reports).toEqual(mockReports);
    expect(newState.lastUpdated).toBeInstanceOf(Date);
  });

  it('handles SET_SEARCH_QUERY action and resets pagination', () => {
    const stateWithPage = {
      ...initialState,
      pagination: { ...initialState.pagination, page: 3 }
    };

    const action: ReportsAction = {
      type: ReportsActionType.SET_SEARCH_QUERY,
      payload: 'test query'
    };

    const newState = reportsReducer(stateWithPage, action);

    expect(newState.searchQuery).toBe('test query');
    expect(newState.pagination.page).toBe(1);
  });

  it('handles SET_ACTIVE_CATEGORY action and resets pagination', () => {
    const stateWithPage = {
      ...initialState,
      pagination: { ...initialState.pagination, page: 3 }
    };

    const action: ReportsAction = {
      type: ReportsActionType.SET_ACTIVE_CATEGORY,
      payload: 'Analytics'
    };

    const newState = reportsReducer(stateWithPage, action);

    expect(newState.activeCategory).toBe('Analytics');
    expect(newState.pagination.page).toBe(1);
  });

  it('handles TOGGLE_FAVORITE action', () => {
    const action: ReportsAction = {
      type: ReportsActionType.TOGGLE_FAVORITE,
      payload: 'report-1'
    };

    // Add to favorites
    const newState1 = reportsReducer(initialState, action);
    expect(newState1.favoriteReports.has('report-1')).toBe(true);

    // Remove from favorites
    const newState2 = reportsReducer(newState1, action);
    expect(newState2.favoriteReports.has('report-1')).toBe(false);
  });

  it('handles SET_ERROR action', () => {
    const error = 'Test error';
    const loadingState = { ...initialState, isLoading: true };

    const action: ReportsAction = {
      type: ReportsActionType.SET_ERROR,
      payload: error
    };

    const newState = reportsReducer(loadingState, action);

    expect(newState.error).toBe(error);
    expect(newState.isLoading).toBe(false);
  });

  it('returns original state for unknown action type', () => {
    const unknownAction = {
      type: 'UNKNOWN_ACTION' as any,
      payload: 'test'
    };

    const newState = reportsReducer(initialState, unknownAction);

    expect(newState).toBe(initialState);
  });
});