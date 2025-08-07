/**
 * @fileoverview Graceful Degradation Components
 * 
 * Provides fallback UI components that maintain functionality
 * when features encounter errors, ensuring the app remains usable.
 */

import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  AlertTriangle,
  RefreshCw,
  Eye,
  Download
} from 'lucide-react';
import { OceanButton } from '@/components/ui/design-system';

interface GracefulFallbackProps {
  title: string;
  description: string;
  icon?: ReactNode;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'outline' | 'primary' | 'secondary';
    icon?: ReactNode;
  }>;
  children?: ReactNode;
}

/**
 * Generic graceful fallback component for any feature
 */
export const GracefulFallback: React.FC<GracefulFallbackProps> = ({
  title,
  description,
  icon,
  actions = [],
  children
}) => {
  return (
    <Card className="bg-white shadow-sm border border-gray-200 rounded-lg">
      <CardHeader>
        <CardTitle className="text-ocean-800 flex items-center gap-2">
          {icon || <AlertTriangle className="h-5 w-5 text-orange-500" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              {description}
            </AlertDescription>
          </Alert>
          
          {children}
          
          {actions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {actions.map((action, index) => (
                <OceanButton
                  key={index}
                  variant={action.variant || 'outline'}
                  size="sm"
                  onClick={action.onClick}
                  className="flex items-center gap-2"
                >
                  {action.icon}
                  {action.label}
                </OceanButton>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Analytics-specific graceful degradation fallback
 */
export const AnalyticsFallback: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => {
  const mockMetrics = [
    { label: 'Active Subscribers', value: '—', icon: Users },
    { label: 'Monthly Revenue', value: '—', icon: DollarSign },
    { label: 'Growth Rate', value: '—', icon: TrendingUp },
    { label: 'Total Views', value: '—', icon: Eye }
  ];

  return (
    <GracefulFallback
      title="Analytics Temporarily Unavailable"
      description="We're experiencing issues loading your analytics data. Your core features remain fully functional."
      icon={<BarChart3 className="h-5 w-5 text-blue-500" />}
      actions={[
        {
          label: 'Retry Analytics',
          onClick: onRetry || (() => window.location.reload()),
          icon: <RefreshCw className="h-4 w-4" />
        },
        {
          label: 'Download Last Report',
          onClick: () => {/* Download last successful report */},
          variant: 'outline',
          icon: <Download className="h-4 w-4" />
        }
      ]}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {mockMetrics.map((metric, index) => (
          <Card key={index} className="bg-gray-50 border-gray-200">
            <CardContent className="p-4 text-center">
              <metric.icon className="h-6 w-6 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
              <p className="text-2xl font-bold text-gray-400">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-sm text-gray-600 text-center">
        Last successful data sync: Earlier today
      </p>
    </GracefulFallback>
  );
};

/**
 * Circulation-specific graceful degradation fallback
 */
export const CirculationFallback: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => {
  return (
    <GracefulFallback
      title="Circulation Data Temporarily Unavailable"
      description="We're having trouble loading circulation analytics. Other dashboard features are working normally."
      icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
      actions={[
        {
          label: 'Retry Circulation Data',
          onClick: onRetry || (() => window.location.reload()),
          icon: <RefreshCw className="h-4 w-4" />
        },
        {
          label: 'View Reports',
          onClick: () => window.location.href = '/reports',
          variant: 'outline'
        }
      ]}
    >
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Alternative Actions:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Access historical reports from the Reports section</li>
          <li>• Check individual subscriber analytics</li>
          <li>• Use the search function to find specific data</li>
          <li>• Export existing data for offline analysis</li>
        </ul>
      </div>
    </GracefulFallback>
  );
};

/**
 * Dashboard widget fallback for individual widget failures
 */
export const WidgetFallback: React.FC<{
  widgetName: string;
  onRetry?: () => void;
  compact?: boolean;
}> = ({ widgetName, onRetry, compact = false }) => {
  if (compact) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
        <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 mb-2">{widgetName} unavailable</p>
        {onRetry && (
          <OceanButton
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </OceanButton>
        )}
      </div>
    );
  }

  return (
    <Card className="bg-gray-50 border border-gray-200">
      <CardContent className="p-6 text-center">
        <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-gray-400" />
        <h3 className="font-medium text-gray-700 mb-2">{widgetName}</h3>
        <p className="text-sm text-gray-600 mb-4">
          This widget is temporarily unavailable
        </p>
        {onRetry && (
          <OceanButton
            variant="outline"
            size="sm"
            onClick={onRetry}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Widget
          </OceanButton>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Chart fallback for visualization errors
 */
export const ChartFallback: React.FC<{
  chartType: string;
  height?: number;
  onRetry?: () => void;
}> = ({ chartType, height = 300, onRetry }) => {
  return (
    <div 
      className="bg-gray-50 border border-gray-200 rounded-lg flex flex-col items-center justify-center"
      style={{ height: `${height}px` }}
    >
      <BarChart3 className="h-12 w-12 text-gray-400 mb-3" />
      <h3 className="font-medium text-gray-700 mb-2">
        {chartType} Chart Unavailable
      </h3>
      <p className="text-sm text-gray-600 mb-4 text-center max-w-xs">
        We're having trouble displaying this chart. Your data is safe.
      </p>
      {onRetry && (
        <OceanButton
          variant="outline"
          size="sm"
          onClick={onRetry}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry Chart
        </OceanButton>
      )}
    </div>
  );
};

export default {
  GracefulFallback,
  AnalyticsFallback,
  CirculationFallback,
  WidgetFallback,
  ChartFallback
};