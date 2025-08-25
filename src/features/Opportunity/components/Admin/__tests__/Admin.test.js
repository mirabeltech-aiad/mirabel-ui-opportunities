
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Admin from '@/pages/Opportunity/Admin';

// Mock all the child components


vi.mock('@OpportunityComponents/Admin/ApiKeysTab', () => ({
  default: () => <div data-testid="api-keys-tab">ApiKeysTab</div>
}));

vi.mock('@OpportunityComponents/Admin/ArchitectNotesTab', () => ({
  default: () => <div data-testid="architect-notes-tab">ArchitectNotesTab</div>
}));

vi.mock('@OpportunityComponents/Admin/ColorSettingsTab', () => ({
  default: () => <div data-testid="color-settings-tab">ColorSettingsTab</div>
}));

vi.mock('@OpportunityComponents/Admin/PlaceholderTab', () => ({
  default: ({ title }) => <div data-testid="placeholder-tab">{title} Content</div>
}));

describe('Admin', () => {
  it('renders admin panel with all tabs', () => {
    render(<Admin />);
    
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
    expect(screen.getByText('API Keys')).toBeInTheDocument();
    expect(screen.getByText('Service Mode')).toBeInTheDocument();
    expect(screen.getByText('Service Tester')).toBeInTheDocument();
    expect(screen.getByText('Components')).toBeInTheDocument();
    expect(screen.getByText('Architect Notes')).toBeInTheDocument();
    expect(screen.getByText('Color Settings')).toBeInTheDocument();
    expect(screen.getByText('Help Guide')).toBeInTheDocument();
    expect(screen.getByText('Style Guide')).toBeInTheDocument();
  });

  it('renders main navbar', () => {
    render(<Admin />);
    
    expect(screen.getByTestId('main-navbar')).toBeInTheDocument();
  });

  it('shows API Keys tab by default', () => {
    render(<Admin />);
    
    expect(screen.getByTestId('api-keys-tab')).toBeInTheDocument();
  });
});
