
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ArchitectNotesTab from '../ArchitectNotesTab';

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('ArchitectNotesTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('renders architect notes interface', () => {
    render(<ArchitectNotesTab />);
    
    expect(screen.getByText('Architect Notes')).toBeInTheDocument();
    expect(screen.getByText('Add New Note')).toBeInTheDocument();
  });

  it('shows empty state when no notes exist', () => {
    render(<ArchitectNotesTab />);
    
    expect(screen.getByText('No architect notes yet. Add your first note to get started.')).toBeInTheDocument();
  });

  it('allows adding new notes', async () => {
    const { toast } = require('@/features/Opportunity/hooks/use-toast');
    render(<ArchitectNotesTab />);
    
    fireEvent.click(screen.getByText('Add New Note'));
    
    const titleInput = screen.getByPlaceholderText('Enter note title');
    const descriptionInput = screen.getByPlaceholderText('Enter detailed description of the changes...');
    
    fireEvent.change(titleInput, { target: { value: 'Test Note' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
    
    fireEvent.click(screen.getByText('Add Note'));
    
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalled();
      expect(toast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Architect note has been added',
      });
    });
  });

  it('loads existing notes from localStorage', () => {
    const mockNotes = JSON.stringify([
      {
        id: 1,
        title: 'Test Note',
        description: 'Test description',
        category: 'upgrade',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ]);
    
    localStorageMock.getItem.mockReturnValue(mockNotes);
    
    render(<ArchitectNotesTab />);
    
    expect(screen.getByText('Test Note')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });
});
