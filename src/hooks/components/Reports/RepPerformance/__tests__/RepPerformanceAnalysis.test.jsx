
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RepPerformanceAnalysis from '../RepPerformanceAnalysis';

// Mock data for testing
const mockOpportunities = [
  {
    id: 1,
    assignedRep: 'John Doe',
    status: 'Won',
    amount: 100000,
    createdDate: '2024-01-15',
    actualCloseDate: '2024-02-15'
  },
  {
    id: 2,
    assignedRep: 'Jane Smith',
    status: 'Open',
    amount: 150000,
    createdDate: '2024-01-20',
    projCloseDate: '2024-03-20'
  }
];

describe('RepPerformanceAnalysis', () => {
  // WARNING: This test ensures basic rendering functionality is preserved.
  // Additional tests should be created to cover all component interactions and edge cases.
  
  test('renders without crashing and displays main elements', () => {
    render(<RepPerformanceAnalysis opportunities={mockOpportunities} />);
    
    // Check that main heading is present
    expect(screen.getByText('Rep Performance Analysis')).toBeInTheDocument();
    
    // Check that tabs are present
    expect(screen.getByText('Performance Overview')).toBeInTheDocument();
    expect(screen.getByText('Monthly Activity')).toBeInTheDocument();
    expect(screen.getByText('Quota Analysis')).toBeInTheDocument();
    
    // Check that metric cards are present
    expect(screen.getByText('Total Reps')).toBeInTheDocument();
    expect(screen.getByText('Avg Quota Attainment')).toBeInTheDocument();
    expect(screen.getByText('Top Performer')).toBeInTheDocument();
  });

  test('handles empty opportunities array without error', () => {
    render(<RepPerformanceAnalysis opportunities={[]} />);
    
    // Should still render main structure
    expect(screen.getByText('Rep Performance Analysis')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument(); // Total reps should be 0
  });

  test('preserves existing prop interface', () => {
    // Test that component accepts opportunities prop as before
    const { rerender } = render(<RepPerformanceAnalysis opportunities={mockOpportunities} />);
    
    // Should not throw when re-rendering with different data
    rerender(<RepPerformanceAnalysis opportunities={[]} />);
    rerender(<RepPerformanceAnalysis />); // Should handle undefined prop
    
    expect(screen.getByText('Rep Performance Analysis')).toBeInTheDocument();
  });
});
