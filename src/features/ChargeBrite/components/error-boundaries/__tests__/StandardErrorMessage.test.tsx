/**
 * @fileoverview Tests for StandardErrorMessage component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StandardErrorMessage from '../StandardErrorMessage';

describe('StandardErrorMessage', () => {
  it('renders critical severity error correctly', () => {
    render(
      <StandardErrorMessage
        severity="critical"
        title="Critical Error"
        message="This is a critical error message"
        suggestions={['Restart the application', 'Contact support']}
      />
    );

    expect(screen.getByText('Critical Error')).toBeInTheDocument();
    expect(screen.getByText('This is a critical error message')).toBeInTheDocument();
    expect(screen.getByText('Restart the application')).toBeInTheDocument();
    expect(screen.getByText('Contact support')).toBeInTheDocument();
  });

  it('renders high severity error with appropriate styling', () => {
    render(
      <StandardErrorMessage
        severity="high"
        title="High Priority Error"
        message="This requires immediate attention"
      />
    );

    expect(screen.getByText('High Priority Error')).toBeInTheDocument();
    expect(screen.getByText('This requires immediate attention')).toBeInTheDocument();
  });

  it('renders medium severity error', () => {
    render(
      <StandardErrorMessage
        severity="medium"
        title="Medium Error"
        message="This is a medium priority error"
      />
    );

    expect(screen.getByText('Medium Error')).toBeInTheDocument();
    expect(screen.getByText('This is a medium priority error')).toBeInTheDocument();
  });

  it('renders low severity error', () => {
    render(
      <StandardErrorMessage
        severity="low"
        title="Low Priority Error"
        message="This is a low priority error"
      />
    );

    expect(screen.getByText('Low Priority Error')).toBeInTheDocument();
    expect(screen.getByText('This is a low priority error')).toBeInTheDocument();
  });

  it('renders info severity message', () => {
    render(
      <StandardErrorMessage
        severity="info"
        title="Information"
        message="This is informational"
      />
    );

    expect(screen.getByText('Information')).toBeInTheDocument();
    expect(screen.getByText('This is informational')).toBeInTheDocument();
  });

  it('displays technical details when provided', () => {
    render(
      <StandardErrorMessage
        severity="medium"
        title="Error with Details"
        message="Error occurred"
        technicalDetails="Stack trace: Error at line 123"
      />
    );

    expect(screen.getByText('Technical Details')).toBeInTheDocument();
    expect(screen.getByText('Stack trace: Error at line 123')).toBeInTheDocument();
  });

  it('displays suggestions when provided', () => {
    const suggestions = [
      'Try refreshing the page',
      'Clear your browser cache',
      'Contact support if the issue persists'
    ];

    render(
      <StandardErrorMessage
        severity="medium"
        title="Error with Suggestions"
        message="Something went wrong"
        suggestions={suggestions}
      />
    );

    expect(screen.getByText('Suggested Solutions:')).toBeInTheDocument();
    suggestions.forEach(suggestion => {
      expect(screen.getByText(suggestion)).toBeInTheDocument();
    });
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <StandardErrorMessage
        severity="medium"
        title="Custom Class Error"
        message="Error with custom styling"
        className="custom-error-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-error-class');
  });

  it('does not render suggestions section when empty', () => {
    render(
      <StandardErrorMessage
        severity="medium"
        title="No Suggestions Error"
        message="Error without suggestions"
        suggestions={[]}
      />
    );

    expect(screen.queryByText('Suggested Solutions:')).not.toBeInTheDocument();
  });

  it('does not render technical details when not provided', () => {
    render(
      <StandardErrorMessage
        severity="medium"
        title="Simple Error"
        message="Basic error message"
      />
    );

    expect(screen.queryByText('Technical Details')).not.toBeInTheDocument();
  });
});