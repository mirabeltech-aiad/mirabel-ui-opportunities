
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ApiKeysTab from '../ApiKeysTab';

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

describe('ApiKeysTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders API Keys setup interface', () => {
    render(<ApiKeysTab />);
    
    expect(screen.getByText('API Keys Setup')).toBeInTheDocument();
    expect(screen.getByText('OpenAI')).toBeInTheDocument();
    expect(screen.getByText('Runway')).toBeInTheDocument();
    expect(screen.getByText('Eleven Labs')).toBeInTheDocument();
  });

  it('shows saved state when API keys are present in localStorage', () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'openai_api_key') return 'test-key';
      return null;
    });

    render(<ApiKeysTab />);
    
    expect(screen.getByText('API key saved')).toBeInTheDocument();
  });

  it('allows entering and saving API keys', async () => {
    const { toast } = require('@/features/Opportunity/hooks/use-toast');
    render(<ApiKeysTab />);
    
    const openAIInput = screen.getByPlaceholderText('Enter your OpenAI API key');
    const saveButton = screen.getAllByText('Save')[0];
    
    fireEvent.change(openAIInput, { target: { value: 'test-api-key' } });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('openai_api_key', 'test-api-key');
      expect(toast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'OpenAI API key has been saved',
      });
    });
  });
});
