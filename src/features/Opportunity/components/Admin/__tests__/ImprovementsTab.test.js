
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useImprovements } from '../hooks/useImprovements';
import ImprovementsTab from '../ImprovementsTab';

// Mock the custom hook
vi.mock('../hooks/useImprovements');

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

describe('ImprovementsTab', () => {
  const mockAddImprovement = vi.fn();
  const mockUpdateImprovement = vi.fn();
  const mockDeleteImprovement = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useImprovements.mockReturnValue({
      improvements: [],
      addImprovement: mockAddImprovement,
      updateImprovement: mockUpdateImprovement,
      deleteImprovement: mockDeleteImprovement,
    });
  });

  it('renders improvements tab with header', () => {
    render(<ImprovementsTab />);
    
    expect(screen.getByText('Improvements')).toBeInTheDocument();
    expect(screen.getByText('Feature requests and enhancement ideas')).toBeInTheDocument();
    expect(screen.getByText('Add New Improvement')).toBeInTheDocument();
  });

  it('shows empty state when no improvements exist', () => {
    render(<ImprovementsTab />);
    
    expect(screen.getByText('No improvements yet. Add your first improvement idea to get started.')).toBeInTheDocument();
  });

  it('displays improvements when they exist', () => {
    const mockImprovements = [
      {
        id: 1,
        title: 'Test Improvement',
        description: 'Test Description',
        priority: 'high',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      }
    ];

    useImprovements.mockReturnValue({
      improvements: mockImprovements,
      addImprovement: mockAddImprovement,
      updateImprovement: mockUpdateImprovement,
      deleteImprovement: mockDeleteImprovement,
    });

    render(<ImprovementsTab />);
    
    expect(screen.getByText('Test Improvement')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('High Priority')).toBeInTheDocument();
  });

  it('shows form when add button is clicked', () => {
    render(<ImprovementsTab />);
    
    fireEvent.click(screen.getByText('Add New Improvement'));
    
    expect(screen.getByText('Add New Improvement')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter improvement title')).toBeInTheDocument();
  });

  it('calls addImprovement when form is submitted', async () => {
    mockAddImprovement.mockReturnValue(true);
    
    render(<ImprovementsTab />);
    
    fireEvent.click(screen.getByText('Add New Improvement'));
    
    const titleInput = screen.getByPlaceholderText('Enter improvement title');
    fireEvent.change(titleInput, { target: { value: 'New Improvement' } });
    
    const addButton = screen.getByRole('button', { name: 'Add' });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(mockAddImprovement).toHaveBeenCalledWith({
        title: 'New Improvement',
        description: '',
        priority: 'medium'
      });
    });
  });

  it('calls deleteImprovement when delete button is clicked', () => {
    const mockImprovements = [
      {
        id: 1,
        title: 'Test Improvement',
        description: 'Test Description',
        priority: 'high',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      }
    ];

    useImprovements.mockReturnValue({
      improvements: mockImprovements,
      addImprovement: mockAddImprovement,
      updateImprovement: mockUpdateImprovement,
      deleteImprovement: mockDeleteImprovement,
    });

    render(<ImprovementsTab />);
    
    const deleteButton = screen.getByRole('button', { name: '' }); // Delete button with Trash2 icon
    fireEvent.click(deleteButton);
    
    expect(mockDeleteImprovement).toHaveBeenCalledWith(1);
  });
});
