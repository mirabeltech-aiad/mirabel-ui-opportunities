
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LostDealAnalysis from '../LostDealAnalysis';

const mockOpportunities = [
  { status: 'Lost', amount: 50000 },
  { status: 'Closed Lost', amount: 75000 },
  { status: 'Won', amount: 100000 },
];

describe('LostDealAnalysis', () => {
  test('renders without crashing', () => {
    render(<LostDealAnalysis opportunities={mockOpportunities} />);
    expect(screen.getByText('Lost Deal Analysis')).toBeInTheDocument();
  });

  test('displays comprehensive analysis description', () => {
    render(<LostDealAnalysis opportunities={mockOpportunities} />);
    expect(screen.getByText('Comprehensive analysis of lost opportunities and improvement insights')).toBeInTheDocument();
  });

  test('renders all tab triggers', () => {
    render(<LostDealAnalysis opportunities={mockOpportunities} />);
    expect(screen.getByRole('tab', { name: 'Loss Reasons' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Competitors' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Stage Patterns' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Loss Trends' })).toBeInTheDocument();
  });

  test('renders period selector', () => {
    render(<LostDealAnalysis opportunities={mockOpportunities} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  test('handles empty opportunities array', () => {
    render(<LostDealAnalysis opportunities={[]} />);
    expect(screen.getByText('Lost Deal Analysis')).toBeInTheDocument();
  });

  test('renders metrics cards', () => {
    render(<LostDealAnalysis opportunities={mockOpportunities} />);
    expect(screen.getByText('Total Lost Deals')).toBeInTheDocument();
    expect(screen.getByText('Lost Deal Value')).toBeInTheDocument();
    expect(screen.getByText('Top Loss Reason')).toBeInTheDocument();
    expect(screen.getByText('Top Competitor')).toBeInTheDocument();
  });
});
