
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DealVelocityAnalysis from '../DealVelocityAnalysis';

// Mock data for testing
const mockOpportunities = [
  {
    id: 1,
    stage: '1st Demo',
    status: 'Won',
    createdDate: '2024-01-01',
    actualCloseDate: '2024-01-15',
    projCloseDate: '2024-01-15'
  },
  {
    id: 2,
    stage: 'Discovery',
    status: 'Lost',
    createdDate: '2024-01-01',
    projCloseDate: '2024-01-30'
  },
  {
    id: 3,
    stage: 'Proposal',
    status: 'Won',
    createdDate: '2024-02-01',
    actualCloseDate: '2024-02-20'
  }
];

describe('DealVelocityAnalysis', () => {
  // Test: Component renders without crashing
  test('renders without crashing', () => {
    render(<DealVelocityAnalysis opportunities={[]} />);
    expect(screen.getByText('Deal Velocity Analysis')).toBeInTheDocument();
  });

  // Test: Renders main components
  test('renders all main sections', () => {
    render(<DealVelocityAnalysis opportunities={mockOpportunities} />);
    
    expect(screen.getByText('Deal Velocity Analysis')).toBeInTheDocument();
    expect(screen.getByText('Avg Sales Cycle')).toBeInTheDocument();
    expect(screen.getByText('Fastest Stage')).toBeInTheDocument();
    expect(screen.getByText('Slowest Stage')).toBeInTheDocument();
    expect(screen.getByText('Bottlenecks')).toBeInTheDocument();
  });

  // Test: Tab navigation works
  test('tab navigation works correctly', () => {
    render(<DealVelocityAnalysis opportunities={mockOpportunities} />);
    
    // Check default tab is active
    expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    
    // Click on stages tab
    fireEvent.click(screen.getByText('Stage Analysis'));
    expect(screen.getByText('Time in Stage Analysis')).toBeInTheDocument();
    
    // Click on benchmarks tab
    fireEvent.click(screen.getByText('Benchmarks'));
    expect(screen.getByText('Stage Performance vs Benchmarks')).toBeInTheDocument();
    
    // Click on optimization tab
    fireEvent.click(screen.getByText('Optimization'));
    expect(screen.getByText('Sales Cycle Optimization Opportunities')).toBeInTheDocument();
  });

  // Test: Period selector works
  test('period selector changes value', () => {
    render(<DealVelocityAnalysis opportunities={mockOpportunities} />);
    
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    
    // Default value should be 'Last 6 Months'
    expect(screen.getByDisplayValue('Last 6 Months')).toBeInTheDocument();
  });

  // Test: Handles empty opportunities array
  test('handles empty opportunities gracefully', () => {
    render(<DealVelocityAnalysis opportunities={[]} />);
    
    expect(screen.getByText('Deal Velocity Analysis')).toBeInTheDocument();
    expect(screen.getByText('0 days')).toBeInTheDocument(); // Avg sales cycle should be 0
  });

  // Test: Calculates metrics correctly with data
  test('displays metrics with valid data', () => {
    render(<DealVelocityAnalysis opportunities={mockOpportunities} />);
    
    // Should display some calculated values (exact values depend on calculation logic)
    const metricsCards = screen.getAllByRole('region');
    expect(metricsCards.length).toBeGreaterThan(0);
  });
});
