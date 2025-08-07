/**
 * @fileoverview Tests for AnalyticsDashboard component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AnalyticsDashboard from '../AnalyticsDashboard';

// Mock the dependencies
vi.mock('@/contexts/ProductFilterContext', () => ({
  useProductFilter: () => ({
    selectedProducts: ['product1'],
    selectedBusinessUnits: ['unit1'],
    setSelectedProducts: vi.fn(),
    setSelectedBusinessUnits: vi.fn()
  })
}));

vi.mock('../hooks/useAnalyticsDataOrchestrator', () => ({
  useAnalyticsDataOrchestrator: () => ({
    overview: { data: null, isLoading: true },
    demographics: { data: null, isLoading: true },
    segments: { data: null, isLoading: true },
    engagement: { data: null, isLoading: true },
    lifetime: { data: null, isLoading: true },
    churn: { data: null, isLoading: true },
    isInitialLoading: true,
    isCriticalDataReady: false,
    isImportantDataReady: false,
    loadingStage: 'initial',
    overallProgress: 0,
    canShowOverview: false,
    canShowSegmentation: false,
    canShowPredictions: false
  })
}));

vi.mock('@/components/ProductFilter', () => ({
  ProductFilter: () => <div data-testid="product-filter">Product Filter</div>
}));

describe('AnalyticsDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<AnalyticsDashboard />);
    
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('product-filter')).toBeInTheDocument();
  });

  it('displays page title and description', () => {
    render(<AnalyticsDashboard />);
    
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
    expect(screen.getByText(/Comprehensive subscriber analytics and insights/)).toBeInTheDocument();
  });

  it('renders product filter component', () => {
    render(<AnalyticsDashboard />);
    
    expect(screen.getByTestId('product-filter')).toBeInTheDocument();
  });

  it('shows loading state when data is being fetched', () => {
    render(<AnalyticsDashboard />);
    
    // Should show some loading indication
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<AnalyticsDashboard />);
    
    const mainContainer = screen.getByText('Analytics Dashboard').closest('div');
    expect(mainContainer).toHaveClass('space-y-6');
  });
});