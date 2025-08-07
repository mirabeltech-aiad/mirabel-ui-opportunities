/**
 * @fileoverview Error Boundary Component for Reports Feature
 * 
 * Provides consistent error handling and fallback UI for the reports feature.
 * Catches JavaScript errors anywhere in the reports component tree and displays
 * a fallback UI instead of crashing the entire application.
 * 
 * @example
 * ```tsx
 * <ReportsErrorBoundary>
 *   <ReportsDirectory />
 * </ReportsErrorBoundary>
 * ```
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { OceanButton } from '../../../../components/ui/design-system';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error boundary component specifically designed for the reports feature.
 * Provides graceful error handling and recovery options.
 */
class ReportsErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Reports Error Boundary caught an error:', error, errorInfo);
    
    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Handles the retry action by resetting the error state
   */
  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  /**
   * Renders the error fallback UI
   */
  renderErrorFallback() {
    if (this.props.fallback) {
      return this.props.fallback;
    }

    return (
      <Card className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Reports Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-800 font-medium mb-2">
                Something went wrong while loading the reports.
              </p>
              <p className="text-red-600 text-sm">
                {this.state.error?.message || 'An unexpected error occurred.'}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <OceanButton
                variant="primary"
                size="sm"
                onClick={this.handleRetry}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </OceanButton>
              
              <OceanButton
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </OceanButton>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  render() {
    if (this.state.hasError) {
      return this.renderErrorFallback();
    }

    return this.props.children;
  }
}

export default ReportsErrorBoundary;