/**
 * @fileoverview Tests for CirculationDashboard component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CirculationDashboard from '../dashboard/CirculationDashboard';

// Mock the dependencies
vi.mock('@/contexts/ProductFilterContext', () => ({
  useProductFilter: () => ({
    selectedProducts: ['product1'],
    selectedBusinessUnits: ['unit1'],
    setSelectedProducts: vi.fn(),
    setSelectedBusinessUnits: vi.fn()
  })
}));

vi.mock('@/hooks/useCirculationDataOrchestrator', () => ({
  useCirculationDataOrchestrator: () => ({
    metrics: { data: null, isLoading: true },
    revenue: { data: null, isLoading: true },
    growth: { data: null, isLoading: true },
    retention: { data: null, isLoading: true },
    churn: { data: null, isLoading: true },
    geographic: { data: null, isLoading: true },
    isInitialLoading: true,
    isCriticalDataReady: false,
    isImportantDataReady: false,
    loadingStage: 'initial',
    overallProgress: 0,
    canShowOverview: false,
    canShowCharts: false,
    canShowDetails: false
  })
}));

vi.mock('@/components/ProductFilter', () => ({
  ProductFilter: () => <div data-testid="product-filter">Product Filter</div>
}));

vi.mock('../analytics/CirculationOverview', () => ({
  default: () => <div data-testid="circulation-overview">Circulation Overview</div>
}));

describe('CirculationDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dashboard title and description', () => {
    render(<CirculationDashboard />);
    
    expect(screen.getByText('Circulation Dashboard')).toBeInTheDocument();
    expect(screen.getByText(/Real-time circulation metrics and subscriber insights/)).toBeInTheDocument();
  });

  it('renders product filter component', () => {
    render(<CirculationDashboard />);
    
    expect(screen.getByTestId('product-filter')).toBeInTheDocument();
  });

  it('renders circulation overview component', () => {
    render(<CirculationDashboard />);
    
    expect(screen.getByTestId('circulation-overview')).toBeInTheDocument();
  });

  it('applies correct layout structure', () => {
    const { container } = render(<CirculationDashboard />);
    
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('space-y-6');
  });

  it('renders header section with proper styling', () => {
    render(<CirculationDashboard />);
    
    const title = screen.getByText('Circulation Dashboard');
    expect(title).toHaveClass('text-3xl', 'font-bold', 'text-ocean-800');
  });

  it('shows loading state appropriately', () => {
    render(<CirculationDashboard />);
    
    // Should render the main structure even when loading
    expect(screen.getByText('Circulation Dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('circulation-overview')).toBeInTheDocument();
  });

  it('maintains consistent spacing between sections', () => {
    const { container } = render(<CirculationDashboard />);
    
    const sections = container.querySelectorAll('.space-y-6 > *');
    expect(sections.length).toBeGreaterThan(0);
  });
});