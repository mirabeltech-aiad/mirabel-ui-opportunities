
import { render, screen } from '@testing-library/react';
import OpportunitiesTable from '../OpportunitiesTable';

// Integration test to ensure main component functionality is preserved
describe('OpportunitiesTable', () => {
  const mockOpportunities = [
    {
      id: 1,
      status: 'Open',
      name: 'Test Opportunity',
      company: 'Test Company',
      createdDate: '01/01/2024',
      assignedRep: 'John Doe',
      stage: 'Discovery',
      amount: 5000,
      projCloseDate: '02/01/2024',
      source: 'CK Outbound',
      leadSource: 'SRDS',
      leadType: 'Editorial',
      salesPresentation: 'MM',
      createdBy: 'Jane Doe',
      actualCloseDate: ''
    }
  ];

  it('should render without crashing', () => {
    render(<OpportunitiesTable opportunities={mockOpportunities} />);
    
    expect(screen.getByText('Test Opportunity')).toBeInTheDocument();
    expect(screen.getByText('Test Company')).toBeInTheDocument();
  });

  it('should display correct item count', () => {
    render(<OpportunitiesTable opportunities={mockOpportunities} />);
    
    expect(screen.getByText(/Showing 1 of 1 opportunities/)).toBeInTheDocument();
  });

  it('should render filter controls', () => {
    render(<OpportunitiesTable opportunities={mockOpportunities} />);
    
    expect(screen.getByDisplayValue('All Opportunities')).toBeInTheDocument();
  });

  // Warning: Consider adding more comprehensive integration tests
  // to cover user interactions, sorting, selection, and infinite scroll behavior
});
