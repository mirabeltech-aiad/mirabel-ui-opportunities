/**
 * @fileoverview Tests for Reports Context
 */

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ReportsProvider, useReportsContext } from '../Context';
import { ReportsActionType } from '../types';

// Test component to access context
const TestComponent = () => {
  const { state, dispatch } = useReportsContext();
  
  return (
    <div>
      <div data-testid="loading">{state.isLoading ? 'loading' : 'not loading'}</div>
      <div data-testid="reports-count">{state.reports.length}</div>
      <button 
        onClick={() => dispatch({ type: ReportsActionType.SET_LOADING, payload: true })}
        data-testid="set-loading"
      >
        Set Loading
      </button>
    </div>
  );
};

describe('Reports Context', () => {
  it('provides initial state', () => {
    render(
      <ReportsProvider>
        <TestComponent />
      </ReportsProvider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('not loading');
    expect(screen.getByTestId('reports-count')).toHaveTextContent('0');
  });

  it('updates state when dispatching actions', () => {
    render(
      <ReportsProvider>
        <TestComponent />
      </ReportsProvider>
    );

    const setLoadingButton = screen.getByTestId('set-loading');
    
    act(() => {
      setLoadingButton.click();
    });

    expect(screen.getByTestId('loading')).toHaveTextContent('loading');
  });

  it('throws error when used outside provider', () => {
    // Mock console.error to avoid noise in test output
    const originalError = console.error;
    console.error = vi.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useReportsContext must be used within a ReportsProvider');

    console.error = originalError;
  });
});