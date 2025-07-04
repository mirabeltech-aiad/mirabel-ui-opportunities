
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Props interface for the ErrorBoundary component
 */
interface Props {
  /** React children to be protected by the error boundary */
  children: ReactNode;
  /** Custom title for the error fallback UI (optional) */
  fallbackTitle?: string;
  /** Callback function called when an error is caught (optional) */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * Internal state interface for the ErrorBoundary component
 */
interface State {
  /** Whether an error has been caught */
  hasError: boolean;
  /** The caught error object (optional) */
  error?: Error;
}

/**
 * ErrorBoundary is a React class component that catches JavaScript errors
 * anywhere in the child component tree and displays a fallback UI.
 * 
 * @component
 * @example
 * ```tsx
 * <ErrorBoundary 
 *   fallbackTitle="Custom Error Title"
 *   onError={(error, errorInfo) => console.log(error)}
 * >
 *   <SomeComponent />
 * </ErrorBoundary>
 * ```
 * 
 * Features:
 * - Catches and handles React component errors
 * - Displays user-friendly fallback UI
 * - Shows error details in development mode
 * - Provides retry functionality
 * - Optional custom error handling via callback
 * - Customizable error title
 * 
 * @class
 */
class ErrorBoundary extends Component<Props, State> {
  /**
   * Creates an instance of ErrorBoundary
   * @param props - Component props
   */
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * Static method that updates state when an error is caught
   * @param error - The error that was thrown
   * @returns Updated state object
   */
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  /**
   * Lifecycle method called when an error is caught
   * Logs the error and calls the optional onError callback
   * @param error - The error that was thrown
   * @param errorInfo - Additional error information from React
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  /**
   * Resets the error boundary state to retry rendering
   * Called when the user clicks the "Try Again" button
   */
  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  /**
   * Renders either the fallback UI (if error) or the children (if no error)
   * @returns JSX element
   */
  render() {
    if (this.state.hasError) {
      return (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              {this.props.fallbackTitle || 'Something went wrong'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              An error occurred while rendering this section. Please try refreshing or contact support if the problem persists.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm font-mono text-destructive">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <Button onClick={this.handleRetry} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
