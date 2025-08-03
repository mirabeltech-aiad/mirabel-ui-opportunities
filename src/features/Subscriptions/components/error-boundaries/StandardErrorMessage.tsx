/**
 * @fileoverview Standardized Error Message Component
 * 
 * Provides consistent error messaging patterns across all error boundaries
 * with standardized severity levels and recovery suggestions.
 */

import React from 'react';
import { AlertTriangle, XCircle, AlertCircle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type ErrorSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

interface StandardErrorMessageProps {
  severity: ErrorSeverity;
  title: string;
  message: string;
  technicalDetails?: string;
  suggestions?: string[];
  className?: string;
}

const severityConfig = {
  critical: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
    iconColor: 'text-red-500'
  },
  high: {
    icon: AlertTriangle,
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-800',
    iconColor: 'text-orange-500'
  },
  medium: {
    icon: AlertCircle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-800',
    iconColor: 'text-yellow-500'
  },
  low: {
    icon: AlertCircle,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-500'
  },
  info: {
    icon: Info,
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-800',
    iconColor: 'text-gray-500'
  }
};

/**
 * Standardized error message component with consistent styling and patterns
 */
const StandardErrorMessage: React.FC<StandardErrorMessageProps> = ({
  severity,
  title,
  message,
  technicalDetails,
  suggestions = [],
  className
}) => {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <div className={cn(
      'p-4 rounded-lg border',
      config.bgColor,
      config.borderColor,
      className
    )}>
      <div className="flex items-start gap-3">
        <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', config.iconColor)} />
        
        <div className="flex-1 min-w-0">
          <h3 className={cn('font-medium mb-2', config.textColor)}>
            {title}
          </h3>
          
          <p className={cn('text-sm mb-3', config.textColor)}>
            {message}
          </p>
          
          {technicalDetails && (
            <details className="mb-3">
              <summary className={cn('text-sm cursor-pointer', config.textColor)}>
                Technical Details
              </summary>
              <pre className={cn(
                'text-xs mt-2 p-2 rounded bg-white/50 overflow-x-auto',
                config.textColor
              )}>
                {technicalDetails}
              </pre>
            </details>
          )}
          
          {suggestions.length > 0 && (
            <div>
              <h4 className={cn('text-sm font-medium mb-2', config.textColor)}>
                Suggested Solutions:
              </h4>
              <ul className={cn('text-sm space-y-1', config.textColor)}>
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-xs">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StandardErrorMessage;