
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import OpportunityStatsCards from '../OpportunityStatsCards';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('OpportunityStatsCards', () => {
  const mockStats = {
    total: 25,
    amount: 150000,
    won: 8,
    open: 12,
    lost: 5,
    winTotal: 75000,
    winPercentage: 32
  };

  beforeEach(() => {
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  test('renders all stat cards with correct values', () => {
    render(<OpportunityStatsCards stats={mockStats} />);
    
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('$150,000')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('$75,000')).toBeInTheDocument();
    expect(screen.getByText('32%')).toBeInTheDocument();
  });

  test('renders all stat labels correctly', () => {
    render(<OpportunityStatsCards stats={mockStats} />);
    
    expect(screen.getByText('# Of Opportunities')).toBeInTheDocument();
    expect(screen.getByText('Opportunity Amount')).toBeInTheDocument();
    expect(screen.getByText('Total Opportunity Won')).toBeInTheDocument();
    expect(screen.getByText('Total Opportunity Open')).toBeInTheDocument();
    expect(screen.getByText('Total Opportunity Lost')).toBeInTheDocument();
    expect(screen.getByText('Opportunity Win Total')).toBeInTheDocument();
    expect(screen.getByText('Opportunity Win %')).toBeInTheDocument();
  });

  test('applies rounded-md styling to cards', () => {
    const { container } = render(<OpportunityStatsCards stats={mockStats} />);
    const cards = container.querySelectorAll('[class*="rounded-md"]');
    
    // Should have 7 cards with rounded-md styling
    expect(cards.length).toBe(7);
  });

  test('uses custom colors from localStorage when available', () => {
    const customColors = {
      primary: '#FF0000',
      success: '#00FF00',
      secondary: '#0000FF',
      danger: '#FFFF00',
      warning: '#FF00FF'
    };
    
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(customColors));
    
    render(<OpportunityStatsCards stats={mockStats} />);
    
    // Component should render without errors when custom colors are loaded
    expect(screen.getByText('25')).toBeInTheDocument();
  });
});
