/**
 * @fileoverview Tests for ReportsEmptyState component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ReportsEmptyState from '../ReportsEmptyState';

describe('ReportsEmptyState', () => {
  it('renders no-results empty state with correct icon and text', () => {
    render(<ReportsEmptyState type="no-results" />);
    
    expect(screen.getByText('No reports found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search terms or filters')).toBeInTheDocument();
  });

  it('renders no-favorites empty state with heart icon', () => {
    render(<ReportsEmptyState type="no-favorites" />);
    
    expect(screen.getByText('No favorite reports yet')).toBeInTheDocument();
    expect(screen.getByText('Start favoriting reports to see them here')).toBeInTheDocument();
  });

  it('renders filtered empty state with search icon', () => {
    render(<ReportsEmptyState type="filtered" />);
    
    expect(screen.getByText('No reports match your filters')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search criteria')).toBeInTheDocument();
  });

  it('renders no-reports empty state with file text icon', () => {
    render(<ReportsEmptyState type="no-reports" />);
    
    expect(screen.getByText('No reports available')).toBeInTheDocument();
    expect(screen.getByText('Check back later for new reports')).toBeInTheDocument();
  });
});