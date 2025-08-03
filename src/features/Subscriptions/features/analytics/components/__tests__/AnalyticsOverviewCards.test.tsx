/**
 * @fileoverview Tests for AnalyticsOverviewCards component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AnalyticsOverviewCards from '../AnalyticsOverviewCards';

// Mock the Card components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className} data-testid="card">{children}</div>,
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
  CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: any) => <h3 data-testid="card-title">{children}</h3>
}));

describe('AnalyticsOverviewCards', () => {
  const mockOverviewData = {
    totalSubscribers: 10000,
    activeSubscribers: 8500,
    averageLTV: 150.0,
    overallEngagementScore: 0.72,
    churnRisk: { low: 0.02, medium: 0.05, high: 0.08, critical: 0.15 },
    revenueGrowthRate: 0.15,
    conversionRate: 0.03,
    topPerformingSegments: ['Premium', 'Standard'],
    keyInsights: ['High engagement', 'Growing LTV']
  };

  it('renders loading state when data is loading', () => {
    render(<AnalyticsOverviewCards overview={null} />);
    
    const cards = screen.getAllByTestId('card');
    expect(cards).toHaveLength(4);
    
    // Should show skeleton or loading content
    cards.forEach(card => {
      expect(card).toBeInTheDocument();
    });
  });

  it('renders overview data when available', () => {
    render(<AnalyticsOverviewCards overview={mockOverviewData} />);
    
    expect(screen.getByText('Total Subscribers')).toBeInTheDocument();
    expect(screen.getByText('Active Subscribers')).toBeInTheDocument();
    expect(screen.getByText('Churn Risk')).toBeInTheDocument();
    expect(screen.getByText('Engagement Score')).toBeInTheDocument();
    
    expect(screen.getByText('10,000')).toBeInTheDocument();
    expect(screen.getByText('8,500')).toBeInTheDocument();
    expect(screen.getByText('5.0%')).toBeInTheDocument();
    expect(screen.getByText('72.0%')).toBeInTheDocument();
  });

  it('formats numbers correctly', () => {
    const dataWithLargeNumbers = {
      totalSubscribers: 1250000,
      activeSubscribers: 1125000,
      averageLTV: 250.0,
      overallEngagementScore: 0.854,
      churnRisk: { low: 0.01, medium: 0.0325, high: 0.06, critical: 0.12 },
      revenueGrowthRate: 0.25,
      conversionRate: 0.045,
      topPerformingSegments: ['Enterprise'],
      keyInsights: ['Rapid growth']
    };
    
    render(<AnalyticsOverviewCards overview={dataWithLargeNumbers} />);
    
    expect(screen.getByText('1,250,000')).toBeInTheDocument();
    expect(screen.getByText('1,125,000')).toBeInTheDocument();
    expect(screen.getByText('3.3%')).toBeInTheDocument();
    expect(screen.getByText('85.4%')).toBeInTheDocument();
  });

  it('handles zero values correctly', () => {
    const dataWithZeros = {
      totalSubscribers: 0,
      activeSubscribers: 0,
      averageLTV: 0,
      overallEngagementScore: 0,
      churnRisk: { low: 0, medium: 0, high: 0, critical: 0 },
      revenueGrowthRate: 0,
      conversionRate: 0,
      topPerformingSegments: [],
      keyInsights: []
    };
    
    render(<AnalyticsOverviewCards overview={dataWithZeros} />);
    
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('0.0%')).toBeInTheDocument();
  });

  it('renders correct number of cards', () => {
    render(<AnalyticsOverviewCards overview={mockOverviewData} />);
    
    const cards = screen.getAllByTestId('card');
    expect(cards).toHaveLength(4);
  });

  it('applies correct grid layout classes', () => {
    const { container } = render(<AnalyticsOverviewCards overview={mockOverviewData} />);
    
    const gridContainer = container.firstChild;
    expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4', 'gap-6');
  });

  it('shows appropriate icons for each metric', () => {
    render(<AnalyticsOverviewCards overview={mockOverviewData} />);
    
    // Icons should be present (we can test for their containers or test-ids if added)
    const cardTitles = screen.getAllByTestId('card-title');
    expect(cardTitles).toHaveLength(4);
  });
});