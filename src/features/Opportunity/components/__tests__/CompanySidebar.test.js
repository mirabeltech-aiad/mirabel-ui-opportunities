
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CompanySidebar from '../../../../components/ui/CompanySidebar';

// Mock the custom hook
jest.mock('@/hooks/useCompanyData', () => ({
  useCompanyData: jest.fn(() => ({
    companyData: {
      name: 'Test Company',
      firstName: 'John',
      lastName: 'Doe',
      phone: '(555) 123-4567',
      email: 'john@test.com',
      address: 'Test Address',
      website: 'www.test.com',
      industry: 'Technology',
      employees: '10-50'
    },
    setCompanyData: jest.fn(),
    editingField: null,
    tempValue: '',
    setTempValue: jest.fn(),
    startEditing: jest.fn(),
    saveEdit: jest.fn(),
    cancelEdit: jest.fn(),
    handleKeyDown: jest.fn()
  }))
}));

describe('CompanySidebar', () => {
  const defaultProps = {
    selectedCompany: 'Test Company',
    opportunities: [],
    onClose: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders company sidebar with correct company name', () => {
    render(<CompanySidebar {...defaultProps} />);
    expect(screen.getByText('Test Company')).toBeInTheDocument();
  });

  test('renders all activity tabs', () => {
    render(<CompanySidebar {...defaultProps} />);
    expect(screen.getByText('Notes')).toBeInTheDocument();
    expect(screen.getByText('Calls')).toBeInTheDocument();
    expect(screen.getByText('Meetings')).toBeInTheDocument();
    expect(screen.getByText('Emails')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<CompanySidebar {...defaultProps} onClose={onClose} />);
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });

  test('renders company information section', () => {
    render(<CompanySidebar {...defaultProps} />);
    expect(screen.getByText('Company Information')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('(555) 123-4567')).toBeInTheDocument();
    expect(screen.getByText('john@test.com')).toBeInTheDocument();
  });

  test('switches between tabs correctly', async () => {
    render(<CompanySidebar {...defaultProps} />);
    
    // Click on calls tab
    const callsTab = screen.getByText('Calls');
    fireEvent.click(callsTab);
    
    // Should show calls content
    await waitFor(() => {
      expect(screen.getByText(/f\/up to see how things are going/)).toBeInTheDocument();
    });
  });

  // Warning: Consider adding integration tests for the editing functionality
  // as this component heavily relies on user interactions for inline editing
});
