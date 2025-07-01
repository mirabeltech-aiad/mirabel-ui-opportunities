
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import VelocityMetricsCards from '../VelocityMetricsCards';

const mockVelocityMetrics = {
  avgSalesCycle: 45,
  stageVelocity: [
    { stage: '1st Demo', avgDays: 7, dealCount: 5, variance: 0, status: 'optimal' },
    { stage: 'Discovery', avgDays: 14, dealCount: 3, variance: 25, status: 'slow' },
    { stage: 'Proposal', avgDays: 10, dealCount: 2, variance: -10, status: 'fast' },
    { stage: 'Negotiation', avgDays: 12, dealCount: 4, variance: 5, status: 'optimal' }
  ]
};

const mockBottlenecks = [
  { stage: 'Discovery', impact: 'High' }
];

describe('VelocityMetricsCards', () => {
  test('renders all metric cards', () => {
    render(
      <VelocityMetricsCards 
        velocityMetrics={mockVelocityMetrics} 
        bottlenecks={mockBottlenecks} 
      />
    );
    
    expect(screen.getByText('Avg Sales Cycle')).toBeInTheDocument();
    expect(screen.getByText('Fastest Stage')).toBeInTheDocument();
    expect(screen.getByText('Slowest Stage')).toBeInTheDocument();
    expect(screen.getByText('Bottlenecks')).toBeInTheDocument();
  });

  test('displays correct sales cycle value', () => {
    render(
      <VelocityMetricsCards 
        velocityMetrics={mockVelocityMetrics} 
        bottlenecks={mockBottlenecks} 
      />
    );
    
    expect(screen.getByText('45 days')).toBeInTheDocument();
  });

  test('identifies fastest and slowest stages correctly', () => {
    render(
      <VelocityMetricsCards 
        velocityMetrics={mockVelocityMetrics} 
        bottlenecks={mockBottlenecks} 
      />
    );
    
    // Fastest should be 1st Demo (7 days)
    expect(screen.getByText('1st Demo')).toBeInTheDocument();
    expect(screen.getByText('7 days average')).toBeInTheDocument();
    
    // Slowest should be Discovery (14 days)
    expect(screen.getByText('Discovery')).toBeInTheDocument();
    expect(screen.getByText('14 days average')).toBeInTheDocument();
  });

  test('displays correct bottleneck count', () => {
    render(
      <VelocityMetricsCards 
        velocityMetrics={mockVelocityMetrics} 
        bottlenecks={mockBottlenecks} 
      />
    );
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Stages above benchmark')).toBeInTheDocument();
  });
});
