/**
 * @fileoverview Error Monitoring Service
 * 
 * Provides advanced error monitoring, analytics, and reporting
 * capabilities integrated with the global error handling system.
 */

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  TrendingDown,
  TrendingUp,
  Clock,
  Users
} from 'lucide-react';
import { 
  getErrorLogs, 
  clearErrorLogs, 
  type ErrorLogEntry 
} from '@/utils/errorHandling';

interface ErrorMetrics {
  totalErrors: number;
  errorRate: number;
  criticalErrors: number;
  resolvedErrors: number;
  mostCommonError: string;
  featuresAffected: string[];
  uptimePercentage: number;
  lastErrorTime?: string;
}

interface ErrorMonitoringProps {
  updateInterval?: number;
  maxDisplayErrors?: number;
  showRealTime?: boolean;
}

/**
 * Advanced error monitoring dashboard component
 */
export const ErrorMonitoringDashboard: React.FC<ErrorMonitoringProps> = ({
  updateInterval = 30000, // 30 seconds
  maxDisplayErrors = 10,
  showRealTime = true
}) => {
  const [errorLogs, setErrorLogs] = useState<ErrorLogEntry[]>([]);
  const [metrics, setMetrics] = useState<ErrorMetrics>({
    totalErrors: 0,
    errorRate: 0,
    criticalErrors: 0,
    resolvedErrors: 0,
    mostCommonError: 'None',
    featuresAffected: [],
    uptimePercentage: 100
  });

  const updateMetrics = () => {
    const logs = getErrorLogs();
    setErrorLogs(logs.slice(-maxDisplayErrors));
    
    const now = Date.now();
    const last24Hours = now - (24 * 60 * 60 * 1000);
    const recentLogs = logs.filter(log => 
      new Date(log.timestamp).getTime() > last24Hours
    );

    // Calculate error metrics
    const totalErrors = recentLogs.length;
    const criticalErrors = recentLogs.filter(log => 
      log.error.message.includes('critical') || 
      log.error.message.includes('fatal') ||
      log.context?.feature === 'auth'
    ).length;

    // Group errors by message to find most common
    const errorGroups = recentLogs.reduce((acc, log) => {
      const key = log.error.message.substring(0, 50);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommonError = Object.keys(errorGroups).reduce((a, b) => 
      errorGroups[a] > errorGroups[b] ? a : b, 'None'
    );

    // Get affected features
    const featuresAffected = [...new Set(
      recentLogs.map(log => log.context?.feature).filter(Boolean)
    )] as string[];

    // Calculate uptime (simplified - based on error frequency)
    const errorRate = totalErrors / 24; // errors per hour
    const uptimePercentage = Math.max(0, Math.min(100, 100 - (errorRate * 2)));

    const lastError = recentLogs[recentLogs.length - 1];

    setMetrics({
      totalErrors,
      errorRate,
      criticalErrors,
      resolvedErrors: Math.max(0, logs.length - totalErrors),
      mostCommonError,
      featuresAffected,
      uptimePercentage,
      lastErrorTime: lastError?.timestamp
    });
  };

  useEffect(() => {
    updateMetrics();
    
    if (showRealTime) {
      const interval = setInterval(updateMetrics, updateInterval);
      return () => clearInterval(interval);
    }
  }, [updateInterval, showRealTime, maxDisplayErrors]);

  const getErrorSeverity = (error: ErrorLogEntry): 'low' | 'medium' | 'high' => {
    const message = error.error.message.toLowerCase();
    
    if (message.includes('critical') || message.includes('fatal') || 
        error.context?.feature === 'auth') {
      return 'high';
    }
    
    if (message.includes('network') || message.includes('permission')) {
      return 'medium';
    }
    
    return 'low';
  };

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'low': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    }
  };

  const handleClearErrors = () => {
    clearErrorLogs();
    updateMetrics();
  };

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Errors (24h)</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalErrors}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Errors</p>
                <p className="text-2xl font-bold text-red-600">{metrics.criticalErrors}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">System Uptime</p>
                <p className="text-2xl font-bold text-green-600">
                  {metrics.uptimePercentage.toFixed(1)}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <Progress 
              value={metrics.uptimePercentage} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Features Affected</p>
                <p className="text-2xl font-bold text-orange-600">
                  {metrics.featuresAffected.length}
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.uptimePercentage >= 99 ? (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  All systems operational. No critical issues detected.
                </AlertDescription>
              </Alert>
            ) : metrics.uptimePercentage >= 95 ? (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  Minor issues detected. System performance may be affected.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-red-200 bg-red-50">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  Critical issues detected. Multiple features may be affected.
                </AlertDescription>
              </Alert>
            )}

            {metrics.featuresAffected.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Affected Features:</h4>
                <div className="flex flex-wrap gap-2">
                  {metrics.featuresAffected.map(feature => (
                    <Badge key={feature} variant="outline" className="border-orange-200 text-orange-800">
                      {feature.charAt(0).toUpperCase() + feature.slice(1)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {metrics.lastErrorTime && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                Last error: {new Date(metrics.lastErrorTime).toLocaleString()}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Errors */}
      <Card className="bg-white border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Recent Error Log
          </CardTitle>
          <button
            onClick={handleClearErrors}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Clear Log
          </button>
        </CardHeader>
        <CardContent>
          {errorLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p>No recent errors logged</p>
            </div>
          ) : (
            <div className="space-y-3">
              {errorLogs.reverse().map(error => {
                const severity = getErrorSeverity(error);
                return (
                  <div
                    key={error.id}
                    className={`p-3 rounded-lg border ${getSeverityColor(severity)}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {error.error.message}
                        </p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span>{error.context?.feature || 'Unknown'}</span>
                          <span>{new Date(error.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className={getSeverityColor(severity)}>
                        {severity.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorMonitoringDashboard;