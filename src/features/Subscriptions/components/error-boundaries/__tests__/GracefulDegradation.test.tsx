/**
 * @fileoverview Tests for Graceful Degradation Components
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import GracefulDegradation, {
  GracefulFallback,
  AnalyticsFallback,
  CirculationFallback,
  WidgetFallback,
  ChartFallback
} from '../GracefulDegradation';

describe('GracefulDegradation Components', () => {
  describe('GracefulFallback', () => {
    it('renders with title and description', () => {
      render(
        <GracefulFallback
          title="Test Feature Error"
          description="This is a test error description"
        />
      );

      expect(screen.getByText('Test Feature Error')).toBeInTheDocument();
      expect(screen.getByText('This is a test error description')).toBeInTheDocument();
    });

    it('renders actions when provided', () => {
      const mockAction = vi.fn();
      
      render(
        <GracefulFallback
          title="Test Feature Error"
          description="Test description"
          actions={[
            {
              label: 'Test Action',
              onClick: mockAction
            }
          ]}
        />
      );

      const actionButton = screen.getByText('Test Action');
      expect(actionButton).toBeInTheDocument();
      
      fireEvent.click(actionButton);
      expect(mockAction).toHaveBeenCalled();
    });

    it('renders children when provided', () => {
      render(
        <GracefulFallback
          title="Test Feature Error"
          description="Test description"
        >
          <div data-testid="test-child">Test Child Content</div>
        </GracefulFallback>
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });
  });

  describe('AnalyticsFallback', () => {
    it('renders analytics-specific fallback content', () => {
      render(<AnalyticsFallback />);

      expect(screen.getByText('Analytics Temporarily Unavailable')).toBeInTheDocument();
      expect(screen.getByText(/analytics data/)).toBeInTheDocument();
      expect(screen.getByText('Active Subscribers')).toBeInTheDocument();
      expect(screen.getByText('Monthly Revenue')).toBeInTheDocument();
    });

    it('calls onRetry when retry button is clicked', () => {
      const mockRetry = vi.fn();
      render(<AnalyticsFallback onRetry={mockRetry} />);

      const retryButton = screen.getByText('Retry Analytics');
      fireEvent.click(retryButton);
      
      expect(mockRetry).toHaveBeenCalled();
    });

    it('shows placeholder metrics', () => {
      render(<AnalyticsFallback />);

      const dashElements = screen.getAllByText('—');
      expect(dashElements).toHaveLength(4); // Four metric placeholders
    });
  });

  describe('CirculationFallback', () => {
    it('renders circulation-specific fallback content', () => {
      render(<CirculationFallback />);

      expect(screen.getByText('Circulation Data Temporarily Unavailable')).toBeInTheDocument();
      expect(screen.getByText(/circulation analytics/)).toBeInTheDocument();
      expect(screen.getByText('Alternative Actions:')).toBeInTheDocument();
    });

    it('provides alternative action suggestions', () => {
      render(<CirculationFallback />);

      expect(screen.getByText(/Access historical reports/)).toBeInTheDocument();
      expect(screen.getByText(/Check individual subscriber analytics/)).toBeInTheDocument();
    });

    it('calls onRetry when retry button is clicked', () => {
      const mockRetry = vi.fn();
      render(<CirculationFallback onRetry={mockRetry} />);

      const retryButton = screen.getByText('Retry Circulation Data');
      fireEvent.click(retryButton);
      
      expect(mockRetry).toHaveBeenCalled();
    });
  });

  describe('WidgetFallback', () => {
    it('renders compact fallback when compact prop is true', () => {
      render(
        <WidgetFallback
          widgetName="Test Widget"
          compact={true}
        />
      );

      expect(screen.getByText('Test Widget unavailable')).toBeInTheDocument();
    });

    it('renders full fallback when compact prop is false', () => {
      render(
        <WidgetFallback
          widgetName="Test Widget"
          compact={false}
        />
      );

      expect(screen.getByText('Test Widget')).toBeInTheDocument();
      expect(screen.getByText('This widget is temporarily unavailable')).toBeInTheDocument();
    });

    it('calls onRetry when retry button is clicked', () => {
      const mockRetry = vi.fn();
      render(
        <WidgetFallback
          widgetName="Test Widget"
          onRetry={mockRetry}
        />
      );

      const retryButton = screen.getByText('Retry Widget');
      fireEvent.click(retryButton);
      
      expect(mockRetry).toHaveBeenCalled();
    });
  });

  describe('ChartFallback', () => {
    it('renders chart fallback with custom height', () => {
      const { container } = render(
        <ChartFallback
          chartType="Line"
          height={400}
        />
      );

      const chartContainer = container.querySelector('[style*="height: 400px"]');
      expect(chartContainer).toBeInTheDocument();
    });

    it('displays chart type in error message', () => {
      render(
        <ChartFallback
          chartType="Bar"
        />
      );

      expect(screen.getByText('Bar Chart Unavailable')).toBeInTheDocument();
    });

    it('calls onRetry when retry button is clicked', () => {
      const mockRetry = vi.fn();
      render(
        <ChartFallback
          chartType="Line"
          onRetry={mockRetry}
        />
      );

      const retryButton = screen.getByText('Retry Chart');
      fireEvent.click(retryButton);
      
      expect(mockRetry).toHaveBeenCalled();
    });

    it('uses default height when not specified', () => {
      const { container } = render(
        <ChartFallback chartType="Pie" />
      );

      const chartContainer = container.querySelector('[style*="height: 300px"]');
      expect(chartContainer).toBeInTheDocument();
    });
  });
});