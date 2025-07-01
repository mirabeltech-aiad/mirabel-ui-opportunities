
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import DocumentationTab from '../DocumentationTab';

// WARNING: Tests recommended to ensure refactoring preserves functionality
describe('DocumentationTab', () => {
  it('renders documentation management interface', () => {
    render(<DocumentationTab />);
    
    expect(screen.getByText('Documentation Management')).toBeInTheDocument();
    expect(screen.getByText('View and manage project documentation files')).toBeInTheDocument();
  });

  it('displays documentation files in sidebar', () => {
    render(<DocumentationTab />);
    
    expect(screen.getByText('Contributing Guidelines')).toBeInTheDocument();
    expect(screen.getByText('Deployment Guide')).toBeInTheDocument();
    expect(screen.getByText('API Documentation')).toBeInTheDocument();
    expect(screen.getByText('Testing Guidelines')).toBeInTheDocument();
    expect(screen.getByText('Troubleshooting Guide')).toBeInTheDocument();
  });

  it('switches between documentation files when clicked', () => {
    render(<DocumentationTab />);
    
    // Click on Deployment Guide
    fireEvent.click(screen.getByText('Deployment Guide'));
    
    // Should show deployment documentation
    expect(screen.getByText('DEPLOYMENT.md')).toBeInTheDocument();
  });

  it('shows action buttons for documentation', () => {
    render(<DocumentationTab />);
    
    expect(screen.getByText('View')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('displays contributing content by default', () => {
    render(<DocumentationTab />);
    
    // Should show contributing guidelines content
    expect(screen.getByText(/Contributing Guidelines/)).toBeInTheDocument();
  });
});
