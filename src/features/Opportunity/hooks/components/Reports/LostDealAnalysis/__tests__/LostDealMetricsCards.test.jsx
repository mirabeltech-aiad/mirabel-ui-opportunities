
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LostDealMetricsCards from '../LostDealMetricsCards';

const mockLostDealsData = {
  totalLost: 15,
  totalLostValue: 2500000,
  lossReasonStats: [
    { reason: 'Price Too High', count: 8, percentage: 53.3 },
    { reason: 'Missing Features', count: 4, percentage: 26.7 },
  ],
  competitorStats: [
    { competitor: 'Salesforce', losses: 6 },
    { competitor: 'HubSpot', losses: 3 },
  ],
};

describe('LostDealMetricsCards', () => {
  test('renders all metric cards', () => {
    render(<LostDealMetricsCards lostDealsData={mockLostDealsData} />);
    
    expect(screen.getByText('Total Lost Deals')).toBeInTheDocument();
    expect(screen.getByText('Lost Deal Value')).toBeInTheDocument();
    expect(screen.getByText('Top Loss Reason')).toBeInTheDocument();
    expect(screen.getByText('Top Competitor')).toBeInTheDocument();
  });

  test('displays correct total lost deals count', () => {
    render(<LostDealMetricsCards lostDealsData={mockLostDealsData} />);
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  test('displays correct lost deal value in millions', () => {
    render(<LostDealMetricsCards lostDealsData={mockLostDealsData} />);
    expect(screen.getByText('$2.5M')).toBeInTheDocument();
  });

  test('displays top loss reason correctly', () => {
    render(<LostDealMetricsCards lostDealsData={mockLostDealsData} />);
    expect(screen.getByText('Price Too High')).toBeInTheDocument();
    expect(screen.getByText('53.3% of losses')).toBeInTheDocument();
  });

  test('displays top competitor correctly', () => {
    render(<LostDealMetricsCards lostDealsData={mockLostDealsData} />);
    expect(screen.getByText('Salesforce')).toBeInTheDocument();
    expect(screen.getByText('6 deals lost')).toBeInTheDocument();
  });
});
