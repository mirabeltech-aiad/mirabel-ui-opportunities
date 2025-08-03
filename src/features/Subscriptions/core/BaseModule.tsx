
/**
 * Base Module - Template for creating new modules
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ModuleConfig } from './ModuleRegistry';

export interface BaseModuleProps {
  title: string;
  description?: string;
  version?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  status?: 'active' | 'inactive' | 'development';
}

export const BaseModule: React.FC<BaseModuleProps> = ({
  title,
  description,
  version,
  children,
  actions,
  status = 'active'
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'development': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="text-ocean-800 text-lg font-bold">
                {title}
              </CardTitle>
              <Badge className={`text-white ${getStatusColor()}`}>
                {status}
              </Badge>
              {version && (
                <Badge variant="outline" className="text-xs">
                  v{version}
                </Badge>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-2">
                {actions}
              </div>
            )}
          </div>
          {description && (
            <p className="text-sm text-gray-600 mt-2">
              {description}
            </p>
          )}
        </CardHeader>
      </Card>

      {/* Module Content */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

// Module template generator
export const createModuleTemplate = (
  config: Omit<ModuleConfig, 'component'>,
  Component: React.ComponentType
): ModuleConfig => {
  return {
    ...config,
    component: Component,
    enabled: true,
    version: config.version || '1.0.0'
  };
};

// Standard module wrapper
export const withModuleWrapper = <P extends object>(
  Component: React.ComponentType<P>,
  moduleConfig: {
    title: string;
    description?: string;
    version?: string;
    status?: 'active' | 'inactive' | 'development';
  }
) => {
  return (props: P) => (
    <BaseModule {...moduleConfig}>
      <Component {...props} />
    </BaseModule>
  );
};
