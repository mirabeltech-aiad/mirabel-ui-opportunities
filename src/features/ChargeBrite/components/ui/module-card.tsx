
/**
 * Module Card - Reusable card component for module displays
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModuleCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  status?: 'active' | 'inactive' | 'development' | 'error';
  version?: string;
  category?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  onAction?: () => void;
  actionLabel?: string;
  metrics?: Array<{
    label: string;
    value: string | number;
    color?: string;
  }>;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  description,
  icon: Icon,
  status = 'active',
  version,
  category,
  actions,
  children,
  className,
  onAction,
  actionLabel = 'View',
  metrics
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active': return 'bg-green-500 text-white';
      case 'inactive': return 'bg-gray-500 text-white';
      case 'development': return 'bg-amber-500 text-white';
      case 'error': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'active': return 'Active';
      case 'inactive': return 'Inactive';
      case 'development': return 'Development';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  return (
    <Card className={cn(
      'bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200',
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2 bg-ocean-50 rounded-md">
                <Icon className="h-5 w-5 text-ocean-600" />
              </div>
            )}
            <div>
              <CardTitle className="text-ocean-800 text-lg font-semibold">
                {title}
              </CardTitle>
              {description && (
                <p className="text-sm text-gray-600 mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor()}>
              {getStatusText()}
            </Badge>
            {version && (
              <Badge variant="outline" className="text-xs">
                v{version}
              </Badge>
            )}
            {category && (
              <Badge variant="outline" className="text-xs capitalize">
                {category}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Metrics */}
        {metrics && metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div 
                  className="text-2xl font-bold"
                  style={{ color: metric.color || '#059669' }}
                >
                  {metric.value}
                </div>
                <div className="text-xs text-gray-600">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Custom Content */}
        {children}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            {actions}
          </div>
          
          {onAction && (
            <Button 
              variant="ocean" 
              size="sm"
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleCard;
