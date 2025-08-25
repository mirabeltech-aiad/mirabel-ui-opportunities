
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import FieldMappingTab from '../FieldMappingTab';

// Mock toast hook
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn()
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

describe('FieldMappingTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  test('renders field mapping header and description', () => {
    render(<FieldMappingTab />);
    
    expect(screen.getByText('Field Mapping')).toBeInTheDocument();
    expect(screen.getByText('Map fields between your local data and platform data')).toBeInTheDocument();
  });

  test('displays mapping status with correct initial values', () => {
    render(<FieldMappingTab />);
    
    expect(screen.getByText('0 / 9 Fields Mapped')).toBeInTheDocument();
    expect(screen.getByText('Platform Fields Available: 0')).toBeInTheDocument();
  });

  test('shows empty state when no platform fields are loaded', () => {
    render(<FieldMappingTab />);
    
    expect(screen.getByText('No Platform Fields Loaded')).toBeInTheDocument();
    expect(screen.getByText('Load fields from your platform to start mapping')).toBeInTheDocument();
  });

  test('loads platform fields when refresh button is clicked', async () => {
    render(<FieldMappingTab />);
    
    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(refreshButton);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Field Mappings')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('displays mapping table after platform fields are loaded', async () => {
    render(<FieldMappingTab />);
    
    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(screen.getByText('Local Field')).toBeInTheDocument();
      expect(screen.getByText('Platform Field')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('loads saved mappings from localStorage on mount', () => {
    const savedMappings = { 'company': 'account_name' };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedMappings));
    
    render(<FieldMappingTab />);
    
    expect(localStorageMock.getItem).toHaveBeenCalledWith('field_mappings');
  });

  test('saves mappings to localStorage when mapping changes', async () => {
    render(<FieldMappingTab />);
    
    // Load platform fields first
    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(refreshButton);

    await waitFor(() => {
      const selects = screen.getAllByRole('combobox');
      expect(selects).toHaveLength(9); // 9 local fields
    }, { timeout: 2000 });

    // Change a mapping
    const firstSelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(firstSelect, { target: { value: 'account_name' } });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'field_mappings',
      expect.stringContaining('account_name')
    );
  });

  test('save mappings button functionality', async () => {
    render(<FieldMappingTab />);
    
    // Load platform fields first
    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(refreshButton);

    await waitFor(() => {
      const saveButton = screen.getByRole('button', { name: /save mappings/i });
      fireEvent.click(saveButton);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'field_mappings',
        expect.any(String)
      );
    }, { timeout: 2000 });
  });
});
