/**
 * @fileoverview Tests for ErrorRecoveryStrategies component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ErrorRecoveryStrategies from '../ErrorRecoveryStrategies';

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn()
}));

describe('ErrorRecoveryStrategies', () => {
  it('renders retry button when onRetry is provided', () => {
    const mockRetry = vi.fn();
    
    render(
      <ErrorRecoveryStrategies
        errorType="network"
        onRetry={mockRetry}
      />
    );

    const retryButton = screen.getByText('Try Again');
    expect(retryButton).toBeInTheDocument();
    
    fireEvent.click(retryButton);
    expect(mockRetry).toHaveBeenCalled();
  });

  it('renders navigation buttons when callbacks are provided', () => {
    const mockNavigateBack = vi.fn();
    const mockNavigateHome = vi.fn();
    
    render(
      <ErrorRecoveryStrategies
        errorType="generic"
        onNavigateBack={mockNavigateBack}
        onNavigateHome={mockNavigateHome}
      />
    );

    const backButton = screen.getByText('Go Back');
    const homeButton = screen.getByText('Go Home');
    
    expect(backButton).toBeInTheDocument();
    expect(homeButton).toBeInTheDocument();
    
    fireEvent.click(backButton);
    expect(mockNavigateBack).toHaveBeenCalled();
    
    fireEvent.click(homeButton);
    expect(mockNavigateHome).toHaveBeenCalled();
  });

  it('renders network-specific actions for network errors', () => {
    render(
      <ErrorRecoveryStrategies
        errorType="network"
        featureName="Test Feature"
      />
    );

    expect(screen.getByText('Clear Cache')).toBeInTheDocument();
  });

  it('renders data-specific actions for data errors', () => {
    render(
      <ErrorRecoveryStrategies
        errorType="data"
        featureName="Test Feature"
      />
    );

    expect(screen.getByText('Clear Data Cache')).toBeInTheDocument();
  });

  it('renders permission-specific actions for permission errors', () => {
    render(
      <ErrorRecoveryStrategies
        errorType="permission"
      />
    );

    expect(screen.getByText('Refresh Page')).toBeInTheDocument();
  });

  it('always renders download error report button', () => {
    render(
      <ErrorRecoveryStrategies
        errorType="generic"
      />
    );

    expect(screen.getByText('Download Report')).toBeInTheDocument();
  });

  it('renders custom actions when provided', () => {
    const customAction = {
      id: 'custom',
      label: 'Custom Action',
      icon: <span>🔧</span>,
      action: vi.fn()
    };

    render(
      <ErrorRecoveryStrategies
        errorType="generic"
        customActions={[customAction]}
      />
    );

    const customButton = screen.getByText('Custom Action');
    expect(customButton).toBeInTheDocument();
    
    fireEvent.click(customButton);
    expect(customAction.action).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ErrorRecoveryStrategies
        errorType="generic"
        className="custom-recovery-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-recovery-class');
  });

  it('handles disabled custom actions', () => {
    const disabledAction = {
      id: 'disabled',
      label: 'Disabled Action',
      icon: <span>❌</span>,
      action: vi.fn(),
      disabled: true
    };

    render(
      <ErrorRecoveryStrategies
        errorType="generic"
        customActions={[disabledAction]}
      />
    );

    const disabledButton = screen.getByText('Disabled Action');
    expect(disabledButton).toBeDisabled();
  });

  it('handles clear cache action', () => {
    render(
      <ErrorRecoveryStrategies
        errorType="network"
        featureName="Analytics"
      />
    );

    const clearCacheButton = screen.getByText('Clear Cache');
    fireEvent.click(clearCacheButton);
    
    // Should not throw an error
    expect(clearCacheButton).toBeInTheDocument();
  });
});