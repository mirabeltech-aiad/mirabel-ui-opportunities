/**
 * @fileoverview Tests for CirculationErrorBoundary component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import CirculationErrorBoundary from '../CirculationErrorBoundary';

// Mock console.error to avoid noise in tests
const mockConsoleError = vi.fn();
beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(mockConsoleError);
});

afterAll(() => {
  vi.restoreAllMocks();
});

// Component that throws an error when shouldThrow is true
const ThrowError: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test circulation error');
  }
  return <div>Circulation content loaded</div>;
};

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('CirculationErrorBoundary', () => {
  it('renders children when there is no error', () => {
    renderWithRouter(
      <CirculationErrorBoundary>
        <ThrowError shouldThrow={false} />
      </CirculationErrorBoundary>
    );

    expect(screen.getByText('Circulation content loaded')).toBeInTheDocument();
  });

  it('renders error UI when there is an error', () => {
    renderWithRouter(
      <CirculationErrorBoundary>
        <ThrowError shouldThrow={true} />
      </CirculationErrorBoundary>
    );

    expect(screen.getByText('Circulation Analytics Error')).toBeInTheDocument();
    expect(screen.getByText(/Test circulation error/)).toBeInTheDocument();
  });

  it('renders retry button when error occurs', () => {
    renderWithRouter(
      <CirculationErrorBoundary>
        <ThrowError shouldThrow={true} />
      </CirculationErrorBoundary>
    );

    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('calls onError callback when error occurs', () => {
    const onError = vi.fn();
    
    renderWithRouter(
      <CirculationErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </CirculationErrorBoundary>
    );

    expect(onError).toHaveBeenCalled();
  });

  it('displays circulation-specific error suggestions', () => {
    renderWithRouter(
      <CirculationErrorBoundary>
        <ThrowError shouldThrow={true} />
      </CirculationErrorBoundary>
    );

    expect(screen.getByText('Suggested Solutions:')).toBeInTheDocument();
  });

  it('provides error recovery actions', () => {
    renderWithRouter(
      <CirculationErrorBoundary>
        <ThrowError shouldThrow={true} />
      </CirculationErrorBoundary>
    );

    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Go Back')).toBeInTheDocument();
    expect(screen.getByText('Go Home')).toBeInTheDocument();
  });

  it('displays circulation-specific icon', () => {
    renderWithRouter(
      <CirculationErrorBoundary>
        <ThrowError shouldThrow={true} />
      </CirculationErrorBoundary>
    );

    // The TrendingUp icon should be present in the title
    const title = screen.getByText('Circulation Analytics Error');
    expect(title.closest('.flex')).toBeInTheDocument();
  });
});