
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import DocumentationSidebar from '../DocumentationSidebar';

describe('DocumentationSidebar', () => {
  const mockDocumentationFiles = [
    {
      id: 'contributing',
      name: 'CONTRIBUTING.md',
      title: 'Contributing Guidelines',
      description: 'Code style guidelines',
      status: 'Available',
      lastUpdated: '2025-05-25'
    }
  ];

  const mockOnDocumentSelect = vi.fn();

  beforeEach(() => {
    mockOnDocumentSelect.mockClear();
  });

  it('renders documentation files', () => {
    render(
      <DocumentationSidebar 
        documentationFiles={mockDocumentationFiles}
        activeDoc="contributing"
        onDocumentSelect={mockOnDocumentSelect}
      />
    );
    
    expect(screen.getByText('Contributing Guidelines')).toBeInTheDocument();
    expect(screen.getByText('Code style guidelines')).toBeInTheDocument();
  });

  it('calls onDocumentSelect when file is clicked', () => {
    render(
      <DocumentationSidebar 
        documentationFiles={mockDocumentationFiles}
        activeDoc="contributing"
        onDocumentSelect={mockOnDocumentSelect}
      />
    );
    
    fireEvent.click(screen.getByText('Contributing Guidelines'));
    expect(mockOnDocumentSelect).toHaveBeenCalledWith('contributing');
  });
});
