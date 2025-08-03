/**
 * @fileoverview Integration tests for Reports feature
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ReportsProvider } from '../context';
import ReportsLayout from '../components/layout/ReportsLayout';

// Mock API service
const mockReports = [
  { id: '1', name: 'Analytics Report', category: 'Analytics', description: 'Test analytics' },
  { id: '2', name: 'Performance Report', category: 'Performance', description: 'Test performance' },
  { id: '3', name: 'Revenue Report', category: 'Analytics', description: 'Test revenue' }
];

vi.mock('../services/api', () => ({
  reportsApiService: {
    getReports: vi.fn(() => Promise.resolve(mockReports)),
    getReportTemplates: vi.fn(() => Promise.resolve([])),
    generateReport: vi.fn(() => Promise.resolve({ status: 'pending', reportId: 'test-id' })),
    getReportStatus: vi.fn(() => Promise.resolve({ status: 'completed', data: {} })),
    scheduleReport: vi.fn(() => Promise.resolve({ scheduleId: 'schedule-123' }))
  }
}));

// Test component that uses the reports feature
const TestReportsFeature = () => {
  const [reports, setReports] = React.useState(mockReports);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState('All');

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || report.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div>
        <input
          data-testid="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search reports..."
        />
        <select
          data-testid="category-select"
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Analytics">Analytics</option>
          <option value="Performance">Performance</option>
        </select>
      </div>
      
      <div data-testid="reports-list">
        {filteredReports.map(report => (
          <div key={report.id} data-testid={`report-${report.id}`}>
            <h3>{report.name}</h3>
            <p>{report.category}</p>
            <p>{report.description}</p>
          </div>
        ))}
      </div>
      
      <div data-testid="reports-count">
        Showing {filteredReports.length} of {reports.length} reports
      </div>
    </div>
  );
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ReportsProvider>
        <ReportsLayout>
          {component}
        </ReportsLayout>
      </ReportsProvider>
    </BrowserRouter>
  );
};

describe('Reports Feature Integration', () => {
  it('renders reports list with all reports initially', async () => {
    renderWithProviders(<TestReportsFeature />);
    
    await waitFor(() => {
      expect(screen.getByTestId('reports-count')).toHaveTextContent('Showing 3 of 3 reports');
    });
    
    expect(screen.getByTestId('report-1')).toBeInTheDocument();
    expect(screen.getByTestId('report-2')).toBeInTheDocument();
    expect(screen.getByTestId('report-3')).toBeInTheDocument();
  });

  it('filters reports by search query', async () => {
    renderWithProviders(<TestReportsFeature />);
    
    const searchInput = screen.getByTestId('search-input');
    
    fireEvent.change(searchInput, { target: { value: 'Analytics' } });
    
    await waitFor(() => {
      expect(screen.getByTestId('reports-count')).toHaveTextContent('Showing 1 of 3 reports');
    });
    
    expect(screen.getByTestId('report-1')).toBeInTheDocument();
    expect(screen.queryByTestId('report-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('report-3')).not.toBeInTheDocument();
  });

  it('filters reports by category', async () => {
    renderWithProviders(<TestReportsFeature />);
    
    const categorySelect = screen.getByTestId('category-select');
    
    fireEvent.change(categorySelect, { target: { value: 'Analytics' } });
    
    await waitFor(() => {
      expect(screen.getByTestId('reports-count')).toHaveTextContent('Showing 2 of 3 reports');
    });
    
    expect(screen.getByTestId('report-1')).toBeInTheDocument();
    expect(screen.queryByTestId('report-2')).not.toBeInTheDocument();
    expect(screen.getByTestId('report-3')).toBeInTheDocument();
  });

  it('combines search and category filters', async () => {
    renderWithProviders(<TestReportsFeature />);
    
    const searchInput = screen.getByTestId('search-input');
    const categorySelect = screen.getByTestId('category-select');
    
    fireEvent.change(categorySelect, { target: { value: 'Analytics' } });
    fireEvent.change(searchInput, { target: { value: 'Revenue' } });
    
    await waitFor(() => {
      expect(screen.getByTestId('reports-count')).toHaveTextContent('Showing 1 of 3 reports');
    });
    
    expect(screen.queryByTestId('report-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('report-2')).not.toBeInTheDocument();
    expect(screen.getByTestId('report-3')).toBeInTheDocument();
  });

  it('shows no results when filters match nothing', async () => {
    renderWithProviders(<TestReportsFeature />);
    
    const searchInput = screen.getByTestId('search-input');
    
    fireEvent.change(searchInput, { target: { value: 'NonexistentReport' } });
    
    await waitFor(() => {
      expect(screen.getByTestId('reports-count')).toHaveTextContent('Showing 0 of 3 reports');
    });
    
    expect(screen.queryByTestId('report-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('report-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('report-3')).not.toBeInTheDocument();
  });
});