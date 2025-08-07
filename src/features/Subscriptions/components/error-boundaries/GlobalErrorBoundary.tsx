/**
 * @fileoverview Global Error Boundary Component
 * 
 * Provides top-level error handling for the entire application.
 * Catches unhandled JavaScript errors and displays a fallback UI
 * with error reporting capabilities.
 * 
 * @example
 * ```tsx
 * <GlobalErrorBoundary>
 *   <App />
 * </GlobalErrorBoundary>
 * ```
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Bug, Home } from 'lucide-react';
import { OceanButton } from '../../components/ui/design-system';
import { toast } from '../../hooks/use-toast';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableErrorReporting?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

/**
 * Global error boundary that catches all unhandled errors in the application.
 * Provides error reporting, recovery options, and user-friendly messaging.
 */
class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { 
      hasError: true, 
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Global Error Boundary caught an error:', error, errorInfo);
    
    this.setState({ errorInfo });

    // Show toast notification for non-critical errors
    if (!this.isCriticalError(error)) {
      toast({
        title: "Something went wrong",
        description: "Don't worry, we're working on it. Try refreshing the page.",
        variant: "destructive"
      });
    }

    // Report error if enabled
    if (this.props.enableErrorReporting) {
      this.reportError(error, errorInfo);
    }

    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Determines if an error is critical and should show full error UI
   */
  private isCriticalError(error: Error): boolean {
    const criticalPatterns = [
      /ChunkLoadError/,
      /Loading chunk \d+ failed/,
      /Script error/,
      /Network error/,
      /SecurityError/
    ];

    return criticalPatterns.some(pattern => 
      pattern.test(error.message) || pattern.test(error.name)
    );
  }

  /**
   * Reports error to external service (placeholder for analytics/monitoring)
   */
  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // In a real app, this would send to Sentry, LogRocket, etc.
    // Report error to monitoring service with the following data:
    // {
    //   errorId: this.state.errorId,
    //   message: error.message,
    //   stack: error.stack,
    //   componentStack: errorInfo.componentStack,
    //   timestamp: new Date().toISOString(),
    //   userAgent: navigator.userAgent,
    //   url: window.location.href
    // }
  };

  /**
   * Handles the retry action by resetting the error state
   */
  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      errorId: undefined 
    });
  };

  /**
   * Navigates to home page
   */
  handleGoHome = () => {
    window.location.href = '/';
  };

  /**
   * Downloads error details for user to share with support
   */
  handleDownloadErrorDetails = () => {
    const errorDetails = {
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      error: {
        message: this.state.error?.message,
        stack: this.state.error?.stack,
        name: this.state.error?.name
      },
      componentStack: this.state.errorInfo?.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    const blob = new Blob([JSON.stringify(errorDetails, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `error-report-${this.state.errorId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  /**
   * Renders the global error fallback UI
   */
  renderErrorFallback() {
    if (this.props.fallback) {
      return this.props.fallback;
    }

    const isCritical = this.state.error ? this.isCriticalError(this.state.error) : true;

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full bg-white shadow-lg border border-gray-200 rounded-lg">
          <CardHeader>
            <CardTitle className="text-ocean-800 flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              {isCritical ? 'Application Error' : 'Something Went Wrong'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Error Message */}
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-red-800 font-medium mb-2">
                  {isCritical 
                    ? 'The application encountered an unexpected error and needs to be restarted.'
                    : 'We apologize for the inconvenience. This error has been logged and reported.'
                  }
                </p>
                {this.state.error && (
                  <details className="mt-3">
                    <summary className="text-red-600 text-sm cursor-pointer hover:text-red-700">
                      Technical Details
                    </summary>
                    <div className="mt-2 p-3 bg-red-100 rounded text-red-700 text-xs font-mono">
                      <div><strong>Error:</strong> {this.state.error.message}</div>
                      {this.state.errorId && (
                        <div className="mt-1"><strong>Error ID:</strong> {this.state.errorId}</div>
                      )}
                    </div>
                  </details>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
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
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh Page
                </OceanButton>

                <OceanButton
                  variant="outline"
                  size="sm"
                  onClick={this.handleGoHome}
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Go Home
                </OceanButton>

                {this.state.errorId && (
                  <OceanButton
                    variant="outline"
                    size="sm"
                    onClick={this.handleDownloadErrorDetails}
                    className="flex items-center gap-2"
                  >
                    <Bug className="h-4 w-4" />
                    Download Error Report
                  </OceanButton>
                )}
              </div>

              {/* Support Information */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  If this problem persists, please contact support with Error ID:{' '}
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                    {this.state.errorId || 'Unknown'}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      return this.renderErrorFallback();
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;