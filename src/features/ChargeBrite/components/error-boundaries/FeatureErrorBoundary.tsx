/**
 * @fileoverview Feature-Specific Error Boundary Component
 * 
 * Provides localized error handling for specific features/modules.
 * Designed to contain errors within feature boundaries while maintaining
 * the rest of the application functionality.
 * 
 * @example
 * ```tsx
 * <FeatureErrorBoundary featureName="Analytics">
 *   <AnalyticsDashboard />
 * </FeatureErrorBoundary>
 * ```
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, ArrowLeft, Settings } from 'lucide-react';
import { OceanButton } from '../../components/ui/design-system';
import { toast } from '../../hooks/use-toast';
import StandardErrorMessage from './StandardErrorMessage';
import ErrorRecoveryStrategies from './ErrorRecoveryStrategies';
import { 
  logError, 
  showErrorNotification, 
  handleErrorBoundaryError,
  type ErrorContext 
} from '../../utils/errorHandling';

interface Props {
  children: ReactNode;
  featureName: string;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onRetry?: () => void;
  onNavigateBack?: () => void;
  enableToast?: boolean;
  icon?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId?: string;
  retryCount: number;
}

/**
 * Feature-specific error boundary that provides isolated error handling
 * for individual features while preserving overall app functionality.
 */
class FeatureErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    const errorId = `FEAT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { 
      hasError: true, 
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Create error context for global error handling
    const errorContext: ErrorContext = {
      feature: this.props.featureName.toLowerCase(),
      component: 'FeatureErrorBoundary',
      action: 'component_error',
      additionalData: {
        componentStack: errorInfo.componentStack,
        retryCount: this.state.retryCount,
        maxRetries: this.maxRetries
      }
    };

    // Log error to global error handling system
    const errorId = handleErrorBoundaryError(error, errorInfo, this.props.featureName);
    
    // Update state with error ID from global system
    this.setState({ errorId });

    // Show user-friendly notification if enabled
    if (this.props.enableToast !== false) {
      showErrorNotification(
        error, 
        errorContext,
        `There was an issue loading ${this.props.featureName.toLowerCase()}. You can continue using other features.`
      );
    }

    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Handles the retry action with retry limit
   */
  handleRetry = () => {
    if (this.state.retryCount >= this.maxRetries) {
      toast({
        title: "Maximum retries reached",
        description: "Please refresh the page or navigate to another section.",
        variant: "destructive"
      });
      return;
    }

    this.setState(prevState => ({
      hasError: false,
      error: undefined,
      errorId: undefined,
      retryCount: prevState.retryCount + 1
    }));

    // Call optional retry callback
    if (this.props.onRetry) {
      this.props.onRetry();
    }

    toast({
      title: "Retrying...",
      description: `Attempting to reload ${this.props.featureName.toLowerCase()}.`
    });
  };

  /**
   * Handles navigation back to previous page or home
   */
  handleNavigateBack = () => {
    if (this.props.onNavigateBack) {
      this.props.onNavigateBack();
    } else {
      window.history.back();
    }
  };

  /**
   * Determines error type based on error message
   */
  getErrorType(): 'network' | 'data' | 'rendering' | 'permission' | 'generic' {
    const { error } = this.state;
    if (!error) return 'generic';
    
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
      return 'network';
    }
    if (message.includes('data') || message.includes('query') || message.includes('database')) {
      return 'data';
    }
    if (message.includes('render') || message.includes('jsx') || message.includes('component')) {
      return 'rendering';
    }
    if (message.includes('permission') || message.includes('unauthorized') || message.includes('forbidden')) {
      return 'permission';
    }
    
    return 'generic';
  }

  /**
   * Gets standardized error suggestions based on error type
   */
  getErrorSuggestions(): string[] {
    const errorType = this.getErrorType();
    const { featureName } = this.props;
    
    const baseSuggestions = {
      network: [
        'Check your internet connection',
        'Refresh the page to retry the request',
        'Clear your browser cache and try again'
      ],
      data: [
        'Refresh the page to reload the data',
        'Clear cached data and try again',
        'Check if the data source is available'
      ],
      rendering: [
        'Refresh the page to reload the component',
        'Clear browser cache and reload',
        'Report this issue if it persists'
      ],
      permission: [
        'Log out and log back in',
        'Check if you have proper access permissions',
        'Contact support if the issue persists'
      ],
      generic: [
        'Refresh the page and try again',
        'Clear browser cache',
        'Report this error if it continues'
      ]
    };
    
    return baseSuggestions[errorType];
  }

  /**
   * Renders feature-specific error fallback UI
   */
  renderErrorFallback() {
    if (this.props.fallback) {
      return this.props.fallback;
    }

    const { featureName, icon } = this.props;
    const { error, errorId, retryCount } = this.state;
    const errorType = this.getErrorType();
    const suggestions = this.getErrorSuggestions();

    return (
      <Card className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            {icon || <AlertTriangle className="h-5 w-5 text-red-500" />}
            {featureName} Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <StandardErrorMessage
              severity={errorType === 'network' ? 'medium' : errorType === 'permission' ? 'high' : 'medium'}
              title={`${featureName} Error`}
              message={error?.message || 'An unexpected error occurred in this feature.'}
              technicalDetails={errorId ? `Error ID: ${errorId}\nRetry attempts: ${retryCount}` : undefined}
              suggestions={suggestions}
            />
            
            <ErrorRecoveryStrategies
              errorType={errorType}
              featureName={featureName}
              onRetry={retryCount < 3 ? this.handleRetry : undefined}
              onNavigateBack={this.props.onNavigateBack}
              onNavigateHome={() => window.location.href = '/'}
            />
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

export default FeatureErrorBoundary;