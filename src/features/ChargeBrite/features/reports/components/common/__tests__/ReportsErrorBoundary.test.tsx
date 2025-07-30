/**
 * @fileoverview Tests for ReportsErrorBoundary component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import ReportsErrorBoundary from '../ReportsErrorBoundary';

// Mock console.error to avoid noise in tests
const originalError = console.error;
beforeAll(() => {
  console.error = vi.fn();
});

afterAll(() => {
  console.error = originalError;
});

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ReportsErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ReportsErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ReportsErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders error UI when there is an error', () => {
    render(
      <ReportsErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ReportsErrorBoundary>
    );

    expect(screen.getByText('Something went wrong with the reports')).toBeInTheDocument();
    expect(screen.getByText('Try refreshing the page or contact support if the problem persists.')).toBeInTheDocument();
  });

  it('renders retry button when error occurs', () => {
    render(
      <ReportsErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ReportsErrorBoundary>
    );

    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });
});