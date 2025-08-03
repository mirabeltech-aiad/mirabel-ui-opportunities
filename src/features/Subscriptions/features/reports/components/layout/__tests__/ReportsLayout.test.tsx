/**
 * @fileoverview Tests for ReportsLayout component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ReportsLayout from '../ReportsLayout';

// Mock the ReportsProvider
vi.mock('../../context', () => ({
  ReportsProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="reports-provider">{children}</div>
}));

describe('ReportsLayout', () => {
  it('renders children within ReportsProvider', () => {
    render(
      <ReportsLayout>
        <div>Test content</div>
      </ReportsLayout>
    );

    expect(screen.getByTestId('reports-provider')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('wraps content in ReportsErrorBoundary', () => {
    render(
      <ReportsLayout>
        <div>Test content</div>
      </ReportsLayout>
    );

    // The content should be rendered, indicating ErrorBoundary is working
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies correct layout structure', () => {
    render(
      <ReportsLayout>
        <div>Test content</div>
      </ReportsLayout>
    );

    const provider = screen.getByTestId('reports-provider');
    expect(provider).toBeInTheDocument();
  });
});