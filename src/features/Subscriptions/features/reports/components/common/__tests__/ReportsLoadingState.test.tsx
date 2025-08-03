/**
 * @fileoverview Tests for ReportsLoadingState component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ReportsLoadingState from '../ReportsLoadingState';

describe('ReportsLoadingState', () => {
  it('renders loading spinner', () => {
    render(<ReportsLoadingState />);
    
    expect(screen.getByTestId('reports-loading-spinner')).toBeInTheDocument();
  });

  it('renders loading text', () => {
    render(<ReportsLoadingState />);
    
    expect(screen.getByText('Loading reports...')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<ReportsLoadingState />);
    
    const container = screen.getByTestId('reports-loading-container');
    expect(container).toHaveClass('flex', 'items-center', 'justify-center', 'p-12');
  });
});