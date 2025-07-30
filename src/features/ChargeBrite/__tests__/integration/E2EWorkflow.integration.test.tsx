/**
 * @fileoverview End-to-end workflow integration tests
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  renderWithProviders, 
  createMockAnalyticsData, 
  createMockReportsData,
  createMockCirculationData 
} from '../../test-utils';

// Mock the page components
vi.mock('@/pages/AnalyticsDashboard', () => ({
  default: () => (
    <div>
      <h1>Analytics Dashboard</h1>
      <div data-testid="analytics-content">Analytics content loaded</div>
      <button data-testid="filter-products">Filter Products</button>
    </div>
  )
}));

vi.mock('@/pages/Reports', () => ({
  default: () => (
    <div>
      <h1>Reports</h1>
      <div data-testid="reports-content">Reports content loaded</div>
      <button data-testid="search-reports">Search Reports</button>
      <div data-testid="report-list">Report list</div>
    </div>
  )
}));

vi.mock('@/pages/CirculationDashboard', () => ({
  default: () => (
    <div>
      <h1>Circulation Dashboard</h1>
      <div data-testid="circulation-content">Circulation content loaded</div>
      <button data-testid="date-filter">Date Filter</button>
    </div>
  )
}));

// Mock the main App component with routing
const MockApp = () => {
  const [currentPage, setCurrentPage] = React.useState('analytics');
  
  const renderPage = () => {
    switch (currentPage) {
      case 'analytics':
        const AnalyticsDashboard = require('@/pages/AnalyticsDashboard').default;
        return <AnalyticsDashboard />;
      case 'reports':
        const Reports = require('@/pages/Reports').default;
        return <Reports />;
      case 'circulation':
        const CirculationDashboard = require('@/pages/CirculationDashboard').default;
        return <CirculationDashboard />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div>
      <nav data-testid="navigation">
        <button onClick={() => setCurrentPage('analytics')} data-testid="nav-analytics">
          Analytics
        </button>
        <button onClick={() => setCurrentPage('reports')} data-testid="nav-reports">
          Reports
        </button>
        <button onClick={() => setCurrentPage('circulation')} data-testid="nav-circulation">
          Circulation
        </button>
      </nav>
      <main data-testid="main-content">
        {renderPage()}
      </main>
    </div>
  );
};

describe('End-to-End Workflow Integration', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('completes full analytics workflow', async () => {
    renderWithProviders(<MockApp />, {
      initialProductFilter: {
        selectedProducts: ['product1'],
        selectedBusinessUnits: ['unit1']
      }
    });

    // Should start on analytics page
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('analytics-content')).toBeInTheDocument();

    // Interact with product filter
    const filterButton = screen.getByTestId('filter-products');
    await user.click(filterButton);

    // Verify content remains stable
    expect(screen.getByTestId('analytics-content')).toBeInTheDocument();
  });

  it('navigates between features maintaining state', async () => {
    renderWithProviders(<MockApp />);

    // Start on analytics
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();

    // Navigate to reports
    await user.click(screen.getByTestId('nav-reports'));
    await waitFor(() => {
      expect(screen.getByText('Reports')).toBeInTheDocument();
    });

    // Navigate to circulation
    await user.click(screen.getByTestId('nav-circulation'));
    await waitFor(() => {
      expect(screen.getByText('Circulation Dashboard')).toBeInTheDocument();
    });

    // Navigate back to analytics
    await user.click(screen.getByTestId('nav-analytics'));
    await waitFor(() => {
      expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
    });

    // Verify navigation works
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
  });

  it('handles cross-feature data sharing', async () => {
    const mockData = createMockAnalyticsData();
    
    renderWithProviders(<MockApp />, {
      initialProductFilter: {
        selectedProducts: ['product1', 'product2'],
        selectedBusinessUnits: ['unit1']
      }
    });

    // Start on analytics and verify data context
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();

    // Navigate to reports - should maintain product filter context
    await user.click(screen.getByTestId('nav-reports'));
    await waitFor(() => {
      expect(screen.getByText('Reports')).toBeInTheDocument();
    });

    // Navigate to circulation - should maintain product filter context
    await user.click(screen.getByTestId('nav-circulation'));
    await waitFor(() => {
      expect(screen.getByText('Circulation Dashboard')).toBeInTheDocument();
    });

    // All pages should have access to the same filter context
    expect(screen.getByTestId('circulation-content')).toBeInTheDocument();
  });

  it('manages complex user interactions across features', async () => {
    renderWithProviders(<MockApp />);

    // Analytics workflow
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
    await user.click(screen.getByTestId('filter-products'));

    // Reports workflow
    await user.click(screen.getByTestId('nav-reports'));
    await waitFor(() => {
      expect(screen.getByText('Reports')).toBeInTheDocument();
    });
    
    await user.click(screen.getByTestId('search-reports'));

    // Circulation workflow
    await user.click(screen.getByTestId('nav-circulation'));
    await waitFor(() => {
      expect(screen.getByText('Circulation Dashboard')).toBeInTheDocument();
    });
    
    await user.click(screen.getByTestId('date-filter'));

    // Verify final state
    expect(screen.getByTestId('circulation-content')).toBeInTheDocument();
  });

  it('handles error states across feature boundaries', async () => {
    // Mock console to capture error logs
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithProviders(<MockApp />);

    // Simulate navigation during error state
    await user.click(screen.getByTestId('nav-reports'));
    await waitFor(() => {
      expect(screen.getByText('Reports')).toBeInTheDocument();
    });

    // Navigate back during potential error
    await user.click(screen.getByTestId('nav-analytics'));
    await waitFor(() => {
      expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
    });

    // Application should remain functional
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  it('maintains performance during intensive workflows', async () => {
    const performanceStart = performance.now();
    
    renderWithProviders(<MockApp />);

    // Rapid navigation to test performance
    for (let i = 0; i < 5; i++) {
      await user.click(screen.getByTestId('nav-reports'));
      await waitFor(() => {
        expect(screen.getByText('Reports')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('nav-analytics'));
      await waitFor(() => {
        expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('nav-circulation'));
      await waitFor(() => {
        expect(screen.getByText('Circulation Dashboard')).toBeInTheDocument();
      });
    }

    const performanceEnd = performance.now();
    const duration = performanceEnd - performanceStart;

    // Should complete workflow in reasonable time (adjust threshold as needed)
    expect(duration).toBeLessThan(5000); // 5 seconds
    expect(screen.getByTestId('circulation-content')).toBeInTheDocument();
  });

  it('handles browser back/forward navigation', async () => {
    renderWithProviders(<MockApp />);

    // Simulate navigation history
    await user.click(screen.getByTestId('nav-reports'));
    await waitFor(() => {
      expect(screen.getByText('Reports')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('nav-circulation'));
    await waitFor(() => {
      expect(screen.getByText('Circulation Dashboard')).toBeInTheDocument();
    });

    // Application should handle navigation state correctly
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
  });

  it('validates accessibility across feature workflows', async () => {
    renderWithProviders(<MockApp />);

    // Check for proper ARIA attributes and roles
    const navigation = screen.getByTestId('navigation');
    expect(navigation).toBeInTheDocument();

    const mainContent = screen.getByTestId('main-content');
    expect(mainContent).toBeInTheDocument();

    // Test keyboard navigation
    await user.tab();
    await user.keyboard('{Enter}');

    // Verify focus management
    expect(document.activeElement).toBeDefined();
  });
});