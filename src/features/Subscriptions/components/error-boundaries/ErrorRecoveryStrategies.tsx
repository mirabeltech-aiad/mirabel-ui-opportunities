/**
 * @fileoverview Error Recovery Strategies
 * 
 * Provides standardized error recovery mechanisms and strategies
 * for different types of errors across the application.
 */

import React from 'react';
import { RefreshCw, Home, ArrowLeft, Settings, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '../../hooks/use-toast';

export interface RecoveryAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void | Promise<void>;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';
  disabled?: boolean;
}

interface ErrorRecoveryStrategiesProps {
  errorType: 'network' | 'data' | 'rendering' | 'permission' | 'generic';
  featureName?: string;
  onRetry?: () => void;
  onNavigateBack?: () => void;
  onNavigateHome?: () => void;
  customActions?: RecoveryAction[];
  className?: string;
}

/**
 * Standardized error recovery strategies component
 */
const ErrorRecoveryStrategies: React.FC<ErrorRecoveryStrategiesProps> = ({
  errorType,
  featureName,
  onRetry,
  onNavigateBack,
  onNavigateHome,
  customActions = [],
  className
}) => {
  const handleClearCache = async () => {
    try {
      // Clear browser cache
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      // Clear localStorage with feature-specific filtering
      if (featureName) {
        const featureKey = featureName.toLowerCase().replace(/\s+/g, '-');
        const keys = Object.keys(localStorage).filter(key => 
          key.includes(featureKey) || key.startsWith('tanstack_query_')
        );
        keys.forEach(key => localStorage.removeItem(key));
      }
      
      toast({
        title: "Cache Cleared",
        description: "Browser cache has been cleared. Please try again.",
      });
    } catch (error) {
      console.error('Failed to clear cache:', error);
      toast({
        title: "Cache Clear Failed",
        description: "Unable to clear cache. Please refresh the page manually.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadErrorReport = () => {
    const errorReport = {
      timestamp: new Date().toISOString(),
      feature: featureName,
      errorType,
      userAgent: navigator.userAgent,
      url: window.location.href,
      localStorage: Object.keys(localStorage),
      sessionStorage: Object.keys(sessionStorage)
    };
    
    const blob = new Blob([JSON.stringify(errorReport, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Error Report Downloaded",
      description: "Error report has been saved to your downloads.",
    });
  };

  const getDefaultActions = (): RecoveryAction[] => {
    const actions: RecoveryAction[] = [];

    // Always include retry if available
    if (onRetry) {
      actions.push({
        id: 'retry',
        label: 'Try Again',
        icon: <RefreshCw className="h-4 w-4" />,
        action: onRetry,
        variant: 'default'
      });
    }

    // Error type specific actions
    switch (errorType) {
      case 'network':
        actions.push({
          id: 'clear-cache',
          label: 'Clear Cache',
          icon: <Settings className="h-4 w-4" />,
          action: handleClearCache,
          variant: 'outline'
        });
        break;
        
      case 'data':
        actions.push({
          id: 'clear-cache',
          label: 'Clear Data Cache',
          icon: <Settings className="h-4 w-4" />,
          action: handleClearCache,
          variant: 'outline'
        });
        break;
        
      case 'permission':
        actions.push({
          id: 'refresh',
          label: 'Refresh Page',
          icon: <RefreshCw className="h-4 w-4" />,
          action: () => window.location.reload(),
          variant: 'outline'
        });
        break;
    }

    // Navigation actions
    if (onNavigateBack) {
      actions.push({
        id: 'back',
        label: 'Go Back',
        icon: <ArrowLeft className="h-4 w-4" />,
        action: onNavigateBack,
        variant: 'outline'
      });
    }

    if (onNavigateHome) {
      actions.push({
        id: 'home',
        label: 'Go Home',
        icon: <Home className="h-4 w-4" />,
        action: onNavigateHome,
        variant: 'outline'
      });
    }

    // Error reporting
    actions.push({
      id: 'download-report',
      label: 'Download Report',
      icon: <Download className="h-4 w-4" />,
      action: handleDownloadErrorReport,
      variant: 'secondary'
    });

    return actions;
  };

  const allActions = [...getDefaultActions(), ...customActions];

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {allActions.map((action) => (
        <Button
          key={action.id}
          variant={action.variant || 'outline'}
          size="sm"
          onClick={action.action}
          disabled={action.disabled}
          className="flex items-center gap-2"
        >
          {action.icon}
          {action.label}
        </Button>
      ))}
    </div>
  );
};

export default ErrorRecoveryStrategies;